#include <windows.h>
#include <evntrace.h>
#include <evntcons.h>
#include <tdh.h>
#include <iostream>
#include <thread>
#include <string>

#pragma comment(lib, "tdh.lib")
#pragma comment(lib, "advapi32.lib")

#define SESSION_NAME L"SecureVaultProcessMonitor"

// Microsoft-Windows-Kernel-Process provider GUID: {22fb2cd6-0e7b-422b-a0c7-2fad1fd0e716}
static const GUID ProviderGuid = 
{ 0x22fb2cd6, 0x0e7b, 0x422b, { 0xa0, 0xc7, 0x2f, 0xad, 0x1f, 0xd0, 0xe7, 0x16 } };

// Globals to manage session state
TRACEHANDLE g_SessionHandle = 0;
TRACEHANDLE g_TraceHandle = 0;
std::thread g_TraceThread;
bool g_Running = true;

// Helper to extract a property value from ETW Event using TDH
std::wstring GetPropertyString(PEVENT_RECORD pEvent, const std::wstring& propertyName) {
    PROPERTY_DATA_DESCRIPTOR descriptor;
    descriptor.PropertyName = (ULONGLONG)propertyName.c_str();
    descriptor.ArrayIndex = 0xFFFFFFFF;

    DWORD bufferSize = 0;
    // Query required buffer size
    DWORD status = TdhGetPropertySize(pEvent, 0, NULL, 1, &descriptor, &bufferSize);
    if (status != ERROR_SUCCESS || bufferSize == 0) {
        return L"";
    }

    std::wstring result;
    BYTE* pBuffer = new BYTE[bufferSize];
    status = TdhGetProperty(pEvent, 0, NULL, 1, &descriptor, bufferSize, pBuffer);
    if (status == ERROR_SUCCESS) {
        // Assume Unicode string (ETW properties like ImageName/CommandLine are typically Unicode)
        result = std::wstring((wchar_t*)pBuffer, bufferSize / sizeof(wchar_t));
        // Strip trailing null characters if present
        while (!result.empty() && result.back() == L'\0') {
            result.pop_back();
        }
    }
    delete[] pBuffer;
    return result;
}

// Callback invoked by Windows whenever an ETW event is fired
VOID WINAPI ProcessEventRecord(PEVENT_RECORD pEvent) {
    // We only care about events from the Kernel-Process provider
    if (pEvent->EventHeader.ProviderId == ProviderGuid) {
        USHORT eventId = pEvent->EventHeader.EventDescriptor.Id;
        
        // Event ID 1 = Process Start (Creation)
        // Event ID 2 = Process Stop (Termination)
        if (eventId == 1) {
            DWORD pid = pEvent->EventHeader.ProcessId;
            
            // Extract attributes using TDH
            std::wstring imagePath = GetPropertyString(pEvent, L"ImageName");
            std::wstring commandLine = GetPropertyString(pEvent, L"CommandLine");
            
            // Note: Since properties are queried from event payload, process ID of spawned process
            // is often stored inside a specific property "ProcessID" or "ProcessId" within the event data.
            // Let's print out the details
            std::wcout << L"[+] PROCESS CREATION DETECTED" << std::endl;
            std::wcout << L"    Event Process ID (Parent): " << pid << std::endl;
            std::wcout << L"    Image Path: " << imagePath << std::endl;
            std::wcout << L"    Command Line: " << commandLine << std::endl;
            std::wcout << L"------------------------------------------------" << std::endl;
            
            // Real-world threat detection engine would execute heuristic checks here:
            // if (imagePath.find(L"mimikatz") != std::wstring::npos || commandLine.find(L"-enc") != std::wstring::npos) {
            //     TerminateProcessById(targetPid);
            // }
        }
    }
}

// Main trace thread function
void RunTraceSession() {
    EVENT_TRACE_LOGFILEW logFile = { 0 };
    logFile.LoggerName = (LPWSTR)SESSION_NAME;
    logFile.ProcessTraceMode = PROCESS_TRACE_MODE_REAL_TIME | PROCESS_TRACE_MODE_EVENT_RECORD;
    logFile.EventRecordCallback = ProcessEventRecord;

    g_TraceHandle = OpenTraceW(&logFile);
    if (g_TraceHandle == INVALID_PROCESSTRACE_HANDLE) {
        std::cerr << "[-] Failed to open ETW trace. Error: " << GetLastError() << std::endl;
        return;
    }

    std::cout << "[*] ETW Trace opened successfully. Listening for events..." << std::endl;
    
    // ProcessTrace blocks the calling thread until the session is stopped
    ULONG status = ProcessTrace(&g_TraceHandle, 1, NULL, NULL);
    if (status != ERROR_SUCCESS && status != ERROR_CTX_CLOSE_PENDING) {
        std::cerr << "[-] Error processing trace: " << status << std::endl;
    }
}

// Handler for Ctrl+C to clean up ETW sessions
BOOL WINAPI ConsoleHandler(DWORD signal) {
    if (signal == CTRL_C_EVENT) {
        std::cout << "\n[*] Stopping ETW Trace Session..." << std::endl;
        g_Running = false;
        
        // Stop the session
        if (g_SessionHandle) {
            EVENT_TRACE_PROPERTIES* properties = (EVENT_TRACE_PROPERTIES*)malloc(sizeof(EVENT_TRACE_PROPERTIES) + sizeof(SESSION_NAME));
            if (properties) {
                ZeroMemory(properties, sizeof(EVENT_TRACE_PROPERTIES) + sizeof(SESSION_NAME));
                properties->Wnode.BufferSize = sizeof(EVENT_TRACE_PROPERTIES) + sizeof(SESSION_NAME);
                properties->LoggerNameOffset = sizeof(EVENT_TRACE_PROPERTIES);
                ControlTraceW(0, SESSION_NAME, properties, EVENT_TRACE_CONTROL_STOP);
                free(properties);
            }
        }
        
        if (g_TraceThread.joinable()) {
            g_TraceThread.join();
        }
        
        std::cout << "[*] Cleanup complete. Exiting." << std::endl;
        ExitProcess(0);
    }
    return TRUE;
}

int main() {
    std::cout << "==================================================" << std::endl;
    std::cout << "   SECUREVAULT REAL-TIME PROCESS MONITOR (WLA)    " << std::endl;
    std::cout << "==================================================" << std::endl;
    
    // Set Console Ctrl handler for clean exit
    SetConsoleCtrlHandler(ConsoleHandler, TRUE);

    // Setup ETW session properties
    ULONG bufferSize = sizeof(EVENT_TRACE_PROPERTIES) + sizeof(SESSION_NAME);
    EVENT_TRACE_PROPERTIES* properties = (EVENT_TRACE_PROPERTIES*)malloc(bufferSize);
    if (!properties) {
        std::cerr << "[-] Out of memory" << std::endl;
        return 1;
    }

    ZeroMemory(properties, bufferSize);
    properties->Wnode.BufferSize = bufferSize;
    properties->Wnode.Flags = WNODE_FLAG_TRACED_GUID;
    properties->Wnode.ClientContext = 1; // Query performance counter for timestamp
    properties->LogFileMode = EVENT_TRACE_REAL_TIME_MODE;
    properties->LoggerNameOffset = sizeof(EVENT_TRACE_PROPERTIES);
    
    // First, try to stop any existing trace with the same name to prevent collisions
    ControlTraceW(0, SESSION_NAME, properties, EVENT_TRACE_CONTROL_STOP);

    // Start a new trace session
    ULONG status = StartTraceW(&g_SessionHandle, SESSION_NAME, properties);
    if (status != ERROR_SUCCESS) {
        std::cerr << "[-] Failed to start ETW trace session. Error: " << status << std::endl;
        std::cerr << "[!] Note: You MUST run this application as ADMINISTRATOR." << std::endl;
        free(properties);
        return 1;
    }
    free(properties);

    std::cout << "[*] ETW Trace Session '" << std::string(SESSION_NAME, SESSION_NAME + wcslen(SESSION_NAME)) << "' started." << std::endl;

    // Enable the Microsoft-Windows-Kernel-Process provider for our session
    status = EnableTraceEx2(
        g_SessionHandle,
        &ProviderGuid,
        EVENT_CONTROL_CODE_ENABLE_PROVIDER,
        TRACE_LEVEL_INFORMATION,
        0, // MatchAnyKeyword (retrieve all events)
        0, // MatchAllKeyword
        0, // Timeout
        NULL // EnableParameters
    );

    if (status != ERROR_SUCCESS) {
        std::cerr << "[-] Failed to enable Microsoft-Windows-Kernel-Process provider. Error: " << status << std::endl;
        return 1;
    }
    std::cout << "[*] Process Provider enabled. Registering callbacks..." << std::endl;

    // Start trace consumer in a separate thread so main doesn't block forever
    g_TraceThread = std::thread(RunTraceSession);

    // Keep running until Ctrl+C
    while (g_Running) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }

    return 0;
}

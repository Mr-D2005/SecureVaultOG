import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RavanActions } from '../utils/RavanActions';
import { RavanIntelligence } from '../utils/RavanIntelligence';
import './AICommandHub.css';

/**
 * Integrated Ravan Command Hub (v3 Codex Tool)
 * A professional, modular AI integration.
 */
const AICommandHub = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    { text: "Codex Link Alpha-9 Active. Awaiting vault instruction.", type: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUserInput = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { text, type: 'user' }]);
    setInputValue('');
    setIsProcessing(true);

    const result = await RavanIntelligence.chat(text, messages.slice(-5));
    let reply = result.reply;

    // Dispatcher: Trigger tasks based on AI Intent
    if (reply.includes('[ACTION:UPLOAD]')) fileInputRef.current?.click();
    
    if (reply.includes('[ACTION:ENCRYPT]')) {
      if (selectedFile) {
        const status = await RavanActions.executeEncrypt(selectedFile, (msg) => setMessages(p => [...p, {text: msg, type: 'bot'}]));
        reply += `\n\nSYSTEM_LOG: ${status}`;
      } else {
        reply += "\n\nREJECTION: No asset staged. Please drop a file first.";
      }
    }

    if (reply.includes('[ACTION:DETECT]')) {
      if (selectedFile) {
        const status = await RavanActions.executeDetect(selectedFile, (msg) => setMessages(p => [...p, {text: msg, type: 'bot'}]));
        reply += `\n\nFORENSIC_LOG: ${status}`;
      } else {
        reply += "\n\nREJECTION: No image staged for scan.";
      }
    }

    if (reply.includes('[ACTION:EXTRACT]')) {
      if (selectedFile) {
        const status = await RavanActions.executeExtract(selectedFile, (msg) => setMessages(p => [...p, {text: msg, type: 'bot'}]));
        reply += `\n\nEXTRACTION_LOG: ${status}`;
      } else {
        reply += "\n\nREJECTION: No media staged for extraction.";
      }
    }

    if (reply.includes('[ACTION:HIDE:')) {
      const match = reply.match(/\[ACTION:HIDE:(.*?)\]/);
      const secret = match ? match[1] : null;
      if (selectedFile && secret) {
        const status = await RavanActions.executeHide(selectedFile, secret, (msg) => setMessages(p => [...p, {text: msg, type: 'bot'}]));
        reply += `\n\nINJECTION_LOG: ${status}`;
      } else if (!selectedFile) {
        reply += "\n\nREJECTION: No carrier asset staged for injection.";
      }
    }

    if (reply.includes('[ACTION:NAV_DECRYPT]')) setTimeout(() => navigate('/decrypt'), 500);
    if (reply.includes('[ACTION:NAV_DASHBOARD]')) setTimeout(() => navigate('/dashboard'), 500);
    if (reply.includes('[ACTION:NAV_FILES]')) setTimeout(() => navigate('/files'), 500);

    const cleanReply = reply.replace(/\[ACTION:.*\]/g, '').trim();
    setMessages(prev => [...prev, { text: cleanReply, type: 'bot' }]);
    setIsProcessing(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setMessages(prev => [...prev, { text: `Asset ${file.name} staged for processing.`, type: 'bot' }]);
    }
  };

  return (
    <div className={`ai-command-hub ${isOpen ? 'open' : 'minimized'}`} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <div className="hub-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="hub-status-light"></div>
        <span className="hub-title">RAVAN CODEX v3.0</span>
        <button className="hub-toggle">{isOpen ? '−' : '+'}</button>
      </div>

      {isOpen && (
        <>
          <div className="hub-terminal">
            {messages.map((msg, i) => (
              <div key={i} className={`hub-msg ${msg.type}`}>
                <span className="hub-msg-tag">{msg.type === 'bot' ? 'RAVAN>' : 'USER>'}</span>
                <span className="hub-msg-text">{msg.text}</span>
              </div>
            ))}
            {isProcessing && <div className="hub-msg bot blink">Neural Handshake Active...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="hub-input-area">
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{display: 'none'}} 
              onChange={(e) => {
                if(e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                  setMessages(prev => [...prev, { text: `File received: ${e.target.files[0].name}.`, type: 'bot' }]);
                }
              }} 
            />
            <form onSubmit={(e) => { e.preventDefault(); handleUserInput(inputValue); }}>
              <input 
                className="hub-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message Ravan Codex..."
                autoFocus
              />
            </form>
          </div>
          
          {selectedFile && (
            <div className="hub-staging">
              <span className="staging-label">STAGED: {selectedFile.name}</span>
              <div className="staging-actions">
                <button onClick={() => handleUserInput("encrypt this file")}>SEAL</button>
                <button onClick={() => handleUserInput("scan this image")}>SCAN</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AICommandHub;

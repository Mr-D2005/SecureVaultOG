import os
import math
import numpy as np
import matplotlib.pyplot as plt

def calculate_shannon_entropy(data):
    """Calculates the Shannon Entropy of a byte chunk."""
    if not data:
        return 0
    entropy = 0
    for x in range(256):
        p_x = float(data.count(x)) / len(data)
        if p_x > 0:
            entropy += - p_x * math.log2(p_x)
    return entropy

def extract_entropy_signal(filepath, chunk_size=8, max_chunks=2000):
    """Reads a file in micro-chunks and calculates the entropy of each chunk."""
    entropy_signal = []
    with open(filepath, "rb") as f:
        for _ in range(max_chunks):
            chunk = f.read(chunk_size)
            if not chunk:
                break
            entropy_signal.append(calculate_shannon_entropy(chunk))
    return np.array(entropy_signal)

def analyze_fft_periodicity(entropy_signal):
    """
    Applies Fast Fourier Transform (FFT) to the entropy signal.
    Returns the frequencies and their magnitudes.
    """
    # Remove the mean (DC component) so we only analyze variance/frequencies
    signal_centered = entropy_signal - np.mean(entropy_signal)
    
    # Calculate Real FFT
    fft_vals = np.fft.rfft(signal_centered)
    fft_mag = np.abs(fft_vals)
    
    # Calculate frequencies (cycles per chunk)
    freqs = np.fft.rfftfreq(len(entropy_signal))
    
    return freqs, fft_mag

def analyze_and_plot(files_to_test, output_img="fft_analysis_results.png"):
    """Runs the algorithm on multiple files and graphs the proof."""
    print("Running FFT Analysis on test data...")
    fig, axes = plt.subplots(len(files_to_test), 2, figsize=(14, 4 * len(files_to_test)))
    fig.subplots_adjust(hspace=0.4)
    
    for i, file_path in enumerate(files_to_test):
        name = os.path.basename(file_path)
        print(f" -> Analyzing {name}...")
        
        # 1. Get Entropy Signal
        signal = extract_entropy_signal(file_path, chunk_size=8, max_chunks=1000)
        
        # 2. Get FFT Magnitudes
        freqs, fft_mag = analyze_fft_periodicity(signal)
        
        # 3. Detect Anomaly — Z-Score Statistical Test (The Patentable Mathematical Rule)
        # Skip frequency index 0 (DC component = average level, not a pattern)
        fft_mag_no_dc = fft_mag[1:]
        max_mag = np.max(fft_mag_no_dc)
        mean_mag = np.mean(fft_mag_no_dc)
        std_mag = np.std(fft_mag_no_dc)
        
        # Z-Score: How many standard deviations is the peak above the average?
        # If Z > 8, a single dominant frequency exists = periodic = RANSOMWARE
        z_score = (max_mag - mean_mag) / std_mag if std_mag > 0 else 0
        is_anomalous = z_score > 8.0  # Proprietary Z-Score threshold
        
        title_color = 'red' if is_anomalous else 'green'
        status = f"RANSOMWARE DETECTED (Z={z_score:.1f})" if is_anomalous else f"CLEAN (Z={z_score:.1f})"
        
        # Plot Time-Series Entropy
        ax1 = axes[i, 0] if len(files_to_test) > 1 else axes[0]
        ax1.plot(signal, color='cyan' if not is_anomalous else 'red')
        ax1.set_title(f"Time-Series Entropy: {name}", color=title_color)
        ax1.set_xlabel("Chunk Index (8 bytes each)")
        ax1.set_ylabel("Shannon Entropy")
        ax1.set_ylim(0, 8.5)
        ax1.grid(True, alpha=0.3)
        ax1.set_facecolor('#1e1e1e')
        
        # Plot FFT Frequency Magnitudes
        ax2 = axes[i, 1] if len(files_to_test) > 1 else axes[1]
        ax2.plot(freqs[1:], fft_mag_no_dc, color='magenta' if is_anomalous else 'lime')
        ax2.set_title(f"FFT Frequency Domain [{status}]", color=title_color)
        ax2.set_xlabel("Frequency")
        ax2.set_ylabel("Magnitude")
        ax2.grid(True, alpha=0.3)
        ax2.set_facecolor('#1e1e1e')

    # Style figure
    fig.patch.set_facecolor('#121212')
    for ax in axes.flat:
        ax.tick_params(colors='white')
        ax.xaxis.label.set_color('white')
        ax.yaxis.label.set_color('white')

    plt.savefig(output_img, facecolor=fig.get_facecolor())
    print(f"\n[+] Analysis complete! Mathematical proof saved to {output_img}")

if __name__ == "__main__":
    files = [
        "test_data/normal_document.txt",
        "test_data/compressed_document.zip",
        "test_data/infected_document.bin"
    ]
    analyze_and_plot(files, "test_data/fft_analysis_results.png")

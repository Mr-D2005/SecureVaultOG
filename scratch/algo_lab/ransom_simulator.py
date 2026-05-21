import os
import random
import string
import zipfile

def generate_normal_file(filepath, size_kb=100):
    """Generates a file with normal, low-entropy text data."""
    print(f"Generating normal file: {filepath}")
    with open(filepath, "wb") as f:
        # Generate predictable text (low entropy)
        words = ["encrypt", "malware", "cybersecurity", "python", "algorithm", "entropy", "variance", "defense"]
        for _ in range(size_kb * 1024 // 8): # approx length
            chunk = random.choice(words).encode() + b" "
            f.write(chunk[:8].ljust(8, b" ")) # normalize to 8 bytes for math consistency

def apply_intermittent_encryption(source_file, dest_file, chunk_size=16):
    """
    Simulates advanced ransomware by encrypting every alternating chunk.
    This bypasses normal AV entropy checks because overall entropy stays low.
    """
    print(f"Simulating intermittent encryption: {dest_file}")
    with open(source_file, "rb") as f_in, open(dest_file, "wb") as f_out:
        while True:
            # Write 1 plain chunk
            plain_chunk = f_in.read(chunk_size)
            if not plain_chunk:
                break
            f_out.write(plain_chunk)
            
            # Read next chunk and 'encrypt' it (replace with high entropy random bytes)
            target_chunk = f_in.read(chunk_size)
            if not target_chunk:
                break
            encrypted_chunk = os.urandom(len(target_chunk))
            f_out.write(encrypted_chunk)

def create_zip_file(source_file, dest_file):
    """Creates a normal compressed file (which has high entropy but no periodicity)."""
    print(f"Creating normal compressed zip: {dest_file}")
    with zipfile.ZipFile(dest_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(source_file, os.path.basename(source_file))

if __name__ == "__main__":
    os.makedirs("test_data", exist_ok=True)
    
    normal_file = "test_data/normal_document.txt"
    infected_file = "test_data/infected_document.bin"
    zipped_file = "test_data/compressed_document.zip"
    
    generate_normal_file(normal_file, size_kb=100)
    apply_intermittent_encryption(normal_file, infected_file, chunk_size=16)
    create_zip_file(normal_file, zipped_file)
    
    print("\n[+] Simulation data generated successfully.")

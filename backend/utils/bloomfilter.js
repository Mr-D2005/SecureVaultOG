// backend/utils/bloomfilter.js
// Probabilistic data structure for tracking nonces to prevent replay attacks
// with a bounded memory footprint.

class SimpleBloomFilter {
  constructor(size = 10000) {
    this.size = size;
    this.bitArray = new Uint8Array(Math.ceil(size / 8));
  }

  // A simple hash function to map a string to a bit index
  _hash(str, seed = 0) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return Math.abs((h + seed) % this.size);
  }

  add(item) {
    const hash1 = this._hash(item, 1);
    const hash2 = this._hash(item, 2);
    
    this.bitArray[Math.floor(hash1 / 8)] |= (1 << (hash1 % 8));
    this.bitArray[Math.floor(hash2 / 8)] |= (1 << (hash2 % 8));
  }

  has(item) {
    const hash1 = this._hash(item, 1);
    const hash2 = this._hash(item, 2);
    
    const bit1 = this.bitArray[Math.floor(hash1 / 8)] & (1 << (hash1 % 8));
    const bit2 = this.bitArray[Math.floor(hash2 / 8)] & (1 << (hash2 % 8));
    
    return bit1 !== 0 && bit2 !== 0;
  }
}

// Global bloom filter instance.
// In production, you would rotate this periodically (e.g., every hour)
// to prevent it from filling up and increasing false positives.
const nonceFilter = new SimpleBloomFilter(100000);

module.exports = nonceFilter;

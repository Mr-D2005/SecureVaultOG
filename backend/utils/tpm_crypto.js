const crypto = require('crypto');

// Deterministic PRNG using Mulberry32
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

class TreeParityMachine {
    constructor(k = 3, n = 50, l = 4, seed = 12345) {
        this.k = k;
        this.n = n;
        this.l = l;
        this.weights = [];
        this.seed = seed;
        this.prng = mulberry32(seed);

        // Initialize random weights between -L and L
        for (let i = 0; i < k; i++) {
            let row = [];
            for (let j = 0; j < n; j++) {
                row.push(Math.floor(this.prng() * (2 * l + 1)) - l);
            }
            this.weights.push(row);
        }
    }

    // Generates the next random input vector of size KxN (-1 or 1)
    generateInputVector() {
        let x = [];
        for (let i = 0; i < this.k; i++) {
            let row = [];
            for (let j = 0; j < this.n; j++) {
                row.push(this.prng() > 0.5 ? 1 : -1);
            }
            x.push(row);
        }
        return x;
    }

    // Compute the output tau for a given input x
    computeOutput(x) {
        let h = [];
        for (let i = 0; i < this.k; i++) {
            let sum = 0;
            for (let j = 0; j < this.n; j++) {
                sum += this.weights[i][j] * x[i][j];
            }
            h.push(sum > 0 ? 1 : -1); // sign function
        }
        let tau = h.reduce((acc, val) => acc * val, 1);
        return { tau, h };
    }

    // Update weights using Hebbian learning
    updateWeights(x, h, tau) {
        for (let i = 0; i < this.k; i++) {
            if (h[i] === tau) {
                for (let j = 0; j < this.n; j++) {
                    this.weights[i][j] += x[i][j] * tau;
                    // Clamp
                    if (this.weights[i][j] > this.l) this.weights[i][j] = this.l;
                    if (this.weights[i][j] < -this.l) this.weights[i][j] = -this.l;
                }
            }
        }
    }

    // Batch sync for SERVER: Process a list of outputs from the other party
    // Returns our outputs for the same inputs
    syncBatch(otherOutputs) {
        this.prng = mulberry32(this.seed);
        let myOutputs = [];
        for (let i = 0; i < otherOutputs.length; i++) {
            let x = this.generateInputVector();
            let { tau, h } = this.computeOutput(x);
            myOutputs.push(tau);

            let tau_other = otherOutputs[i];
            if (tau === tau_other) {
                this.updateWeights(x, h, tau);
            }
        }
        return myOutputs;
    }

    // Derive a 256-bit AES key from the current weights
    getDerivedKey() {
        let flatWeights = this.weights.flat().join(',');
        return crypto.createHash('sha256').update(flatWeights).digest();
    }
}

// Convert an array of 1s and -1s into a hex string for transmission
function encodeOutputs(outputs) {
    let bits = outputs.map(o => o === 1 ? '1' : '0').join('');
    let hex = '';
    for (let i = 0; i < bits.length; i += 4) {
        let chunk = bits.substring(i, i + 4);
        chunk = chunk.padEnd(4, '0');
        hex += parseInt(chunk, 2).toString(16);
    }
    return hex;
}

// Convert a hex string back into an array of 1s and -1s
function decodeOutputs(hex, expectedLength) {
    let bits = '';
    for (let i = 0; i < hex.length; i++) {
        bits += parseInt(hex[i], 16).toString(2).padStart(4, '0');
    }
    let outputs = [];
    for (let i = 0; i < expectedLength; i++) {
        outputs.push(bits[i] === '1' ? 1 : -1);
    }
    return outputs;
}

module.exports = {
    TreeParityMachine,
    encodeOutputs,
    decodeOutputs
};

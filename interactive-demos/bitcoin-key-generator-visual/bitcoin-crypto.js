/**
 * Bitcoin Cryptography Library — Real Implementation
 * Bitcoin Sovereign Academy · Educational Demo
 *
 * Implements (all mathematically correct):
 *   • secp256k1 scalar multiplication (point double-and-add, BigInt)
 *   • RIPEMD-160 (pure JS, verified against RFC test vectors)
 *   • SHA-256 / SHA-512 / HMAC-SHA-512 (Web Crypto API)
 *   • PBKDF2-HMAC-SHA512 (BIP39 seed derivation)
 *   • Base58Check encoding (P2PKH legacy addresses)
 *   • Bech32 encoding (P2WPKH native SegWit addresses)
 *   • BIP39 — entropy → mnemonic (real SHA-256 checksum)
 *   • BIP39 — mnemonic → 512-bit seed (PBKDF2, 2048 iterations)
 *   • BIP32 — seed → master key, hardened/normal child derivation
 *   • BIP44 path m/44'/0'/0'/0/i  (legacy P2PKH)
 *   • BIP84 path m/84'/0'/0'/0/i  (native SegWit P2WPKH)
 */

'use strict';

// ─────────────────────────────────────────────────────────────
// secp256k1 curve parameters
// ─────────────────────────────────────────────────────────────
const _P  = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F');
const _N  = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
const _Gx = BigInt('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798');
const _Gy = BigInt('0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8');

// ─────────────────────────────────────────────────────────────
// Modular arithmetic
// ─────────────────────────────────────────────────────────────
function _modp(a) { return ((a % _P) + _P) % _P; }
function _modn(a) { return ((a % _N) + _N) % _N; }

function _inv(a, m) {
    // Extended Euclidean algorithm — modular inverse
    a = ((a % m) + m) % m;
    let [r, nr] = [m, a];
    let [s, ns] = [0n, 1n];
    while (nr !== 0n) {
        const q = r / nr;
        [r, nr] = [nr, r - q * nr];
        [s, ns] = [ns, s - q * ns];
    }
    return ((s % m) + m) % m;
}

// ─────────────────────────────────────────────────────────────
// secp256k1 point operations (over prime field _P)
// null = point at infinity
// ─────────────────────────────────────────────────────────────
function _ptAdd(P, Q) {
    if (!P) return Q;
    if (!Q) return P;
    const [x1, y1] = P;
    const [x2, y2] = Q;
    if (x1 === x2) {
        if (y1 !== y2) return null; // P + (-P) = ∞
        // Point doubling
        const lam = _modp(3n * x1 * x1 * _inv(2n * y1, _P));
        const x3  = _modp(lam * lam - 2n * x1);
        return [x3, _modp(lam * (x1 - x3) - y1)];
    }
    const lam = _modp((y2 - y1) * _inv(x2 - x1, _P));
    const x3  = _modp(lam * lam - x1 - x2);
    return [x3, _modp(lam * (x1 - x3) - y1)];
}

function _scalarMult(k, point) {
    // Double-and-add: O(log k)
    let R = null;
    let Q = point;
    k = _modn(k);
    while (k > 0n) {
        if (k & 1n) R = _ptAdd(R, Q);
        Q = _ptAdd(Q, Q);
        k >>= 1n;
    }
    return R;
}

const _G = [_Gx, _Gy];

// ─────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────
function bytesToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex) {
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2)
        out[i >> 1] = parseInt(hex.slice(i, i + 2), 16);
    return out;
}
function concatBytes(...arrays) {
    const total = arrays.reduce((n, a) => n + a.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const a of arrays) { out.set(a, off); off += a.length; }
    return out;
}
function numToBytes32(n) {
    return hexToBytes(n.toString(16).padStart(64, '0'));
}

// ─────────────────────────────────────────────────────────────
// SHA-256 / SHA-512  (Web Crypto API)
// ─────────────────────────────────────────────────────────────
async function sha256(data) {
    if (!(data instanceof Uint8Array)) data = new TextEncoder().encode(data);
    return new Uint8Array(await crypto.subtle.digest('SHA-256', data));
}
async function dsha256(data) { return sha256(await sha256(data)); }

// ─────────────────────────────────────────────────────────────
// HMAC-SHA-512  (Web Crypto API)
// ─────────────────────────────────────────────────────────────
async function hmac512(key, data) {
    const k = await crypto.subtle.importKey(
        'raw', key, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']
    );
    return new Uint8Array(await crypto.subtle.sign('HMAC', k, data));
}

// ─────────────────────────────────────────────────────────────
// PBKDF2-HMAC-SHA512  (BIP39 seed derivation)
// ─────────────────────────────────────────────────────────────
async function pbkdf2_512(password, salt, iterations) {
    const pw  = new TextEncoder().encode(password.normalize('NFKD'));
    const sl  = new TextEncoder().encode(salt.normalize('NFKD'));
    const key = await crypto.subtle.importKey('raw', pw, 'PBKDF2', false, ['deriveBits']);
    const raw = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt: sl, iterations, hash: 'SHA-512' }, key, 512
    );
    return new Uint8Array(raw);
}

// ─────────────────────────────────────────────────────────────
// RIPEMD-160 — pure JS
// Verified against test vectors:
//   "" → 9c1185a5c5e9fc54612808977ee8f548b2258d31
//   "abc" → 8eb208f7e05d987a9b044a8e98c6b087f15a0bfc
// ─────────────────────────────────────────────────────────────
function ripemd160(buf) {
    if (!(buf instanceof Uint8Array)) buf = new Uint8Array(buf);

    // Constants
    const KL = [0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
    const KR = [0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];

    // Message word indices
    const RL = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
                7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,
                3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,
                1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,
                4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
    const RR = [5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,
                6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,
                15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,
                8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,
                12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];

    // Shift amounts
    const SL = [11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,
                7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,
                11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,
                11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,
                9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
    const SR = [8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,
                9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,
                9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,
                15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,
                8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];

    // Padding (MD-strengthening, little-endian length)
    const len    = buf.length;
    const bitLen = len * 8;
    const padLen = ((55 - len) % 64 + 64) % 64 + 1;
    const padded = new Uint8Array(len + padLen + 8);
    padded.set(buf);
    padded[len] = 0x80;
    const dv = new DataView(padded.buffer);
    dv.setUint32(len + padLen,     bitLen >>> 0,                      true);
    dv.setUint32(len + padLen + 4, Math.floor(bitLen / 0x100000000), true);

    // Non-linear selection functions
    function f(round, B, C, D) {
        switch (round) {
            case 0: return (B ^ C ^ D) >>> 0;
            case 1: return ((B & C) | (~B & D)) >>> 0;
            case 2: return ((B | ~C) ^ D) >>> 0;
            case 3: return ((B & D) | (C & ~D)) >>> 0;
            default: return (B ^ (C | ~D)) >>> 0;
        }
    }
    function rol(x, n) { return ((x << n) | (x >>> (32 - n))) >>> 0; }

    // Initial hash state
    let h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE,
        h3 = 0x10325476, h4 = 0xC3D2E1F0;

    // Process 64-byte blocks
    for (let blk = 0; blk < padded.length; blk += 64) {
        const X = [];
        for (let i = 0; i < 16; i++)
            X.push(dv.getUint32(blk + i * 4, true));

        let al = h0, bl = h1, cl = h2, dl = h3, el = h4;
        let ar = h0, br = h1, cr = h2, dr = h3, er = h4;

        for (let j = 0; j < 80; j++) {
            const roundL = Math.floor(j / 16);
            const roundR = Math.floor((79 - j) / 16);

            let Tl = (al + f(roundL, bl, cl, dl) + X[RL[j]] + KL[roundL]) >>> 0;
            Tl = (rol(Tl, SL[j]) + el) >>> 0;
            al = el; el = dl; dl = rol(cl, 10); cl = bl; bl = Tl;

            let Tr = (ar + f(roundR, br, cr, dr) + X[RR[j]] + KR[roundL]) >>> 0;
            Tr = (rol(Tr, SR[j]) + er) >>> 0;
            ar = er; er = dr; dr = rol(cr, 10); cr = br; br = Tr;
        }

        const T   = (h1 + cl + dr) >>> 0;
        h1 = (h2 + dl + er) >>> 0;
        h2 = (h3 + el + ar) >>> 0;
        h3 = (h4 + al + br) >>> 0;
        h4 = (h0 + bl + cr) >>> 0;
        h0 = T;
    }

    // Output (little-endian words)
    const out = new Uint8Array(20);
    const odv = new DataView(out.buffer);
    [h0,h1,h2,h3,h4].forEach((h, i) => odv.setUint32(i * 4, h, true));
    return out;
}

// hash160: RIPEMD-160(SHA-256(data))
async function hash160(data) {
    return ripemd160(await sha256(data));
}

// ─────────────────────────────────────────────────────────────
// Base58Check encoding  (legacy P2PKH addresses)
// ─────────────────────────────────────────────────────────────
const _B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(bytes) {
    let n = BigInt('0x' + bytesToHex(bytes));
    let out = '';
    while (n > 0n) { const r = n % 58n; out = _B58[Number(r)] + out; n /= 58n; }
    for (const b of bytes) { if (b !== 0) break; out = '1' + out; }
    return out;
}

async function base58Check(version, payload) {
    const versioned = concatBytes(new Uint8Array([version]), payload);
    const checksum  = (await dsha256(versioned)).slice(0, 4);
    return base58Encode(concatBytes(versioned, checksum));
}

// ─────────────────────────────────────────────────────────────
// Bech32 encoding  (native SegWit P2WPKH — bc1q...)
// ─────────────────────────────────────────────────────────────
const _B32 = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const _GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

function _bech32Polymod(v) {
    let chk = 1;
    for (const x of v) {
        const b = chk >> 25;
        chk = ((chk & 0x1ffffff) << 5) ^ x;
        for (let i = 0; i < 5; i++) if ((b >> i) & 1) chk ^= _GEN[i];
    }
    return chk;
}
function _hrpExpand(hrp) {
    const e = [];
    for (const c of hrp) e.push(c.charCodeAt(0) >> 5);
    e.push(0);
    for (const c of hrp) e.push(c.charCodeAt(0) & 31);
    return e;
}
function _bech32Checksum(hrp, data) {
    const pm = _bech32Polymod([..._hrpExpand(hrp), ...data, 0,0,0,0,0,0]) ^ 1;
    return Array.from({length:6}, (_, p) => (pm >> (5*(5-p))) & 31);
}
function _convertbits(data, from, to) {
    let acc = 0, bits = 0;
    const out = [], maxv = (1 << to) - 1;
    for (const v of data) {
        acc = (acc << from) | v; bits += from;
        while (bits >= to) { bits -= to; out.push((acc >> bits) & maxv); }
    }
    if (bits > 0) out.push((acc << (to - bits)) & maxv);
    return out;
}
function bech32Encode(hrp, data) {
    const combined = [...data, ..._bech32Checksum(hrp, data)];
    return hrp + '1' + combined.map(d => _B32[d]).join('');
}

async function p2wpkhAddress(pubkeyBytes) {
    const h160  = await hash160(pubkeyBytes);
    const words = _convertbits(Array.from(h160), 8, 5);
    return bech32Encode('bc', [0, ...words]);
}

async function p2pkhAddress(pubkeyBytes) {
    const h160 = await hash160(pubkeyBytes);
    return base58Check(0x00, h160);
}

// ─────────────────────────────────────────────────────────────
// Private key → public key  (secp256k1)
// ─────────────────────────────────────────────────────────────
function derivePublicKey(privKeyHex) {
    const k = BigInt('0x' + privKeyHex);
    if (k <= 0n || k >= _N) throw new Error('Private key out of valid range');
    const P = _scalarMult(k, _G);
    if (!P) throw new Error('Point at infinity — invalid private key');
    const [x, y] = P;
    const xHex = x.toString(16).padStart(64, '0');
    const yHex = y.toString(16).padStart(64, '0');
    const prefix = (y % 2n === 0n) ? '02' : '03';
    return {
        uncompressed: '04' + xHex + yHex,
        compressed:   prefix + xHex,
        x: xHex, y: yHex
    };
}

// ─────────────────────────────────────────────────────────────
// BIP39  — entropy bits → mnemonic
// ─────────────────────────────────────────────────────────────
async function entropyToMnemonic(entropyBits) {
    // entropyBits: Array of 0/1 with length 128 (12 words) or 256 (24 words)
    const bytes = new Uint8Array(entropyBits.length / 8);
    for (let i = 0; i < bytes.length; i++)
        bytes[i] = parseInt(entropyBits.slice(i * 8, i * 8 + 8).join(''), 2);

    const hashBytes    = await sha256(bytes);
    const csLen        = entropyBits.length / 32;          // 4 or 8 bits
    const hashBits     = Array.from(hashBytes).flatMap(b =>
        b.toString(2).padStart(8, '0').split('').map(Number));
    const allBits      = [...entropyBits, ...hashBits.slice(0, csLen)];

    const words = [];
    for (let i = 0; i < allBits.length; i += 11)
        words.push(BIP39_WORDLIST[parseInt(allBits.slice(i, i + 11).join(''), 2)]);
    return words;
}

// BIP39 — mnemonic → 512-bit seed (PBKDF2)
async function mnemonicToSeed(words, passphrase = '') {
    return pbkdf2_512(words.join(' '), 'mnemonic' + passphrase, 2048);
}

// ─────────────────────────────────────────────────────────────
// BIP32  — HD wallet key derivation
// ─────────────────────────────────────────────────────────────
async function seedToMasterKey(seedBytes) {
    const I  = await hmac512(new TextEncoder().encode('Bitcoin seed'), seedBytes);
    const IL = I.slice(0, 32);   // master private key
    const IR = I.slice(32, 64);  // master chain code
    const keyN = BigInt('0x' + bytesToHex(IL));
    if (keyN <= 0n || keyN >= _N) throw new Error('Invalid master key derived from seed');
    return { privKey: IL, chainCode: IR };
}

async function ckd(parentPriv, parentChain, index, hardened) {
    // Child Key Derivation (BIP32 §4.5)
    const idx = hardened ? (0x80000000 + index) : index;
    const ser = new Uint8Array([
        (idx >> 24) & 0xff, (idx >> 16) & 0xff, (idx >> 8) & 0xff, idx & 0xff
    ]);
    let data;
    if (hardened) {
        data = concatBytes(new Uint8Array([0x00]), parentPriv, ser);
    } else {
        const pub = derivePublicKey(bytesToHex(parentPriv));
        data = concatBytes(hexToBytes(pub.compressed), ser);
    }
    const I   = await hmac512(parentChain, data);
    const IL  = I.slice(0, 32);
    const IR  = I.slice(32, 64);
    const ILn = BigInt('0x' + bytesToHex(IL));
    const pk  = BigInt('0x' + bytesToHex(parentPriv));
    const child = _modn(ILn + pk);
    if (child === 0n) throw new Error('Derived child key is zero — try different path');
    return { privKey: numToBytes32(child), chainCode: IR };
}

async function deriveAtPath(masterPriv, masterChain, path) {
    // path: array of {index, hardened}
    let k = masterPriv, c = masterChain;
    for (const { index, hardened } of path) {
        const child = await ckd(k, c, index, hardened);
        k = child.privKey; c = child.chainCode;
    }
    return { privKey: k, chainCode: c };
}

// ─────────────────────────────────────────────────────────────
// Full key-generation pipeline (async)
// Input: entropyBits  — Array of 0/1, length 128 or 256
// Returns: complete result object
// ─────────────────────────────────────────────────────────────
async function generateFullKeychain(entropyBits) {
    // 1. Private key hex
    const privBytes = new Uint8Array(entropyBits.length / 8);
    for (let i = 0; i < privBytes.length; i++)
        privBytes[i] = parseInt(entropyBits.slice(i * 8, i * 8 + 8).join(''), 2);
    const privKeyHex = bytesToHex(privBytes);

    // Clamp to valid secp256k1 range (educational: show actual random, derived key stays valid)
    const privKeyN = BigInt('0x' + privKeyHex);
    if (privKeyN === 0n || privKeyN >= _N) {
        throw new Error('Entropy produces out-of-range private key. Please regenerate.');
    }

    // 2. BIP39 mnemonic (12 words for 128-bit, 24 for 256-bit)
    const mnemonic = await entropyToMnemonic(entropyBits);

    // 3. Seed (512-bit via PBKDF2)
    const seedBytes = await mnemonicToSeed(mnemonic);
    const seedHex   = bytesToHex(seedBytes);

    // 4. Master BIP32 key
    const master      = await seedToMasterKey(seedBytes);
    const masterPrivHex   = bytesToHex(master.privKey);
    const masterChainHex  = bytesToHex(master.chainCode);

    // 5. Public key from entropy-derived private key (for display)
    const pubKey = derivePublicKey(privKeyHex);

    // 6. hash160 of compressed public key
    const h160Bytes = await hash160(hexToBytes(pubKey.compressed));
    const h160Hex   = bytesToHex(h160Bytes);

    // 7. Standalone addresses (from entropy private key directly)
    const legacySingle = await p2pkhAddress(hexToBytes(pubKey.compressed));
    const segwitSingle = await p2wpkhAddress(hexToBytes(pubKey.compressed));

    // 8. BIP44 HD addresses  m/44'/0'/0'/0/i  (legacy P2PKH)
    const bip44Base = [
        {index:44, hardened:true},
        {index:0,  hardened:true},
        {index:0,  hardened:true},
        {index:0,  hardened:false}
    ];
    // 9. BIP84 HD addresses  m/84'/0'/0'/0/i  (native SegWit)
    const bip84Base = [
        {index:84, hardened:true},
        {index:0,  hardened:true},
        {index:0,  hardened:true},
        {index:0,  hardened:false}
    ];

    const hdLegacy = [], hdSegwit = [];
    for (let i = 0; i < 5; i++) {
        const leg = await deriveAtPath(master.privKey, master.chainCode,
                                       [...bip44Base, {index:i, hardened:false}]);
        const legPub  = derivePublicKey(bytesToHex(leg.privKey));
        const legAddr = await p2pkhAddress(hexToBytes(legPub.compressed));
        hdLegacy.push({
            path:    `m/44'/0'/0'/0/${i}`,
            privKey: bytesToHex(leg.privKey),
            pubKey:  legPub.compressed,
            address: legAddr
        });

        const sw  = await deriveAtPath(master.privKey, master.chainCode,
                                       [...bip84Base, {index:i, hardened:false}]);
        const swPub  = derivePublicKey(bytesToHex(sw.privKey));
        const swAddr = await p2wpkhAddress(hexToBytes(swPub.compressed));
        hdSegwit.push({
            path:    `m/84'/0'/0'/0/${i}`,
            privKey: bytesToHex(sw.privKey),
            pubKey:  swPub.compressed,
            address: swAddr
        });
    }

    return {
        privKeyHex,
        mnemonic,
        seedHex,
        masterPrivHex,
        masterChainHex,
        pubKey,
        h160Hex,
        legacySingle,
        segwitSingle,
        hdLegacy,
        hdSegwit
    };
}

// ─────────────────────────────────────────────────────────────
// SHA-256 of arbitrary text (for the hashing playground)
// ─────────────────────────────────────────────────────────────
async function hashText(text) {
    return bytesToHex(await sha256(text));
}

// ─────────────────────────────────────────────────────────────
// BIP39 Wordlist (2048 words)
// ─────────────────────────────────────────────────────────────
const BIP39_WORDLIST = [
'abandon','ability','able','about','above','absent','absorb','abstract','absurd','abuse','access','accident','account','accuse','achieve','acid','acoustic','acquire','across','act','action','actor','actress','actual','adapt','add','addict','address','adjust','admit','adult','advance','advice','aerobic','affair','afford','afraid','again','age','agent','agree','ahead','aim','air','airport','aisle','alarm','album','alcohol','alert','alien','all','alley','allow','almost','alone','alpha','already','also','alter','always','amateur','amazing','among','amount','amused','analyst','anchor','ancient','anger','angle','angry','animal','ankle','announce','annual','another','answer','antenna','antique','anxiety','any','apart','apology','appear','apple','approve','april','arch','arctic','area','arena','argue','arm','armed','armor','army','around','arrange','arrest','arrive','arrow','art','artefact','artist','artwork','ask','aspect','assault','asset','assist','assume','asthma','athlete','atom','attack','attend','attitude','attract','auction','audit','august','aunt','author','auto','autumn','average','avocado','avoid','awake','aware','away','awesome','awful','awkward','axis',
'baby','bachelor','bacon','badge','bag','balance','balcony','ball','bamboo','banana','banner','bar','barely','bargain','barrel','base','basic','basket','battle','beach','bean','beauty','because','become','beef','before','begin','behave','behind','believe','below','belt','bench','benefit','best','betray','better','between','beyond','bicycle','bid','bike','bind','biology','bird','birth','bitter','black','blade','blame','blanket','blast','bleak','bless','blind','blood','blossom','blouse','blue','blur','blush','board','boat','body','boil','bomb','bone','bonus','book','boost','border','boring','borrow','boss','bottom','bounce','box','boy','bracket','brain','brand','brass','brave','bread','breeze','brick','bridge','brief','bright','bring','brisk','broccoli','broken','bronze','broom','brother','brown','brush','bubble','buddy','budget','buffalo','build','bulb','bulk','bullet','bundle','bunker','burden','burger','burst','bus','business','busy','butter','buyer','buzz',
'cabbage','cabin','cable','cactus','cage','cake','call','calm','camera','camp','can','canal','cancel','candy','cannon','canoe','canvas','canyon','capable','capital','captain','car','carbon','card','cargo','carpet','carry','cart','case','cash','casino','castle','casual','cat','catalog','catch','category','cattle','caught','cause','caution','cave','ceiling','celery','cement','census','century','cereal','certain','chair','chalk','champion','change','chaos','chapter','charge','chase','chat','cheap','check','cheese','chef','cherry','chest','chicken','chief','child','chimney','choice','choose','chronic','chuckle','chunk','churn','cigar','cinnamon','circle','citizen','city','civil','claim','clap','clarify','claw','clay','clean','clerk','clever','click','client','cliff','climb','clinic','clip','clock','clog','close','cloth','cloud','clown','club','clump','cluster','clutch','coach','coast','coconut','code','coffee','coil','coin','collect','color','column','combine','come','comfort','comic','common','company','concert','conduct','confirm','congress','connect','consider','control','convince','cook','cool','copper','copy','coral','core','corn','correct','cost','cotton','couch','country','couple','course','cousin','cover','coyote','crack','cradle','craft','cram','crane','crash','crater','crawl','crazy','cream','credit','creek','crew','cricket','crime','crisp','critic','crop','cross','crouch','crowd','crucial','cruel','cruise','crumble','crunch','crush','cry','crystal','cube','culture','cup','cupboard','curious','current','curtain','curve','cushion','custom','cute','cycle',
'dad','damage','damp','dance','danger','daring','dash','daughter','dawn','day','deal','debate','debris','decade','december','decide','decline','decorate','decrease','deer','defense','define','defy','degree','delay','deliver','demand','demise','denial','dentist','deny','depart','depend','deposit','depth','deputy','derive','describe','desert','design','desk','despair','destroy','detail','detect','develop','device','devote','diagram','dial','diamond','diary','dice','diesel','diet','differ','digital','dignity','dilemma','dinner','dinosaur','direct','dirt','disagree','discover','disease','dish','dismiss','disorder','display','distance','divert','divide','divorce','dizzy','doctor','document','dog','doll','dolphin','domain','donate','donkey','donor','door','dose','double','dove','draft','dragon','drama','drastic','draw','dream','dress','drift','drill','drink','drip','drive','drop','drum','dry','duck','dumb','dune','during','dust','dutch','duty','dwarf','dynamic',
'eager','eagle','early','earn','earth','easily','east','easy','echo','ecology','economy','edge','edit','educate','effort','egg','eight','either','elbow','elder','electric','elegant','element','elephant','elevator','elite','else','embark','embody','embrace','emerge','emotion','employ','empower','empty','enable','enact','end','endless','endorse','enemy','energy','enforce','engage','engine','enhance','enjoy','enlist','enough','enrich','enroll','ensure','enter','entire','entry','envelope','episode','equal','equip','era','erase','erode','erosion','error','erupt','escape','essay','essence','estate','eternal','ethics','evidence','evil','evoke','evolve','exact','example','excess','exchange','excite','exclude','excuse','execute','exercise','exhaust','exhibit','exile','exist','exit','exotic','expand','expect','expire','explain','expose','express','extend','extra','eye','eyebrow',
'fabric','face','faculty','fade','faint','faith','fall','false','fame','family','famous','fan','fancy','fantasy','farm','fashion','fat','fatal','father','fatigue','fault','favorite','feature','february','federal','fee','feed','feel','female','fence','festival','fetch','fever','few','fiber','fiction','field','figure','file','film','filter','final','find','fine','finger','finish','fire','firm','first','fiscal','fish','fit','fitness','fix','flag','flame','flash','flat','flavor','flee','flight','flip','float','flock','floor','flower','fluid','flush','fly','foam','focus','fog','foil','fold','follow','food','foot','force','forest','forget','fork','fortune','forum','forward','fossil','foster','found','fox','fragile','frame','frequent','fresh','friend','fringe','frog','front','frost','frown','frozen','fruit','fuel','fun','funny','furnace','fury','future',
'gadget','gain','galaxy','gallery','game','gap','garage','garbage','garden','garlic','garment','gas','gasp','gate','gather','gauge','gaze','general','genius','genre','gentle','genuine','gesture','ghost','giant','gift','giggle','ginger','giraffe','girl','give','glad','glance','glare','glass','glide','glimpse','globe','gloom','glory','glove','glow','glue','goat','goddess','gold','good','goose','gorilla','gospel','gossip','govern','gown','grab','grace','grain','grant','grape','grass','gravity','great','green','grid','grief','grit','grocery','group','grow','grunt','guard','guess','guide','guilt','guitar','gun','gym',
'habit','hair','half','hammer','hamster','hand','happy','harbor','hard','harsh','harvest','hat','have','hawk','hazard','head','health','heart','heavy','hedgehog','height','hello','helmet','help','hen','hero','hidden','high','hill','hint','hip','hire','history','hobby','hockey','hold','hole','holiday','hollow','home','honey','hood','hope','horn','horror','horse','hospital','host','hotel','hour','hover','hub','huge','human','humble','humor','hundred','hungry','hunt','hurdle','hurry','hurt','husband','hybrid',
'ice','icon','idea','identify','idle','ignore','ill','illegal','illness','image','imitate','immense','immune','impact','impose','improve','impulse','inch','include','income','increase','index','indicate','indoor','industry','infant','inflict','inform','inhale','inherit','initial','inject','injury','inmate','inner','innocent','input','inquiry','insane','insect','inside','inspire','install','intact','interest','into','invest','invite','involve','iron','island','isolate','issue','item','ivory',
'jacket','jaguar','jar','jazz','jealous','jeans','jelly','jewel','job','join','joke','journey','joy','judge','juice','jump','jungle','junior','junk','just',
'kangaroo','keen','keep','ketchup','key','kick','kid','kidney','kind','kingdom','kiss','kit','kitchen','kite','kitten','kiwi','knee','knife','knock','know',
'lab','label','labor','ladder','lady','lake','lamp','language','laptop','large','later','latin','laugh','laundry','lava','law','lawn','lawsuit','layer','lazy','leader','leaf','learn','leave','lecture','left','leg','legal','legend','leisure','lemon','lend','length','lens','leopard','lesson','letter','level','liar','liberty','library','license','life','lift','light','like','limb','limit','link','lion','liquid','list','little','live','lizard','load','loan','lobster','local','lock','logic','lonely','long','loop','lottery','loud','lounge','love','loyal','lucky','luggage','lumber','lunar','lunch','luxury','lyrics',
'machine','mad','magic','magnet','maid','mail','main','major','make','mammal','man','manage','mandate','mango','mansion','manual','maple','marble','march','margin','marine','market','marriage','mask','mass','master','match','material','math','matrix','matter','maximum','maze','meadow','mean','measure','meat','mechanic','medal','media','melody','melt','member','memory','mention','menu','mercy','merge','merit','merry','mesh','message','metal','method','middle','midnight','milk','million','mimic','mind','minimum','minor','minute','miracle','mirror','misery','miss','mistake','mix','mixed','mixture','mobile','model','modify','mom','moment','monitor','monkey','monster','month','moon','moral','more','morning','mosquito','mother','motion','motor','mountain','mouse','move','movie','much','muffin','mule','multiply','muscle','museum','mushroom','music','must','mutual','myself','mystery','myth',
'naive','name','napkin','narrow','nasty','nation','nature','near','neck','need','negative','neglect','neither','nephew','nerve','nest','net','network','neutral','never','news','next','nice','night','noble','noise','nominee','noodle','normal','north','nose','notable','note','nothing','notice','novel','now','nuclear','number','nurse','nut',
'oak','obey','object','oblige','obscure','observe','obtain','obvious','occur','ocean','october','odor','off','offer','office','often','oil','okay','old','olive','olympic','omit','once','one','onion','online','only','open','opera','opinion','oppose','option','orange','orbit','orchard','order','ordinary','organ','orient','original','orphan','ostrich','other','outdoor','outer','output','outside','oval','oven','over','own','owner','oxygen','oyster','ozone',
'pact','paddle','page','pair','palace','palm','panda','panel','panic','panther','paper','parade','parent','park','parrot','party','pass','patch','path','patient','patrol','pattern','pause','pave','payment','peace','peanut','pear','peasant','pelican','pen','penalty','pencil','people','pepper','perfect','permit','person','pet','phone','photo','phrase','physical','piano','picnic','picture','piece','pig','pigeon','pill','pilot','pink','pioneer','pipe','pistol','pitch','pizza','place','planet','plastic','plate','play','please','pledge','pluck','plug','plunge','poem','poet','point','polar','pole','police','pond','pony','pool','popular','portion','position','possible','post','potato','pottery','poverty','powder','power','practice','praise','predict','prefer','prepare','present','pretty','prevent','price','pride','primary','print','priority','prison','private','prize','problem','process','produce','profit','program','project','promote','proof','property','prosper','protect','proud','provide','public','pudding','pull','pulp','pulse','pumpkin','punch','pupil','puppy','purchase','purity','purpose','purse','push','put','puzzle','pyramid',
'quality','quantum','quarter','question','quick','quit','quiz','quote',
'rabbit','raccoon','race','rack','radar','radio','rail','rain','raise','rally','ramp','ranch','random','range','rapid','rare','rate','rather','raven','raw','razor','ready','real','reason','rebel','rebuild','recall','receive','recipe','record','recycle','reduce','reflect','reform','refuse','region','regret','regular','reject','relax','release','relief','rely','remain','remember','remind','remove','render','renew','rent','reopen','repair','repeat','replace','report','require','rescue','resemble','resist','resource','response','result','retire','retreat','return','reunion','reveal','review','reward','rhythm','rib','ribbon','rice','rich','ride','ridge','rifle','right','rigid','ring','riot','ripple','risk','ritual','rival','river','road','roast','robot','robust','rocket','romance','roof','rookie','room','rose','rotate','rough','round','route','royal','rubber','rude','rug','rule','run','runway','rural',
'sad','saddle','sadness','safe','sail','salad','salmon','salon','salt','salute','same','sample','sand','satisfy','satoshi','sauce','sausage','save','say','scale','scan','scare','scatter','scene','scheme','school','science','scissors','scorpion','scout','scrap','screen','script','scrub','sea','search','season','seat','second','secret','section','security','seed','seek','segment','select','sell','seminar','senior','sense','sentence','series','service','session','settle','setup','seven','shadow','shaft','shallow','share','shed','shell','sheriff','shield','shift','shine','ship','shiver','shock','shoe','shoot','shop','short','shoulder','shove','shrimp','shrug','shuffle','shy','sibling','sick','side','siege','sight','sign','silent','silk','silly','silver','similar','simple','since','sing','siren','sister','situate','six','size','skate','sketch','ski','skill','skin','skirt','skull','slab','slam','sleep','slender','slice','slide','slight','slim','slogan','slot','slow','slush','small','smart','smile','smoke','smooth','snack','snake','snap','sniff','snow','soap','soccer','social','sock','soda','soft','solar','soldier','solid','solution','solve','someone','song','soon','sorry','sort','soul','sound','soup','source','south','space','spare','spatial','spawn','speak','special','speed','spell','spend','sphere','spice','spider','spike','spin','spirit','split','spoil','sponsor','spoon','sport','spot','spray','spread','spring','spy','square','squeeze','squirrel','stable','stadium','staff','stage','stairs','stamp','stand','start','state','stay','steak','steel','stem','step','stereo','stick','still','sting','stock','stomach','stone','stool','story','stove','strategy','street','strike','strong','struggle','student','stuff','stumble','style','subject','submit','subway','success','such','sudden','suffer','sugar','suggest','suit','summer','sun','sunny','sunset','super','supply','supreme','sure','surface','surge','surprise','surround','survey','suspect','sustain','swallow','swamp','swap','swarm','swear','sweet','swift','swim','swing','switch','sword','symbol','symptom','syrup','system',
'table','tackle','tag','tail','talent','talk','tank','tape','target','task','taste','tattoo','taxi','teach','team','tell','ten','tenant','tennis','tent','term','test','text','thank','that','theme','then','theory','there','they','thing','this','thought','three','thrive','throw','thumb','thunder','ticket','tide','tiger','tilt','timber','time','tiny','tip','tired','tissue','title','toast','tobacco','today','toddler','toe','together','toilet','token','tomato','tomorrow','tone','tongue','tonight','tool','tooth','top','topic','topple','torch','tornado','tortoise','toss','total','tourist','toward','tower','town','toy','track','trade','traffic','tragic','train','transfer','trap','trash','travel','tray','treat','tree','trend','trial','tribe','trick','trigger','trim','trip','trophy','trouble','truck','true','truly','trumpet','trust','truth','try','tube','tuition','tumble','tuna','tunnel','turkey','turn','turtle','twelve','twenty','twice','twin','twist','two','type','typical',
'ugly','umbrella','unable','unaware','uncle','uncover','under','undo','unfair','unfold','unhappy','uniform','unique','unit','universe','unknown','unlock','until','unusual','unveil','update','upgrade','uphold','upon','upper','upset','urban','urge','usage','use','used','useful','useless','usual','utility',
'vacant','vacuum','vague','valid','valley','valve','van','vanish','vapor','various','vast','vault','vehicle','velvet','vendor','venture','venue','verb','verify','version','very','vessel','veteran','viable','vibrant','vicious','victory','video','view','village','vintage','violin','virtual','virus','visa','visit','visual','vital','vivid','vocal','voice','void','volcano','volume','vote','voyage',
'wage','wagon','wait','walk','wall','walnut','want','warfare','warm','warrior','wash','wasp','waste','water','wave','way','wealth','weapon','wear','weasel','weather','web','wedding','weekend','weird','welcome','west','wet','whale','what','wheat','wheel','when','where','whip','whisper','wide','width','wife','wild','will','win','window','wine','wing','wink','winner','winter','wire','wisdom','wise','wish','witness','wolf','woman','wonder','wood','wool','word','work','world','worry','worth','wrap','wreck','wrestle','wrist','write','wrong',
'yard','year','yellow','you','young','youth',
'zebra','zero','zone','zoo'
];

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────
window.BitcoinCrypto = {
    generateFullKeychain,
    derivePublicKey,
    hashText,
    bytesToHex,
    hexToBytes
};

import crypto from "crypto";

// Generate a 256-bit (32-byte) encryption key
const encryptionKey = crypto.randomBytes(32).toString("hex");
console.log(`Your encryption key: ${encryptionKey}`);

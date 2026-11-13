// src/auth/passwords.js
import crypto from 'node:crypto';

/**
 * Hashes a password using scrypt.
 * Returns an object with the hash and the salt.
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

/**
 * Verifies a plaintext password against a stored hash and salt.
 * Returns true if it matches, false otherwise.
 */
export function verifyPassword(password, storedHash, storedSalt) {
  // 1. Hash the incoming password using the stored salt
  const hashBuffer = crypto.scryptSync(password, storedSalt, 64);
  
  // 2. Convert the stored hash from a hex string back to a Buffer
  const storedHashBuffer = Buffer.from(storedHash, 'hex');

  // 3. Check if they have the same length (safety check)
  if (hashBuffer.length !== storedHashBuffer.length) {
    return false;
  }

  // 4. Use timingSafeEqual to prevent Timing Attacks (explained below)
  return crypto.timingSafeEqual(hashBuffer, storedHashBuffer);
}
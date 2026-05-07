import crypto from 'crypto';
import prisma from '../config/database';

/**
 * Generates a random 10-character alphanumeric string and verifies it
 * doesn't already exist in the database to prevent collisions.
 */
export async function generateInviteCode(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 10;
  
  // Loop until we find a unique code
  while (true) {
    let code = '';
    const randomBytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      code += chars[randomBytes[i] % chars.length];
    }

    const existingSession = await prisma.session.findUnique({
      where: { inviteCode: code },
    });

    if (!existingSession) {
      return code;
    }
  }
}

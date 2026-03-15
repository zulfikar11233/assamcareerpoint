// src/lib/auth.ts
// This sets up NextAuth — the admin login system
// NextAuth handles sessions (remembering that you are logged in)

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import getDb from './db';

export const authOptions: NextAuthOptions = {
  // Use JWT tokens (stored in cookies) to remember login
  session: { strategy: 'jwt' },

  // Where to redirect when not logged in
  pages: {
    signIn: '/admin/login',
  },

  providers: [
    // We use email + password login (not Google, not GitHub)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      // This function runs when admin tries to log in
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // No email or password provided
        }

        // Look up user in the database
        const db = getDb();
        const user = db.prepare(
          'SELECT * FROM users WHERE email = ?'
        ).get(credentials.email) as {
          id: number; email: string; password: string
        } | undefined;

        if (!user) return null; // User not found

        // Check if password matches the stored hash
        // bcrypt.compare checks: does "admin123" match the saved hash?
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) return null; // Wrong password

        // ✅ Login successful — return user info
        return { id: String(user.id), email: user.email };
      },
    }),
  ],

  // Secret key for signing tokens (from .env.local)
  secret: process.env.NEXTAUTH_SECRET,
};
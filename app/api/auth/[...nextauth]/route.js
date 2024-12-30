import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../../app/libs/prisma'; // Adjust the import according to your project structure
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google'; // Import Google provider
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Existing CredentialsProvider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('No user found');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      },
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID, // Your Google OAuth Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google OAuth Client Secret
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 2, // Session expires in 2 hours
  },
  pages: {
    signIn: '/login',     // Custom login page
    newUser: '/register', // Custom registration page
    error: '/auth/error', // Error page
  },
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
          });

          if (user) {
            session.user.role = user.role; // Add role to the session
            session.user.id = token.id; // Add id to the session
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/dashboard'; // Default to dashboard for all successful logins
    },
  },
  debug: true, // Enable debug logging
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

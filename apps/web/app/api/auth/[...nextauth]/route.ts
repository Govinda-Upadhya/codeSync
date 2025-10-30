import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/client";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { username, password } = credentials;

        const user = await prismaClient.user.findUnique({
          where: { username },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password!);
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          image: user.profile,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt", // Use JWTs for session management
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    // This callback is executed after a user signs in with any provider
    async signIn({ user, account, profile }) {
      console.log("signin user", user);
      // Logic specific to Google Provider
      if (account?.provider === "google") {
        try {
          // Attempt to find the user in your database by their email
          let existingUser = await prismaClient.user.findUnique({
            where: { email: user.email || undefined },
          });

          if (existingUser) {
            // User exists. Check if their Google ID is already linked.
            if (!existingUser.googleId) {
              // If not linked, update the existing user to link their Google ID and profile picture.
              await prismaClient.user.update({
                where: { id: existingUser.id },
                data: {
                  googleId: account.providerAccountId, // Store Google's unique ID
                  profile: user.image!, // <-- Google provides 'user.image', store it in your 'profile' field
                },
              });
            }
            // Attach your database user ID to the user object (for the jwt callback)
            user.id = existingUser.id;
            // Ensure the profile picture URL from Google is attached to the user object

            return true; // Allow sign-in
          } else {
            // User does not exist, create a new user record in your database
            const newUser = await prismaClient.user.create({
              data: {
                email: user.email!,
                username: user.name!,
                profile: user.image!, // <-- Store Google's 'user.image' into your 'profile' field
                googleId: account.providerAccountId, // Store Google's unique ID
              },
            });
            // Attach the newly created user's database ID and profile to the user object
            user.id = newUser.id;
            user.image = newUser.profile; // <-- Use the newly created profile
            return true; // Allow sign-in
          }
        } catch (error) {
          console.error("Error during Google signIn callback:", error);
          return false; // Prevent sign-in if a database error occurs
        }
      }
      // For other providers (like Credentials), if `authorize` returns a user object,
      // `signIn` will default to `true`.
      return true;
    },

    // This callback is executed whenever a JWT is created (on sign-in) or updated (on session refresh)
    async jwt({ token, user, account, profile }) {
      // `user` is only present on the very first sign-in (when the JWT is initially created).
      // For subsequent requests, only `token` is available.
      if (user) {
        token.id = user.id; // Assign your database user ID to the token
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    // This callback is executed whenever a session is checked (e.g., on client-side with useSession)
    async session({ session, token }) {
      console.log("sessions", session);
      if (session.user) {
        // Expose custom data from the token to the client-side session object
        session.user.id = token.id as string; // Assert type if needed
        session.user.name = token.name;
        session.user.email = token.email;
        // <-- Assign 'profile' to the session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

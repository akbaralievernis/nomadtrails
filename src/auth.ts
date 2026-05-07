import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import pool from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const [rows]: any = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );

          if (rows.length === 0) {
            // Create new user
            await pool.query(
              "INSERT INTO users (name, email, image, google_id) VALUES (?, ?, ?, ?)",
              [user.name, user.email, user.image, user.id]
            );
          } else {
            // Update existing user (optional)
            await pool.query(
              "UPDATE users SET name = ?, image = ?, google_id = ? WHERE email = ?",
              [user.name, user.image, user.id, user.email]
            );
          }
          return true;
        } catch (error) {
          console.error("Error saving user to DB:", error);
          return true; // Still allow sign in even if DB save fails for now? Or false?
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      if (session.user) {
        try {
          const [rows]: any = await pool.query(
            "SELECT id, role FROM users WHERE email = ?",
            [session.user.email]
          );
          if (rows.length > 0) {
            session.user.id = rows[0].id;
            session.user.role = rows[0].role;
          }
        } catch (error) {
          console.error("Error fetching user data from DB:", error);
        }
      }
      return session;
    },
  },
});

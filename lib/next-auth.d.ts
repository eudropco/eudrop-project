import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's membership tier. */
      membershipTier: string;
      /** The user's unique id. */
      id: string;
      /** The user's username. */
      username: string;
    } & DefaultSession["user"] // Var olan name, email, image alanlarını koru
  }

  interface JWT {
    /** The user's membership tier. */
    membershipTier: string;
    id: string;
    username: string;
  }
}
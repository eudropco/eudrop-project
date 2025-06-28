import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // authOptions'ı sadece bir kez import ediyoruz.

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
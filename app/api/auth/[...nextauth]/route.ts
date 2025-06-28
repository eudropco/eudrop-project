import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Ayarları merkezi dosyamızdan çekiyoruz

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
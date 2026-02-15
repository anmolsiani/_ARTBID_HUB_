import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id?: string
  }
  interface Session {
    user: {
      id?: string
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Replace with your actual API call
        if (credentials?.email && credentials?.password) {
          // Example: Call your backend
          // const res = await fetch("http://your-backend/api/login", {
          //   method: "POST",
          //   body: JSON.stringify(credentials)
          // })
          // const user = await res.json()
          
          // Mock user for now
          const user = {
            id: "1",
            email: credentials.email,
            name: "User"
          }
          return user
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})
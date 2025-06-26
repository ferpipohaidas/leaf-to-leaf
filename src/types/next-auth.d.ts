declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      email?: string | null
      name?: string | null
    }
  }

  interface User {
    id: string
    username: string
    email?: string | null
    name?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
  }
} 
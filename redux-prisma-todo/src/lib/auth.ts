import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db"
import bcrypt from "bcryptjs";

const authOptions: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                const username = credentials?.username
                const password = credentials?.password

                if (!username || !password) {
                    throw new Error('credentials not provided')
                }

                const existUser = await db.user.findUnique({ where: { username } })

                if (!existUser) {
                    throw new Error('user not found')
                }

                if (!existUser.password) {
                    throw new Error("Use Google login")
                }

                const isMatch = await bcrypt.compare(password, existUser.password)

                if (isMatch) {
                    return {
                        id: existUser.id,
                        email: existUser.email,
                        username: existUser.username
                    }
                }

                return null
            }
        })
    ],
    callbacks: {
        async signIn({ account, user }) {
            if (account?.provider == 'google') {
                let existUser = await db.user.findUnique({ where: { email: user.email!.toLowerCase() } })

                if (!existUser) {
                    const username = user.email!.split("@")[0]
                    existUser = await db.user.create({
                        data: {
                            email: user.email!.toLowerCase(),
                            username: username.toLowerCase()
                        }
                    })
                }

                user.id = existUser.id
                user.username = existUser.username
            }
            return true
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.username = token.username as string
            }
            return session
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 0.5
    },
    jwt: {
        maxAge: 60 * 60 * 24 * 0.5
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    secret: process.env.NEXT_AUTH_SECRET
}

export default authOptions
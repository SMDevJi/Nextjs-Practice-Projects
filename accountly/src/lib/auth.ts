import User from "@/app/model/user.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "./db";


const authOptions: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const email = credentials?.email
                const password = credentials?.password

                if (!email || !password) {
                    throw new Error('credentials not provided')
                }

                await connectDB()
                const existUser = await User.findOne({ email })
                if (!existUser) {
                    throw new Error('user does not exist')
                }

                if (!existUser.password) {
                    throw new Error("Use Google login")
                }

                const isMatch = await bcrypt.compare(password, existUser.password)

                if (isMatch) {
                    return {
                        id: existUser._id as string,
                        name: existUser.name,
                        email: existUser.email,
                        image: existUser.image,
                    }
                }

                return null
            }

        })

    ],
    callbacks: {
        async signIn({ account, user }) {
            if (account?.provider == 'google') {
                await connectDB()
                let existUser = await User.findOne({ email: user.email })
                if (!existUser) {
                    existUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    })
                }
                user.id = existUser._id as string
            }
            return true
        },
        async jwt({ token, user }) {
            //console.log(user)
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.image = user.image
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                //console.log(token)
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image as string
            }
            return session
        }
    },

    session: {
        strategy: 'jwt',
    },
    jwt: {
        maxAge: 60 * 60 * 24 * 30
    },
    pages: {
        signIn: '/sign-in',
        error: '/sign-in'
    },
    secret: process.env.NEXT_AUTH_SECRET
}

export default authOptions;
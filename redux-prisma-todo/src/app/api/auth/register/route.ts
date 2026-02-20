import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { username, email, password } = await req.json()

        const existUser = await db.user.findUnique({ where: { email:email.toLowerCase() } })
        if (existUser) {
            return NextResponse.json(
                { message: 'user already exists.' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await db.user.create({
            data: {
                username:username.toLowerCase(),
                email:email.toLowerCase(),
                password: hashedPassword
            }
        })

        return NextResponse.json(
            { ...user, password: undefined },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `failed to create user ${error}` },
            { status: 500 }
        )
    }
}
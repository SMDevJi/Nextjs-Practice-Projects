import User from "@/app/model/user.model";
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { name, email, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'please provide all details.' },
                { status: 400 }
            )
        }

        console.log(name, email, password)

        const existUser = await User.findOne({ email })
        if (existUser) {
            return NextResponse.json(
                { message: 'user already exists' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, email, password: hashedPassword
        })

        return NextResponse.json(
            user,
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `failed to create user ${error}` },
            { status: 500 }
        )
    }
}
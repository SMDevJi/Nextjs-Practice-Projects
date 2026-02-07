import User from "@/app/model/user.model";
import authOptions from "@/lib/auth";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session=await getServerSession(authOptions)
    if(!session || !session?.user.email || !session.user.id){
        return NextResponse.json(
            {message:'session does not exist.'},
            {status:400}
        )
    }
    await connectDB()
    const user= await User.findById(session.user.id)
    if(!user){
        return NextResponse.json(
            {message:'user does not exist.'},
            {status:404}
        )
    }
    return NextResponse.json(
            user,
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`error occured ${error}`},
            {status:500}
        )
    }
    
}
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {
        const session = await getServerSession(authOptions)

        if (!session) return NextResponse.json(
            { message: 'unauthorized' },
            { status: 401 }
        )

        const tasks = await db?.task.findMany({
            where: { authorId: session?.user.id as string },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(
            { tasks },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `server error  ${error}` },
            { status: 500 }
        )
    }


}


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) return NextResponse.json(
            { message: 'unauthorized' },
            { status: 401 }
        )

        const { title, description } = await req.json()

        if (!title || !description) return NextResponse.json(
            { message: 'all fields are required' },
            { status: 400 }
        )

        const task = await db?.task.create({
            data: {
                title,
                description,
                authorId: session?.user.id as string
            }
        })

        return NextResponse.json(
            { task },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `server error  ${error}` },
            { status: 500 }
        )
    }


}






export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) return NextResponse.json(
            { message: 'unauthorized' },
            { status: 401 }
        )

        const { id } = await req.json()

        if (!id) return NextResponse.json(
            { message: 'all fields are required' },
            { status: 400 }
        )


        const task = await db?.task.findUnique({
            where: { id }
        })

        if (!task) return NextResponse.json(
            { message: 'task not found' },
            { status: 404 }
        )

        if (!(task?.authorId === session?.user.id as string)) return NextResponse.json(
            { message: 'unauthorized' },
            { status: 401 }
        )

        await db?.task.delete({
            where: { id }
        })

        return NextResponse.json(
            { task, success: true },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `server error  ${error}` },
            { status: 500 }
        )
    }


}




export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) return NextResponse.json(
            { message: 'unauthorized' },
            { status: 401 }
        )

        const { id, title, description, important, complete } = await req.json()

        if (!id) return NextResponse.json(
            { message: 'id required' },
            { status: 400 }
        )


        const task = await db?.task.findUnique({
            where: { id }
        })

        if (!task) return NextResponse.json(
            { message: 'task not found' },
            { status: 404 }
        )

        if (!(task?.authorId === session?.user.id as string)) return NextResponse.json(
            { message: 'unauthorized' },
            { status: 401 }
        )

        const updated=await db?.task.update({
            where: { id },
            data:{
                title,
                description,
                important,
                complete
            }
        })

        return NextResponse.json(
            { task:updated, success: true },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `server error  ${error}` },
            { status: 500 }
        )
    }


}
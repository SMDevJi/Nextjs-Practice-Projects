import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export default async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname
    const publicPaths = [
        '/sign-up',
        '/login',
        '/favicon.ico',
        '/api',
        '/_next'
    ]
    
    if (publicPaths.some(str => pathName.startsWith(str))) {
        return NextResponse.next()
    }
    const token=await getToken({req:request,secret:process.env.NEXT_AUTH_SECRET})
    //console.log(token)
    if(token && (pathName.startsWith('/login') ||  pathName.startsWith('/sign-up'))){
        return NextResponse.redirect('/')
    }
    if(!token){
        const loginUrl=new URL('/login',request.url)
        loginUrl.searchParams.set('callbackUrl',request.url)
        return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
        
    
    //
}

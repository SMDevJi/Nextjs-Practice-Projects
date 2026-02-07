import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export default async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname
    const publicPaths = [
        '/sign-up',
        '/sign-in',
        '/favicon.ico',
        '/api',
        '/_next'
    ]
    //console.log(pathName)
    if (publicPaths.some(str => pathName.startsWith(str))) {
        return NextResponse.next()
    }
    const token=await getToken({req:request,secret:process.env.NEXT_AUTH_SECRET})
    //console.log(token)
    if(!token){
        const loginUrl=new URL('/sign-in',request.url)
        //console.log(loginUrl)
        loginUrl.searchParams.set('callbackUrl',request.url)
        return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
        
    
    //
}


// export const config ={
// matcher:"/((?!api|_next/static|_next/image|favicon.ico|node_modules).*)"
// }
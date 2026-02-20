'use client';
import { clearUser, setUser } from '@/redux/userSlice'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const AuthSync = () => {
    const { data: session, status } = useSession()
    const dispatch = useDispatch()

    useEffect(() => {
        if (status !== 'loading') {
            if (session?.user) {
                dispatch(setUser(session.user))
            } else {
                dispatch(clearUser())
            }
        }
    }, [status, session?.user, dispatch])

    return null
}

export default AuthSync

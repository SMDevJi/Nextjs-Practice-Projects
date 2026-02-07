'use client';
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { createContext, useState, useEffect } from 'react'

type userType={
    id: string,
    name: string,
    email: string,
    image?: string
}

type userContextType={
    user: userType | undefined | null,
    setUser: (user: userType) => void
}

export const UserDataContext = createContext<userContextType | undefined>(undefined)

const UserContext = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<userType | null>(null)
    const data = { user, setUser }
    const session = useSession()

    useEffect(() => {
        async function getUser() {
            try {
                const result = await axios.get('/api/user')
                setUser(result.data)
            } catch (error) {
                console.log(error)
            }
        }

        getUser()
    }, [session])


    return (
        <UserDataContext.Provider value={data}>
            {children}
        </UserDataContext.Provider>
    )
}

export default UserContext
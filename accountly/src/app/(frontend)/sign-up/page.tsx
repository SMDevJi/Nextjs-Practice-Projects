'use client';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { FcGoogle } from "react-icons/fc";

const page = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()

        if (!name || !email || !password) return

        try {
            setSubmitting(true)
            const resp = await axios.post('/api/auth/register', {
                name, email, password
            })
            console.log(resp.data)
            router.push('/')
        } catch (err: any) {
            setError(err.response?.data?.message || err.message)
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <div className='p-1 w-screen h-screen flex justify-center items-center'>
            <div className='border-3 shadow-2xl shadow-green-200 rounded-xl w-md p-8 space-y-5'>
                <h1 className='text-2xl text-center'>Register</h1>
                <form
                    className='space-y-5 '
                    onSubmit={(e) => handleSubmit(e)}
                >



                    <div className="mt-2 ip-con flex flex-col text-lg">
                        <label htmlFor="name">Name:</label>
                        <input
                            className='mt-1 w-full focus:outline-none border-b py-1'
                            type="text"
                            name="Name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter Name'
                        />
                    </div>

                    <div className="mt-2 ip-con flex flex-col text-lg">
                        <label htmlFor="email">Email:</label>
                        <input
                            className='mt-1 w-full focus:outline-none border-b py-1'
                            type="email"
                            name="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder='Enter Email'
                        />
                    </div>

                    <div className="mt-2 ip-con flex flex-col text-lg">
                        <label htmlFor="password">Password:</label>
                        <input
                            className='mt-1 w-full focus:outline-none border-b py-1'
                            type="password"
                            name="Password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter Password'
                        />
                    </div>

                    <p className='text-center font-normal '>Already have an account ? <Link href='/sign-in' className='underline text-blue-400'>login</Link></p>

                    <button
                        className={`text-lg w-full ${submitting ? 'text-white bg-gray-700 hover:bg-gray-700' : 'text-black bg-green-300 hover:bg-green-400'}   rounded-md p-3 cursor-pointer`}
                    >
                        {submitting ? 'Registering...' : 'Register'}
                    </button>

                </form>

                {error &&
                    <p className='text-red-400 font-semibold text-center my-1'>{error}</p>
                }

                <div className="my-2 or flex items-center">
                    <div className="p1 border w-full h-0 mr-2"></div>
                    OR
                    <div className="p2 border w-full h-0 ml-2"></div>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault()
                    signIn('google', {
                        callbackUrl: '/'
                    })
                }}>
                    <button
                        className='text-md flex justify-center items-center w-full bg-green-300 hover:bg-green-400 text-black rounded-md p-3 cursor-pointer'
                    >
                        <FcGoogle size={22} className='mr-2' />  Sign Up With Google
                    </button>
                </form>


            </div>
        </div>

    )
}

export default page
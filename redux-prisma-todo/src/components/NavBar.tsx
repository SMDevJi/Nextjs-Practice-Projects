'use client';
import { useSelector } from 'react-redux'
import { RootState } from "@/redux/store";
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { FaTasks } from "react-icons/fa";
import { MdLabelImportantOutline } from "react-icons/md";
import { RiTaskFill } from "react-icons/ri";
import { RiTaskLine } from "react-icons/ri";
import Link from 'next/link';

const NavBar = () => {
    const [loggingOut, setLoggingOut] = useState(false)
    const user = useSelector((state: RootState) => state.user)
    console.log(user)
    return (
        <div className='border  border-gray-700 bg-gray-800 w-full h-full p-3 rounded-md flex flex-col justify-between'>
            <div className="user ">
                <h1>{user?.username}</h1>
                <h1 className='text-gray-400'>{user?.email}</h1>
                <hr className='mt-1' />
            </div>

            <div className="sections flex flex-col space-y-3 p-3">
                <Link href='/'>
                    <div className='flex items-center '><FaTasks className='mr-2' size={20} />All tasks</div>
                </Link>
                <Link href='/important-tasks'>
                    <div className='flex items-center '><MdLabelImportantOutline className='mr-2' size={20} />Important tasks</div>
                </Link>
                <Link href='/completed-tasks'>
                    <div className='flex items-center '><RiTaskFill className='mr-2' size={20} />Completed tasks</div>
                </Link>
                <Link href='/incomplete-tasks'>
                    <div className='flex items-center '><RiTaskLine className='mr-2' size={20} />Incomplete tasks</div>
                </Link>
            </div>


            <button
                className='bg-gray-600 px-3 py-2 w-full rounded cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out'
                onClick={(e) => {
                    e.preventDefault()
                    try {
                        setLoggingOut(true)
                        signOut()
                    } catch (error) {
                        console.log(`Failed to logout user.. ${error}`)
                    } finally {
                        setLoggingOut(false)
                    }

                }}
            >
                {loggingOut ? 'Logging Out...' : 'Log Out'}
            </button>

        </div>
    )
}

export default NavBar
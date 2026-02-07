'use client';
import { UserDataContext } from '@/context/UserContext';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'
import { CgProfile } from 'react-icons/cg';
import { HiPencil } from "react-icons/hi";


const page = () => {
  const router = useRouter()
  const data = useContext(UserDataContext)
  console.log(data?.user)
  return (
    <>
      {data?.user &&

        <div className="profile-con w-screen h-screen flex justify-center items-center">
          <div className="relative profile w-lg  border-2 rounded-lg flex flex-col items-center p-8">
            <HiPencil
              className='absolute top-3 right-3 cursor-pointer'
              onClick={() => router.push('/edit')}
              size={35}
            />

            {data?.user?.image &&

              <Image
                src={data?.user?.image || ''}
                width={200}
                height={200}
                alt='User Image'
                className='overflow-hidden rounded-full '
              />
            }
            {!data?.user?.image &&

              <CgProfile size={150} className='w-full rounded-full overflow-hidden ' />
            }



            <h1 className='text-3xl my-2'>Welcome, {data?.user?.name}</h1>
            <button
              className='cursor-pointer w-full bg-green-300 hover:bg-green-400 text-black p-3 rounded-md mt-2'
              onClick={() => signOut()}
            >
              Sign Out
            </button>


          </div>
        </div>}
      <div>{!data?.user &&

        <div className="text-3xl loading w-screen h-screen flex justify-center items-center">
          <p>Loading...</p>
        </div>

      }</div>
    </>

  )
}

export default page
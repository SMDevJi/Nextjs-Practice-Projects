'use client';
import { UserDataContext } from '@/context/UserContext';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'sonner';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CgProfile } from "react-icons/cg";


const page = () => {
    const [editName, setEditName] = useState('')
    const [frontendImg, setFrontendImg] = useState('')
    const [backendImg, setBackendImg] = useState<File | undefined>()
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState('')
    const data = useContext(UserDataContext)
    //console.log(data?.user)

    const imgRef = useRef<HTMLInputElement>(null)

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length == 0) return

        setBackendImg(files[0])
        setFrontendImg(URL.createObjectURL(files[0]))
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (updating) return
        if (!editName) return
        try {
            setUpdating(true)
            const formdata = new FormData()
            formdata.append('name', editName)
            if (backendImg) {
                formdata.append('file', backendImg)
            }
            const res = await axios.patch('/api/edit', formdata)
            data?.setUser(res?.data)
            toast.success('Details updated successfully!')
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message)
        } finally {
            setUpdating(false)
        }
    }

    useEffect(() => {
        setEditName(data?.user?.name ?? '')
        setFrontendImg(data?.user?.image ?? '')
    }, [data?.user])


    return (
        <>
            <div className="profile-con w-screen h-screen flex justify-center items-center">
                <div className=" w-lg max-h-md  ">

                    <form
                        className='relative profile w-full h-full  border-2 rounded-lg flex flex-col items-center p-8'
                        onSubmit={handleSubmit}>

                        <div
                            className="pic flex hover:text-green-300 hover:outline-3 rounded-full cursor-pointer"
                            onClick={() => imgRef?.current?.click()}


                        >
                            <input type="file" accept='image/*' hidden
                                onChange={(e) => handleImgChange(e)}
                                ref={imgRef}
                            />
                            {frontendImg ?
                                <Image
                                    src={frontendImg}
                                    width={150}
                                    height={150}
                                    alt='User Image'
                                    className='overflow-hidden rounded-full '
                                />
                                :
                                <CgProfile size={150} className='w-full rounded-full overflow-hidden ' />

                            }


                        </div>




                        <label htmlFor="name" className='text-2xl font-semibold w-full'>Name</label>
                        <input
                            type="text"
                            name="Name"
                            id="name"
                            className='text-xl p-2 my-2 focus:outline-none border-b w-full'
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />

                        {error &&
                            <p className='text-red-400 font-semibold text-center my-1'>{error}</p>
                        }

                        <button
                            className={`cursor-pointer w-full ${updating ? 'text-white bg-gray-700 hover:bg-gray-700' : 'text-black bg-green-300 hover:bg-green-400'}  p-3 rounded-md mt-2`}

                        >
                            {updating ? 'Saving...' : 'Save'}
                        </button>
                    </form>




                </div>
            </div>

        </>

    )
}

export default page
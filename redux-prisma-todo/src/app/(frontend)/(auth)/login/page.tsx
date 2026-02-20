'use client';
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

const page = () => {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const router = useRouter()

  async function doSignin(e: React.SubmitEvent) {
    e.preventDefault()

    try {
      if (!username || !username || !password) return
      setPending(true)

      const res = await signIn('credentials', {
        username: username.toLowerCase(),
        password, redirect: false
      })
      console.log(res)
      if (res && !res.ok) {
        if (res.error == 'CredentialsSignin') {
          setError('Invalid Credentials')
        } else if (res.error == 'Use Google login') {
          setError(res.error)
        } else {
          setError('Login Failed.')
        }
      }
      router.push('/')
    } catch (error: any) {
      console.error(error);
      setError('Failed to register account!');
    } finally {
      setPending(false)
    }
  }
  return (
    <div className='w-screen h-screen flex justify-center items-center bg-neutral-950 p-3 text-white'>
      <form onSubmit={doSignin} className='space-y-6 flex flex-col border border-gray-700 rounded-xl p-6 bg-neutral-800 w-full max-w-md'>
        <h1 className='text-2xl font-semibold text-center'>Login</h1>
        <input
          type="text"
          name="username" id="username"
          placeholder='Enter Username...'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='p-3 bg-gray-700 rounded-md focus:outline-none '
        />
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Enter Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-12 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 transition"
          >
            {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
        <p className='text-sm text-gray-300 '>Want To Create an account ? <Link href='/sign-up' className='underline text-blue-400'>Register</Link></p>

        <button
          type="submit"
          disabled={pending}
          className="bg-cyan-600 p-3 rounded-md font-semibold cursor-pointer transition duration-300 hover:scale-105 disabled:opacity-50"
        >
          {pending ? 'Submitting...' : 'Submit'}
        </button>

        {error &&
          <p className='text-red-400 font-semibold text-center my-1'>{error}</p>
        }


        <div className="my-2 or flex items-center">
          <div className="p1 border w-full h-0 mr-2"></div>
          OR
          <div className="p2 border w-full h-0 ml-2"></div>
        </div>

        <div onClick={(e) => {
          e.preventDefault()
          signIn('google', {
            callbackUrl: '/'
          })
        }}>
          <button
            className='text-md flex justify-center items-center w-full bg-white hover:bg-gray-200 text-black rounded-md p-3 cursor-pointer'
          >
            <FcGoogle size={22} className='mr-2' />  Sign In With Google
          </button>
        </div>
      </form>
    </div>
  )
}

export default page
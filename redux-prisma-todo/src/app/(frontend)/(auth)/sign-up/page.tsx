'use client';

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    const router = useRouter();

    async function signup(e: React.SubmitEvent) {
        e.preventDefault();

        try {
            if (!username || !email || !password) return;

            setPending(true);

            const res = await axios.post("/api/auth/register", {
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password,
            });

            console.log(res.data);
            router.push("/login");
        } catch (error: any) {
            console.error(error);
            setError('Failed to register account!');
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-neutral-950 p-3">
            <form
                onSubmit={signup}
                className="space-y-6 flex flex-col border border-gray-700 rounded-xl p-6 bg-neutral-800 w-full max-w-md"
            >
                <h1 className="text-2xl font-semibold text-white text-center">
                    Signup
                </h1>

                
                <input
                    type="text"
                    placeholder="Enter Username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                
                <input
                    type="email"
                    placeholder="Enter Email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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

                <p className="text-sm text-gray-300">
                    Already have an account?{" "}
                    <Link href="/login" className="underline text-blue-400">
                        Login
                    </Link>
                </p>

               
                <button
                    type="submit"
                    disabled={pending}
                    className="bg-cyan-600 p-3 rounded-md font-semibold cursor-pointer transition duration-300 hover:scale-105 disabled:opacity-50"
                >
                    {pending ? "Submitting..." : "Submit"}
                </button>

                {error && (
                    <p className="text-red-400 font-semibold text-center">
                        {error}
                    </p>
                )}

                
                <div className="flex items-center gap-2">
                    <div className="border-t border-gray-600 flex-1"></div>
                    <span className="text-gray-400 text-sm">OR</span>
                    <div className="border-t border-gray-600 flex-1"></div>
                </div>

                
                <button
                    type="button"
                    onClick={() =>
                        signIn("google", {
                            callbackUrl: "/",
                        })
                    }
                    className="flex justify-center items-center w-full bg-white hover:bg-gray-200 text-black rounded-md p-3 transition"
                >
                    <FcGoogle size={22} className="mr-2" />
                    Sign In With Google
                </button>
            </form>
        </div>
    );
};

export default Page;

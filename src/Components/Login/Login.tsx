import { Button, Input, Typography } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";

import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { authContext } from "../../Context/AuthContext";

type Inputs = {

    email: string

    password: string

}



export default function Login() {
    const { insertUserToken } = useContext(authContext)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()


    const schema = z.object({
        email: z.string().email("inValid email"),
        password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."),
    })



    const { register, handleSubmit, formState: { touchedFields, errors } } = useForm<Inputs>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(schema)
    })


    async function Signin(values: Inputs) {
        setIsLoading(true)
        try {
            const { data } = await axios.post("https://route-posts.routemisr.com/users/signin", values, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            insertUserToken(data.data.token)
            localStorage.setItem("token", data.data.token)
            setIsLoading(false)
            toast.success(data.message)
            navigate("/")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Login failed")
            } else {
                toast.error("Login failed")
            }
            setIsLoading(false)
        }


    }
    return <>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                <div>
                    <Typography type="h2" align="center" className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</Typography>
                    <p className="mt-2 text-center text-sm text-slate-600">Please sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit(Signin)} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Input id="email" {...register("email")} type="email" placeholder="Email address" fullWidth={true} />
                            {touchedFields?.email && errors?.email && <p className="text-sm text-red-500 mt-1">{errors?.email.message}</p>}
                        </div>
                        <div>
                            <Input id="password" {...register("password")} type="password" placeholder="Password" fullWidth={true} />
                            {touchedFields?.password && errors?.password && <p className="text-sm text-red-500 mt-1">{errors?.password.message}</p>}
                        </div>
                    </div>

                    <Button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        {isLoading ? <i className="fa-spinner fa-solid fa-spin text-white"></i> : "Sign in"}
                    </Button>
                </form>
            </div>
        </div>
    </>
}
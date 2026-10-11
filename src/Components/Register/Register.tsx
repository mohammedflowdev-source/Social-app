import { Button, Input, Typography } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";

import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

type Inputs = {
    name: string
    username: string
    email: string
    gender: string
    dateOfBirth: string
    password: string
    rePassword: string
}



export default function Register() {

    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const navigate = useNavigate()


    const schema = z.object({
        name: z.string().min(3, "min length 3").max(15, "max length 15"),
        username: z.string().regex(/^[a-z0-9_]{3,30}$/, "Username must be 3–30 characters (lowercase letters, numbers, and _ only)."),
        email: z.string().email("inValid email"),
        gender: z.enum(["male", "female"], "male or femal"),
        dateOfBirth: z.coerce.date().refine(function (value) {

            const year = new Date().getFullYear()
            const userYear = value.getFullYear()

            if (year - userYear >= 18) {
                return true
            }

            return false
        }, "must be older"),
        password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."),
        rePassword: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "rePassword must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."),
    }).refine(function (values) {

        if (values.password === values.rePassword) {
            return true
        }

        return false

    }, { message: "msh tamam", path: ["rePassword"] })


    const { register, handleSubmit, formState: { touchedFields, errors } } = useForm<Inputs>({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            gender: "",
            dateOfBirth: "",
            password: "",
            rePassword: ""
        },
        resolver: zodResolver(schema)
    })


    async function SignUp(values: Inputs) {
        setIsLoading(true)
        try {
            const { data } = await axios.post("https://route-posts.routemisr.com/users/signup", values, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(data)
            setIsLoading(false)
            toast.success(data.message)
            navigate("/login")
        } catch (error) {
            toast.error(error.response.data.message)
            setIsLoading(false)
        }


    }
    return <>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                <div>
                    <Typography type="h2" align="center" className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an account</Typography>
                    <p className="mt-2 text-center text-sm text-slate-600">Join our community today</p>
                </div>
                <form onSubmit={handleSubmit(SignUp)} className="mt-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                            <Input id="name"  {...register("name")} type="text" placeholder="Full name" fullWidth={true} />
                            {touchedFields?.name && errors?.name && <p className="text-sm text-red-500 mt-1">{errors?.name.message}</p>}
                        </div>
                        <div>
                            <Input id="username" {...register("username")} type="text" placeholder="Username" fullWidth={true} />
                            {touchedFields?.username && errors?.username && <p className="text-sm text-red-500 mt-1">{errors?.username.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Input id="email" {...register("email")} type="email" placeholder="Email address" fullWidth={true} />
                        {touchedFields?.email && errors?.email && <p className="text-sm text-red-500 mt-1">{errors?.email.message}</p>}
                    </div>

                    <div>
                        <Input id="dateOfBirth" {...register("dateOfBirth")} type="date" placeholder="Date of Birth" fullWidth={true} />
                        {touchedFields?.dateOfBirth && errors?.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors?.dateOfBirth.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Input id="password" {...register("password")} type="password" placeholder="Password" fullWidth={true} />
                            {touchedFields?.password && errors?.password && <p className="text-sm text-red-500 mt-1">{errors?.password.message}</p>}
                        </div>
                        <div>
                            <Input id="rePassword" {...register("rePassword")} type="password" placeholder="Confirm password" fullWidth={true} />
                            {touchedFields?.rePassword && errors?.rePassword && <p className="text-sm text-red-500 mt-1">{errors?.rePassword.message}</p>}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="pt-2">
                        <p className="text-sm font-medium text-slate-700 mb-2">Gender</p>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input {...register("gender")} type="radio" value="male" className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                <span className="text-slate-700">Male</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input {...register("gender")} type="radio" value="female" className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                <span className="text-slate-700">Female</span>
                            </label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-8 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        {isLoading ? <i className="fa-spinner fa-solid fa-spin text-white"></i> : "Create Account"}
                    </Button>
                </form>
            </div>
        </div>
    </>
}
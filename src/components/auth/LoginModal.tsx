"use client"

import { Field, Input, Label } from "@headlessui/react"
import Image from "next/image"
import { MdEmail } from "react-icons/md"
import { useState } from "react"
import { authService } from "@/lib/services/auth"
import { useFormValidation } from "@/lib/validations/hooks/useFormValidation"
import { loginValidationSchema } from "@/lib/validations/schemas/loginValidations"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { useRouter } from "next/navigation"
import Link from "next/link"

export const LoginModal = () => {

    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const { handleBlur, handleSubmit, handleChange, values: formData, isSubmitting, resetForm, getFieldError, hasFieldError } =
        useFormValidation(loginValidationSchema, {
            initialValues: {
                email: '',
                password: '',

            }
        })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        await handleSubmit(
            async (validatedData: { email: string; password: string }) => {
                const response = await authService.login({
                    password: validatedData.password,
                    email: validatedData.email
                })

                if (response?.data.message) {
                    router.push('/dashboard')
                }
            },
            (errors: Record<string, string>) => {
                console.error('Validation errors:', errors)
            }
        )
    }

    return (

        <div className=" flex w-full items-center justify-center rounded-2xl ">
            <div

                className={"rounded pb-10 min-w-sm border border-blue-900 shadow shadow-black bg-white px-8 py-2  duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 "}>
                <div className={"w-full flex justify-between items-center gap-4"}>
                    <Image src="/logos/logo.png" alt="logo" height={55} width={55} />
                </div>
                <form onSubmit={handleLogin} className=" flex flex-col items-center mt-6 justify-center gap-y-6">
                    <Field className={"flex-col flex w-full "}>
                        <Label className={"font-medium  text-blue-900"}>Email</Label>
                        <div className="flex px-3 items-center border border-blue-900 bg-white rounded transition focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900">
                            <Input
                                value={formData.email}
                                onBlur={() => handleBlur('email')}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="Enter you email" required type="email"
                                className={"w-full border-none  p-2  "}>

                            </Input>
                            <MdEmail className="text-blue-900" size={20} />
                        </div>
                        <Label className={"text-red-500 text-sm font-medium mt-1"}>{hasFieldError('email') && getFieldError('email')}</Label>

                    </Field>

                    <Field className={"flex-col flex w-full "}>
                        <Label className={"font-medium text-blue-900"}>Password</Label>
                        <div className="flex px-3 items-center border border-blue-900 bg-white rounded transition focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900">

                            <Input
                                name="password"
                                onBlur={(e) => handleBlur('password')}
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)} placeholder="Enter your password" required
                                type={showPassword ? "text" : "password"}
                                className={"border-none p-2 w-full"}></Input>
                            <span className="text-blue-900 cursor-pointer" onClick={() => setShowPassword((value) => !value)}>
                                {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                            </span>
                        </div>
                        <Label className={"text-red-500 text-sm font-medium mt-1"}>{hasFieldError('password') && getFieldError('password')}</Label>

                        <label className="w-full text-end text-sm font-bold text-blue-800  pt-1 cursor-pointer ps-0.5">Forget Password </label>
                        <label className="w-full text-start text-sm text-gray-500  pt-2 cursor-pointer ps-0.5">Don't have an account? 
                            <Link href="/signup" className="text-blue-900 font-medium"> Register</Link>
                        </label>

                    </Field>


                    <Input disabled={isSubmitting === true}
                        className={"w-full  bg-blue-900/95 text-white  py-3 hover:bg-blue-900 px-3 rounded-lg mt-3 font-medium cursor-pointer"}
                        type="submit" name="Login" value={isSubmitting === true ? "Logging in..." : "Login"}></Input>
                </form>
            </div>
        </div>


    )
}
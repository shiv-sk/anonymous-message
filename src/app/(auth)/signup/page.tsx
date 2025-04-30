"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link";
import { toast } from "sonner"
import { useDebounceValue } from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import { signUpSchema } from "@/schemas/signUpSchema";
import axios , {AxiosError} from "axios";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ApiResponse } from "@/types/ApiResponse";

export default function Signin(){

    const [username , setUsername] = useState("");
    const [usernameMessage , setUsernameMessage] = useState("");
    const [isCheckingUsername , setIsCheckingUsername] = useState(false);
    const [isSubmitting , setIsSubmitting] = useState(false);
    const [debouncedUsername] = useDebounceValue(username , 300);
    const router = useRouter();
    
    //data validation(zod)
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
          username: "",
          password:"",
          email:""
        },
    })

    useEffect(()=>{
        const checkUsernameUnique = async()=>{
            if(!debouncedUsername){
                return;
            }
            setIsCheckingUsername(true);
            setUsernameMessage("");
            try {
                const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
                // console.log(response?.data.message);
                setUsernameMessage(response?.data.message)
                setUsernameMessage(response?.data?.message);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError?.response?.data?.message ?? "error of checkuserunique! ");
            }finally{
                setIsCheckingUsername(false);
            }
        }
        checkUsernameUnique();
    } , [debouncedUsername]);

    const onSubmit = async(data: z.infer<typeof signUpSchema>)=>{
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/signup" , data);
            console.log(response.data);
        } catch (error) {
            console.error("error from onsubmit! " , error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data?.message
            toast.error(errorMessage || "form is not submitted! ");
        }finally{
            setIsSubmitting(false);
        }
    }
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-md">
                <div className="">
                    <h1 className="mb-6 tracking-tight text-lg font-bold lg:text-2xl text-center">Join AnonymousMessage!</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input 
                                    type="text" 
                                    placeholder="John Doe"
                                    {...field}
                                    onChange={(e)=>{
                                    field.onChange(e)
                                    setUsername(e.target.value)}} />
                                </FormControl>
                                {
                                    isCheckingUsername ? "Checking.." : ""
                                }
                                <p className={`text-sm ${usernameMessage === "Username is unique" ? 
                                    'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input 
                                    type="email" 
                                    placeholder="JohnDoe@email.com"
                                    {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input 
                                    type="password" 
                                    placeholder="JohnDoe@123"
                                    {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {
                                    isSubmitting ? "Please wait...." : "SignUp"
                                }
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <p>Already a member? {' '} <Link href={""} className="text-blue-600 hover:text-blue-800">SignIn</Link></p>
                    </div> 
                </div>
            </div>
        </div>
    )
}
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db.Connection";
import userModel from "@/models/user";

export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                    const user  = await userModel.findOne({$or:[{email:credentials.identifier} , {username:credentials.identifier}]});
                    if(!user){
                        throw new Error("Incorrect email or username!");
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify email!");
                    }
                    const isPasswordCorrect = bcrypt.compare(credentials.password , user.password);
                    if(!isPasswordCorrect){
                        throw new Error("Incorrect password!");
                    }
                    return user;
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks:{
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isActive = user.isActive;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isActive = token.isActive as boolean;
                session.user.username = token.username as string;
            }
            return session
        },
    },
    pages:{
        signIn: '/sign-in',
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}
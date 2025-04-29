import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'anonymous message | Verification Email',
            react: VerificationEmail({username , otp:verifyCode}),
        });
        return {success:true , message:"Verification Email Sent Successfully!"}
    } catch (error) {
        console.error("Error sending VerificationCode! " , error);
        return {success:false , message:"failed to sent Verification Email"}
    }
}
import userModel from "@/models/user";
import dbConnect from "@/lib/db.Connection";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username , code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await userModel.findOne({username : decodedUsername});
        if(!user){
            return Response.json({
                success:false,
                message:"user not found! "
            },
            { status: 400 }
            )
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true, 
                message: 'Account verified successfully'
            },
            { status: 200 }
            )
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success: true, 
                message: 'Verification code has expired. Please sign up again to get a new code.! '
            },
            { status: 400 }
            )
        }
        else{
            return Response.json({
                success: true, 
                message: 'Incorrect verification code.! '
            },
            { status: 400 }
            )
        }
    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json({
            success: false, 
            message: 'Error verifying user'
        },
        { status: 500 }
        )
    }
}
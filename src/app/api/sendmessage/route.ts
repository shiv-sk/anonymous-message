import dbConnect from "@/lib/db.Connection";
import userModel from "@/models/user";
import { Message } from "@/models/user";

export async function POST(request :Request){
    await dbConnect();
    const {content , username} = await request.json();
    try {
        const user = await userModel.findOne({username});
        if(!user){
            return Response.json({
                status:false,
                message:"User not found! ",
            },
            { status: 404 }
            )
        }
        if(!user.isActive){
            return Response.json({
                status:false,
                message:"User is not accepting messages! ",
            },
            { status: 403 }
            ) 
        }
        const newMessage = {content , createdAt:new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
    
        return Response.json({
            status:true,
            message:"Message sent successfully",
        },
        { status: 201 }
        )
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json({
            status:false,
            message:'Internal server error'
        },
        { status: 500 }
        )
    }
}
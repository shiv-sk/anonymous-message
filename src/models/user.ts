import mongoose, {Schema , Document} from "mongoose";
export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const messageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    },
});

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isActive: boolean;
    messages: Message[];
}

const userSchema :Schema<User> = new Schema({
    username:{
        type:String,
        required: [true, 'Username is required'],
        unique: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username must be at most 30 characters'],
    },
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode:{
        type: String,
        required: [true, 'Verify Code is required'],
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    messages: [messageSchema],
});

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User" , userSchema);
export default userModel;
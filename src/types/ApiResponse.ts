import { Message } from "@/models/user"
export interface ApiResponse{
    success:boolean,
    message:string,
    isActive?:boolean,
    messages?:Array<Message>
}
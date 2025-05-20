import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function getAutorizeUser(){
     const session = await getServerSession(authOptions);
    
     return session
}
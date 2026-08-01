import { prisma } from "./prisma";
import bcrypt from "bcrypt";


export async function hashPassword(password:string){
    return await bcrypt.hash(password,10);
}


export async function verifyPassword(
    password:string,
    hash:string
){
    return await bcrypt.compare(password,hash);
}


export async function getUserByEmail(email:string){

    return await prisma.user.findUnique({
        where:{
            email
        }
    });

}
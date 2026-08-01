import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function POST(req:Request){

    try{

        const body = await req.json();

        const {
            email,
            password
        } = body;


        const user =
        await prisma.user.findUnique({
            where:{
                email
            }
        });


        if(!user){

            return NextResponse.json(
                {
                    message:"Invalid credentials"
                },
                {
                    status:401
                }
            );

        }


        const passwordMatch =
        await verifyPassword(
            password,
            user.passwordHash
        );


        if(!passwordMatch){

            return NextResponse.json(
                {
                    message:"Invalid credentials"
                },
                {
                    status:401
                }
            );

        }


        return NextResponse.json({

            message:"Login successful",

            user:{
                id:user.id,
                name:`${user.firstName} ${user.lastName}`,
                role:user.role
            }

        });


    }
    catch(error){

        return NextResponse.json(
            {
                message:"Something went wrong"
            },
            {
                status:500
            }
        );

    }

}
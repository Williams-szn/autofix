import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function POST(req:Request){

    try{

        const body = await req.json();

        const {
            firstName,
            lastName,
            email,
            password
        } = body;


        const existingUser =
        await prisma.user.findUnique({
            where:{
                email
            }
        });


        if(existingUser){
            return NextResponse.json(
                {
                    message:"User already exists"
                },
                {
                    status:400
                }
            );
        }


        const passwordHash =
        await hashPassword(password);



        const user =
        await prisma.user.create({

            data:{
                firstName,
                lastName,
                email,
                passwordHash
            }

        });



        return NextResponse.json(
            {
                message:"User created",
                user
            },
            {
                status:201
            }
        );


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
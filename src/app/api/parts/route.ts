import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// GET ALL PARTS

export async function GET(){

    try{

        const parts = await prisma.part.findMany();


        return NextResponse.json(parts);

    }
    catch(error){

        return NextResponse.json(
            {
                message:"Failed to fetch parts"
            },
            {
                status:500
            }
        );

    }

}




// CREATE PART

export async function POST(req:Request){

    try{

        const body = await req.json();


        const part = await prisma.part.create({

            data:{

                name:body.name,

                description:body.description,

                quantity:Number(body.quantity),

                price:Number(body.price)

            }

        });



        return NextResponse.json(part,{
            status:201
        });


    }
    catch(error){

        return NextResponse.json(
            {
                message:"Failed to create part"
            },
            {
                status:500
            }
        );

    }

}
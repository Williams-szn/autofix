import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// GET ALL VEHICLES
export async function GET(){

    try{

        const vehicles = await prisma.vehicle.findMany({
            include:{
                owner:true
            }
        });


        return NextResponse.json(vehicles);

    }
    catch(error){

        return NextResponse.json(
            {
                message:"Failed to fetch vehicles"
            },
            {
                status:500
            }
        );

    }

}



// CREATE VEHICLE
export async function POST(req:Request){

    try{

        const body = await req.json();


        const vehicle = await prisma.vehicle.create({

            data:{
                make:body.make,
                model:body.model,
                year:Number(body.year),
                registrationNo:body.registrationNo,
                vin:body.vin,
                mileage:Number(body.mileage),

                // temporary owner
                // we will replace this with logged-in user later
                ownerId:body.ownerId
            }

        });


        return NextResponse.json(vehicle,{
            status:201
        });


    }
    catch(error){

        return NextResponse.json(
            {
                message:"Failed to create vehicle"
            },
            {
                status:500
            }
        );

    }

}
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// GET ALL REPAIR JOBS
export async function GET(){

    try{

        const jobs = await prisma.repairJob.findMany({

            include:{

                vehicle:{
                    include:{
                        owner:true
                    }
                },

                assignments:{
                    include:{
                        mechanic:true
                    }
                }

            }

        });


        return NextResponse.json(jobs);

    }
    catch(error){

        return NextResponse.json(
            {
                message:"Failed to fetch repair jobs"
            },
            {
                status:500
            }
        );

    }

}
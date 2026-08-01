import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// GET ALL DIAGNOSIS LOGS

export async function GET(){


try{


const diagnosis = await prisma.diagnosis.findMany({

include:{

repairJob:true

}

});


return NextResponse.json(diagnosis);


}

catch(error){


return NextResponse.json(

{
message:"Failed to fetch diagnosis"
},

{
status:500
}

);


}

}




// CREATE DIAGNOSIS

export async function POST(req:Request){


try{


const body = await req.json();



const diagnosis = await prisma.diagnosis.create({

data:{


issueFound:body.issueFound,


notes:body.notes,


recommendation:body.recommendation,


repairJobId:body.repairJobId


}

});



return NextResponse.json(diagnosis);



}

catch(error){


return NextResponse.json(

{
message:"Failed to create diagnosis"
},

{
status:500
}

);


}


}
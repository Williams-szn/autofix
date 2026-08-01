import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(){


try{


const customer = await prisma.user.findUnique({

where:{

email:"customer@autofix.com"

}

});



const jobs = await prisma.repairJob.findMany({

where:{

vehicle:{

ownerId:customer?.id

}

},


include:{


vehicle:true,


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

message:"Unable to fetch customer repairs"

},

{

status:500

}

);


}


}
"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";


export default function CustomerDashboard(){


const [jobs,setJobs] = useState<any[]>([]);



useEffect(()=>{


fetch("/api/customer/jobs")

.then(res=>res.json())

.then(data=>setJobs(data));


},[]);



return (

<div className="p-8">


<h1 className="text-3xl font-bold mb-8">
My Vehicle Repairs
</h1>



<div className="grid gap-6">


{
jobs.map((job)=>(


<Card key={job.id}>


<CardHeader>

<CardTitle>

{job.title}

</CardTitle>

</CardHeader>



<CardContent>


<div className="space-y-3">


<p>

Vehicle:

{" "}

{job.vehicle.make}

{" "}

{job.vehicle.model}

</p>



<p>

Registration:

{" "}

{job.vehicle.registrationNo}

</p>



<p>

Status:

{" "}

<span className="font-bold">

{job.status}

</span>

</p>



<p>

Assigned Mechanic:

{" "}

{

job.assignments[0]?.mechanic.firstName

||

"Not Assigned"

}

</p>


</div>


</CardContent>


</Card>


))

}


</div>


</div>

)

}
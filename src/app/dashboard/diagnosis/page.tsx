"use client";


import {useEffect,useState} from "react";


export default function DiagnosisPage(){


const [logs,setLogs]=useState<any[]>([]);



useEffect(()=>{


fetch("/api/diagnosis")

.then(res=>res.json())

.then(data=>setLogs(data));


},[]);



return (

<div>


<h1 className="text-3xl font-bold mb-8">
Diagnostic Logs
</h1>



<div className="space-y-5">


{

logs.map((log)=>(


<div
key={log.id}
className="border rounded-lg p-5"
>


<h2 className="font-bold text-xl">

{log.issueFound}

</h2>



<p className="mt-2">

{log.notes}

</p>



<p className="mt-2">

Recommendation:

{" "}

{log.recommendation}

</p>



</div>


))


}


</div>


</div>

)

}
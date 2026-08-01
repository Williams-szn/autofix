"use client";

import { useEffect,useState } from "react";


export default function VehiclesPage(){

const [vehicles,setVehicles] = useState([]);


useEffect(()=>{

fetch("/api/vehicles")
.then(res=>res.json())
.then(data=>setVehicles(data));

},[]);



return (

<div>


<h1 className="text-3xl font-bold mb-6">
Vehicles
</h1>


<div className="border rounded-lg">


<table className="w-full">


<thead>

<tr className="border-b">

<th className="p-3 text-left">
Make
</th>

<th className="p-3 text-left">
Model
</th>

<th className="p-3 text-left">
Year
</th>

<th className="p-3 text-left">
Registration
</th>

</tr>

</thead>



<tbody>

{
vehicles.map((vehicle:any)=>(

<tr 
key={vehicle.id}
className="border-b"
>

<td className="p-3">
{vehicle.make}
</td>

<td className="p-3">
{vehicle.model}
</td>

<td className="p-3">
{vehicle.year}
</td>

<td className="p-3">
{vehicle.registrationNo}
</td>


</tr>

))
}


</tbody>


</table>


</div>


</div>

)

}
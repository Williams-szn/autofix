"use client";


import { useEffect,useState } from "react";


export default function InventoryPage(){


const [parts,setParts]=useState<any[]>([]);



useEffect(()=>{


fetch("/api/parts")

.then(res=>res.json())

.then(data=>setParts(data));


},[]);



return (

<div>


<h1 className="text-3xl font-bold mb-8">
Inventory
</h1>



<div className="border rounded-lg">


<table className="w-full">


<thead>

<tr className="border-b">

<th className="p-3 text-left">
Part Name
</th>


<th className="p-3 text-left">
Quantity
</th>


<th className="p-3 text-left">
Price
</th>


</tr>

</thead>



<tbody>


{
parts.map((part)=>(


<tr 
key={part.id}
className="border-b"
>


<td className="p-3">
{part.name}
</td>


<td className="p-3">
{part.quantity}
</td>


<td className="p-3">
₦{part.price}
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
"use client";


import Link from "next/link";

import {
  Car,
  ClipboardList,
  User,
  LogOut
} from "lucide-react";


export default function CustomerSidebar(){


return (

<aside className="w-64 min-h-screen border-r bg-background p-5">


<h1 className="text-2xl font-bold mb-10">
AutoFix
</h1>



<nav className="space-y-3">


<Link
href="/customer"
className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
>

<Car size={20}/>

My Vehicle

</Link>



<Link
href="/customer/repairs"
className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
>

<ClipboardList size={20}/>

Repair Status

</Link>



<Link
href="/customer/profile"
className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
>

<User size={20}/>

Profile

</Link>


</nav>



<div className="absolute bottom-6">


<button
className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
>

<LogOut size={20}/>

Logout

</button>


</div>


</aside>

)

}
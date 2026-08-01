"use client";

import { useState } from "react";


export default function LoginPage(){

const [form,setForm] = useState({
    email:"",
    password:""
});


async function handleSubmit(e:React.FormEvent){

e.preventDefault();


const res = await fetch("/api/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(form)

});


const data = await res.json();


console.log(data);


alert(
`Welcome ${data.user?.name || ""}`
);


}



return(

<div className="min-h-screen flex items-center justify-center">


<form 
onSubmit={handleSubmit}
className="space-y-4 w-96"
>


<h1 className="text-3xl font-bold">
Login
</h1>


<input

className="border p-2 w-full"

placeholder="Email"

type="email"

onChange={(e)=>
setForm({
...form,
email:e.target.value
})
}

/>


<input

className="border p-2 w-full"

placeholder="Password"

type="password"

onChange={(e)=>
setForm({
...form,
password:e.target.value
})
}

/>



<button

className="bg-black text-white p-2 w-full"

>

Login

</button>



</form>


</div>

)

}
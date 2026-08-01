"use client";

import { useState } from "react";


export default function RegisterPage(){

    const [form,setForm] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:""
    });


    async function handleSubmit(e:React.FormEvent){

        e.preventDefault();


        const response = await fetch("/api/register",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(form)
        });


        const data = await response.json();

        console.log(data);

        alert(data.message);

    }



    return (
        <div className="min-h-screen flex items-center justify-center">

            <form 
            onSubmit={handleSubmit}
            className="space-y-4 w-96"
            >

                <h1 className="text-3xl font-bold">
                    Create Account
                </h1>


                <input
                className="border p-2 w-full"
                placeholder="First Name"
                onChange={(e)=>
                    setForm({...form,firstName:e.target.value})
                }
                />


                <input
                className="border p-2 w-full"
                placeholder="Last Name"
                onChange={(e)=>
                    setForm({...form,lastName:e.target.value})
                }
                />


                <input
                className="border p-2 w-full"
                placeholder="Email"
                type="email"
                onChange={(e)=>
                    setForm({...form,email:e.target.value})
                }
                />


                <input
                className="border p-2 w-full"
                placeholder="Password"
                type="password"
                onChange={(e)=>
                    setForm({...form,password:e.target.value})
                }
                />


                <button
                className="bg-black text-white p-2 w-full"
                >
                    Register
                </button>


            </form>

        </div>
    );
}
import CustomerSidebar from "@/components/customer-sidebar";


export default function CustomerLayout({

children,

}:{

children:React.ReactNode;

}){


return (

<div className="flex">


<CustomerSidebar/>


<main className="flex-1 p-8">

{children}

</main>


</div>

)

}
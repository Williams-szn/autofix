import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const stats = [
  {
    title: "Vehicles",
    value: "0",
  },
  {
    title: "Active Repairs",
    value: "0",
  },
  {
    title: "Customers",
    value: "0",
  },
  {
    title: "Inventory Items",
    value: "0",
  },
];


export default function DashboardPage() {

  return (

    <div>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-muted-foreground">
          Monitor your auto repair operations
        </p>

      </div>



      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">


        {
          stats.map((item)=>(
            
            <Card key={item.title}>

              <CardHeader>

                <CardTitle>
                  {item.title}
                </CardTitle>

              </CardHeader>


              <CardContent>

                <p className="text-3xl font-bold">
                  {item.value}
                </p>

              </CardContent>


            </Card>

          ))
        }


      </div>


    </div>

  );

}
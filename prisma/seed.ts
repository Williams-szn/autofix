import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});


const prisma = new PrismaClient({
  adapter,
});



async function main() {


  // =====================
  // CLEAR OLD DATA
  // =====================

  await prisma.jobAssignment.deleteMany();
  await prisma.diagnosis.deleteMany();
  await prisma.repairJob.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.part.deleteMany();
  await prisma.user.deleteMany();



  // =====================
  // PASSWORD
  // =====================

  const passwordHash = await bcrypt.hash(
    "12345678",
    10
  );



  // =====================
  // USERS
  // =====================


  await prisma.user.create({

    data:{

      firstName:"AutoFix",

      lastName:"Admin",

      email:"admin@autofix.com",

      passwordHash,

      role:"ADMIN"

    }

  });



  const mechanic = await prisma.user.create({

    data:{

      firstName:"John",

      lastName:"Mechanic",

      email:"mechanic@autofix.com",

      passwordHash,

      role:"MECHANIC"

    }

  });



  const customer = await prisma.user.create({

    data:{

      firstName:"Donald",

      lastName:"Customer",

      email:"customer@autofix.com",

      passwordHash,

      role:"CUSTOMER"

    }

  });



  // =====================
  // VEHICLE
  // =====================


  const vehicle = await prisma.vehicle.create({

    data:{

      make:"Toyota",

      model:"Camry",

      year:2020,

      registrationNo:"ABC-123",

      mileage:50000,

      ownerId:customer.id

    }

  });



  // =====================
  // REPAIR JOB
  // =====================


  const repairJob = await prisma.repairJob.create({

    data:{

      title:"Brake System Repair",

      description:
      "Customer reports brake vibration",

      status:"IN_PROGRESS",

      vehicleId:vehicle.id

    }

  });



  // =====================
  // ASSIGN MECHANIC
  // =====================


  await prisma.jobAssignment.create({

    data:{

      repairJobId:repairJob.id,

      mechanicId:mechanic.id

    }

  });



  // =====================
  // DIAGNOSIS LOG
  // =====================


  await prisma.diagnosis.create({

    data:{

      findings:
      "Brake vibration detected. Front brake pads are worn out.",

      notes:
      "Customer reports vibration during braking. Replace brake pads and inspect brake discs.",

      repairJobId:repairJob.id

    }

  });



  // =====================
  // INVENTORY PARTS
  // =====================


  await prisma.part.createMany({

    data:[

      {
        name:"Brake Pads",

        quantity:20,

        price:15000

      },


      {
        name:"Engine Oil",

        quantity:50,

        price:8000

      },


      {
        name:"Oil Filter",

        quantity:30,

        price:5000

      }

    ]

  });



  console.log("Database seeded successfully 🚗");

}



main()

.catch((error)=>{

  console.error(error);

  process.exit(1);

})

.finally(async()=>{

  await prisma.$disconnect();

});
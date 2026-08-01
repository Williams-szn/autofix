import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  Wrench,
  Package,
  Users,
  FileText,
  Settings,
} from "lucide-react";


const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Vehicles",
    href: "/dashboard/vehicles",
    icon: Car,
  },
  {
    name: "Repair Jobs",
    href: "/dashboard/jobs",
    icon: Wrench,
  },
  {
    name: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];


export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r bg-background p-6">

      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          AutoFix
        </h1>

        <p className="text-sm text-muted-foreground">
          Vehicle Management System
        </p>
      </div>


      {/* Navigation */}
      <nav className="space-y-2">

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className="
                flex items-center gap-3
                rounded-lg
                px-3 py-2
                text-sm
                hover:bg-muted
                transition
              "
            >
              <Icon size={20} />

              <span>
                {link.name}
              </span>

            </Link>
          );
        })}

      </nav>


    </aside>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Wrench,
  Car,
  ClipboardList,
  Users,
  Package,
  FileText,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Activity,
  ChevronRight,
  Shield,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface UserSession {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "MECHANIC" | "CUSTOMER";
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to load user session", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const role = user?.role || "CUSTOMER";

  const navItems = [
    ...(role === "ADMIN"
      ? [
          { name: "Overview", href: "/dashboard/admin", tab: undefined, icon: Activity },
          { name: "User Management", href: "/dashboard/admin?tab=users", tab: "users", icon: Users },
          { name: "All Repair Jobs", href: "/dashboard/admin?tab=repairs", tab: "repairs", icon: ClipboardList },
          { name: "Parts Inventory", href: "/dashboard/admin?tab=inventory", tab: "inventory", icon: Package },
        ]
      : []),
    ...(role === "MECHANIC"
      ? [
          { name: "Assigned Jobs", href: "/dashboard/mechanic", tab: undefined, icon: Wrench },
          { name: "Parts Inventory", href: "/dashboard/mechanic?tab=parts", tab: "parts", icon: Package },
        ]
      : []),
    ...(role === "CUSTOMER"
      ? [
          { name: "My Repair Jobs", href: "/dashboard/customer", tab: undefined, icon: Car },
          { name: "Registered Vehicles", href: "/dashboard/customer?tab=vehicles", tab: "vehicles", icon: Car },
          { name: "Invoices & Payments", href: "/dashboard/customer?tab=invoices", tab: "invoices", icon: FileText },
        ]
      : []),
  ];

  const getRoleBadge = (userRole: string) => {
    switch (userRole) {
      case "ADMIN":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "MECHANIC":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const isLinkActive = (item: (typeof navItems)[0]) => {
    if (item.tab) {
      return pathname.startsWith(item.href.split("?")[0]) && currentTab === item.tab;
    }
    return pathname.startsWith(item.href) && (!currentTab || currentTab === "overview");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 p-4 lg:p-6 sticky top-0 h-screen justify-between z-30 shrink-0">
        <div>
          {/* Logo Header */}
          <Link href="/" className="flex items-center gap-3 px-3 py-2 mb-8 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                AutoFix
              </span>
              <span className="block text-[10px] uppercase tracking-widest font-mono text-cyan-400 font-semibold">
                SaaS Engine
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {role} Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs lg:text-sm transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/10 text-cyan-300 border border-cyan-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-cyan-400" : "text-slate-400"}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
              <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs shrink-0">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : "AF"}
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs font-semibold truncate text-slate-200">
                  {user ? `${user.firstName} ${user.lastName}` : "User Profile"}
                </p>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${getRoleBadge(role)}`}>
                  {role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Navbar Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-base text-white tracking-tight">AutoFix</span>
            <span className="block text-[9px] font-mono text-cyan-400 uppercase font-bold">{role}</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800/80 rounded-xl border border-slate-700/80"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bg-slate-900/98 backdrop-blur-2xl border-b border-slate-800 p-4 space-y-2 z-40 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Menu Navigation ({role})
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-xs transition-all ${
                  active
                    ? "bg-blue-600/20 text-cyan-300 border border-cyan-500/30 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-slate-300 font-medium">
              Signed in as <span className="font-bold text-white">{user?.firstName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between h-16 px-6 lg:px-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-slate-200 transition-colors">
              AutoFix
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 uppercase font-semibold">{role} Workspace</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search VIN, Customer, Repair..."
                className="w-48 lg:w-64 pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-100 placeholder:text-slate-500 transition-all"
              />
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <button className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

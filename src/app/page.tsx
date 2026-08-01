"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Shield,
  Zap,
  Activity,
  User,
  Car,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Search,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleDemoLogin(email: string, role: string) {
    setLoggingIn(role);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "12345678" }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(data.redirectUrl);
        router.refresh();
      } else {
        alert(data.error || "Demo login failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingIn(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden antialiased">
      {/* Background Lighting Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Header Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                AutoFix
              </span>
              <span className="block text-[9px] uppercase tracking-widest font-mono text-cyan-400 font-bold">
                Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">
              Core Capabilities
            </a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">
              Platform Workflow
            </a>
            <a href="#demo" className="hover:text-cyan-400 transition-colors">
              Demo Presets
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-600/25 transition-all"
            >
              Register Account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-6 space-y-4 animate-in slide-in-from-top-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 hover:text-cyan-400"
            >
              Core Capabilities
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 hover:text-cyan-400"
            >
              Platform Workflow
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 hover:text-cyan-400"
            >
              Demo Presets
            </a>

            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white"
              >
                Register Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-mono mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Gen Automotive Repair Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Precision Automotive Operations &{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
            Real-Time Vehicle Tracking
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          AutoFix unifies mechanics, shop administrators, and vehicle owners into a seamless real-time platform. Track diagnoses, manage inventory, and handle invoicing instantly.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group transition-all"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition-all"
          >
            Instant Demo Access
          </a>
        </div>

        {/* Hero Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
          <div className="p-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">99.9%</p>
            <p className="text-xs text-slate-400 mt-1 font-mono uppercase">Diagnostics Accuracy</p>
          </div>
          <div className="p-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">&lt; 1 sec</p>
            <p className="text-xs text-slate-400 mt-1 font-mono uppercase">Part Sync Latency</p>
          </div>
          <div className="p-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
            <p className="text-xs text-slate-400 mt-1 font-mono uppercase">Transparent Invoicing</p>
          </div>
          <div className="p-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">JWT / RBAC</p>
            <p className="text-xs text-slate-400 mt-1 font-mono uppercase">Role Security</p>
          </div>
        </div>
      </section>

      {/* Demo Account Presets */}
      <section id="demo" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">One-Click Role Demo Presets</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Experience AutoFix instantly by logging into any of the 3 system roles:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Admin Preset */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/60 transition-all shadow-xl">
            <div>
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">System Administrator</h3>
              <p className="text-xs text-slate-400 mb-4">
                Full operational control: manage users, dispatch repair jobs, issue invoices, and track inventory stock.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1 mb-6">
                <p className="text-slate-400">Email: admin@autofix.com</p>
                <p className="text-slate-400">Password: 12345678</p>
              </div>
            </div>

            <button
              onClick={() => handleDemoLogin("admin@autofix.com", "ADMIN")}
              disabled={loggingIn === "ADMIN"}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/25 transition-all flex items-center justify-center gap-2"
            >
              {loggingIn === "ADMIN" ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Mechanic Preset */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-amber-500/60 transition-all shadow-xl">
            <div>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Technician / Mechanic</h3>
              <p className="text-xs text-slate-400 mb-4">
                Workbench view: inspect assigned jobs, update repair stages, write diagnostic logs, and consume shop inventory parts.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1 mb-6">
                <p className="text-slate-400">Email: mechanic@autofix.com</p>
                <p className="text-slate-400">Password: 12345678</p>
              </div>
            </div>

            <button
              onClick={() => handleDemoLogin("mechanic@autofix.com", "MECHANIC")}
              disabled={loggingIn === "MECHANIC"}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-2"
            >
              {loggingIn === "MECHANIC" ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Mechanic Workbench</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Customer Preset */}
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-blue-500/60 transition-all shadow-xl">
            <div>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Vehicle Owner (Customer)</h3>
              <p className="text-xs text-slate-400 mb-4">
                Customer portal: register garage vehicles, monitor repair progress live, inspect mechanic findings, and pay invoices.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1 mb-6">
                <p className="text-slate-400">Email: customer@autofix.com</p>
                <p className="text-slate-400">Password: 12345678</p>
              </div>
            </div>

            <button
              onClick={() => handleDemoLogin("customer@autofix.com", "CUSTOMER")}
              disabled={loggingIn === "CUSTOMER"}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
            >
              {loggingIn === "CUSTOMER" ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Customer Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25">
            Engineered Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">Precision Tools for Modern Auto Repair</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
            A comprehensive, high-throughput suite designed to automate everyday shop operations and maintain real-time transparency.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-blue-500/30 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Live Repair Stage Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transition repairs seamlessly through stages: Pending, Diagnosing, In Progress, Completed, and Ready for Pickup. Automated state sync keeps customers in the loop.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/30 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Inventory Stock Auto-Deduction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log replacement parts directly onto repair assignments. The engine immediately decrements shop stock and calculates transparent material line items.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Role-Based Access Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Secured with cryptographically signed JSON Web Token (JWT) cookies, preventing route leakage and protecting sensitive admin, customer, and mechanic directories.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Workflow Section */}
      <section id="workflow" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25">
            Operational Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">The AutoFix Repair Loop</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
            From arrival to pickup, follow how the platform keeps all players in sync.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-600/30 via-cyan-500/30 to-emerald-600/30 z-0" />

          {/* Step 1 */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 font-mono font-bold shadow-lg shadow-slate-950 mb-4 group hover:border-blue-500 transition-colors">
              01
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Vehicle Intake</h3>
            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
              Owner registers vehicle specs, license, and describes active symptoms.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 font-mono font-bold shadow-lg shadow-slate-950 mb-4 group hover:border-cyan-500 transition-colors">
              02
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Diagnosis Log</h3>
            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
              Assigned technician uploads OBD scan details and key recommendations.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 font-mono font-bold shadow-lg shadow-slate-950 mb-4 group hover:border-purple-500 transition-colors">
              03
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Wrenching & Parts</h3>
            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
              Status changes to In Progress as mechanics deduct inventory parts.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 font-mono font-bold shadow-lg shadow-slate-950 mb-4 group hover:border-emerald-500 transition-colors">
              04
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Billing & Pickup</h3>
            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
              System compiles itemized invoices automatically for customer approval.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose AutoFix (Role Benefits) */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
              Built For Everyone
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-4 leading-tight">One Platform. Three Tailored Portals.</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed">
              We design specialized workflows matching the exact tasks of admins, shop mechanics, and customers. No clutter. Just efficiency.
            </p>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800">
              <h3 className="text-sm font-bold text-cyan-400 mb-2 font-mono uppercase">For Administrators</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Oversee total shops metrics, register/deactivate personnel accounts, assign repair tickets, monitor global parts stock, and track shop revenue figures in real time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 mb-2 font-mono uppercase">For Technicians</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Interact with a visual task board, record technical findings, select parts directly from live shop inventory, and update completion status instantly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800">
              <h3 className="text-sm font-bold text-blue-400 mb-2 font-mono uppercase">For Vehicle Owners</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Check up-to-date repair stages, inspect logged technician diagnostic comments, view detailed pricing breakdowns, and keep records of all garage work.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800">
              <h3 className="text-sm font-bold text-purple-400 mb-2 font-mono uppercase">For Developers</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Built on top of a highly modular stack using Next.js 16, TypeScript, Neon Serverless PostgreSQL database, and Prisma ORM client generators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 mt-2">Get answers to the core architecture features</p>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <h4 className="text-sm font-bold text-white mb-2">How secure is the authentication and route guarding?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              AutoFix uses cryptographically signed JWT cookies with strict middleware filters. The Next.js middleware interceptor parses tokens and enforces role access boundaries before pages render, preventing customer or mechanic access to the admin panels.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <h4 className="text-sm font-bold text-white mb-2">Is the inventory system sync automated?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes. Whenever a mechanic logs a part usage onto an active repair job, the backend runs a transaction that verifies current stock quantities, updates inventory, and creates/adjusts the associated invoice line item.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <h4 className="text-sm font-bold text-white mb-2">Can I customize roles and vehicle types?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Absolutely. Our database schema is built using Prisma ORM, meaning new roles, custom specs, and vehicle attributes can be easily migrated by extending the `prisma.schema` definition.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-10 text-center text-xs text-slate-500 font-mono relative z-10 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-300 font-bold">AutoFix Operations Platform © 2026</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Automating diagnostic scans, inventory adjustments, and billing lifecycles.
          </p>
        </div>
      </footer>
    </div>
  );
}

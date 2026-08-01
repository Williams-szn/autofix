"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Users,
  Wrench,
  Package,
  ClipboardList,
  DollarSign,
  Search,
  Plus,
  Trash2,
  UserPlus,
  FileText,
  X,
  CheckCircle2,
  Activity,
  AlertCircle,
} from "lucide-react";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "overview" | "users" | "repairs" | "inventory") || "overview";

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "repairs" | "inventory">(initialTab);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState("");

  // Create User Modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [savingUser, setSavingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // Create Job Modal state
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    vehicleId: "",
    mechanicId: "",
  });
  const [savingJob, setSavingJob] = useState(false);

  // Create Part Modal state
  const [showPartModal, setShowPartModal] = useState(false);
  const [partForm, setPartForm] = useState({ name: "", quantity: "", price: "" });
  const [savingPart, setSavingPart] = useState(false);

  // Issue Invoice Modal state
  const [selectedJobForInvoice, setSelectedJobForInvoice] = useState<any | null>(null);
  const [laborCost, setLaborCost] = useState("10000");
  const [issuingInvoice, setIssuingInvoice] = useState(false);

  async function loadAdminData() {
    setLoading(true);
    try {
      const [uRes, jRes, pRes, vRes, iRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/jobs"),
        fetch("/api/parts"),
        fetch("/api/vehicles"),
        fetch("/api/invoices"),
      ]);

      if (uRes.ok) setUsers(await uRes.json());
      if (jRes.ok) setJobs(await jRes.json());
      if (pRes.ok) setParts(await pRes.json());
      if (vRes.ok) setVehicles(await vRes.json());
      if (iRes.ok) setInvoices(await iRes.json());
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["overview", "users", "repairs", "inventory"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Handle User Create
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUser(true);
    setUserError(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      setShowUserModal(false);
      setUserForm({ firstName: "", lastName: "", email: "", password: "", role: "CUSTOMER" });
      loadAdminData();
    } catch (err: any) {
      setUserError(err.message);
    } finally {
      setSavingUser(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user and all associated records?")) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Create Job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingJob(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm),
      });

      if (res.ok) {
        setShowJobModal(false);
        setJobForm({ title: "", description: "", vehicleId: "", mechanicId: "" });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingJob(false);
    }
  };

  // Handle Assign Mechanic
  const handleAssignMechanic = async (jobId: string, mechanicId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mechanicId }),
      });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Create Part
  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPart(true);
    try {
      const res = await fetch("/api/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partForm),
      });
      if (res.ok) {
        setShowPartModal(false);
        setPartForm({ name: "", quantity: "", price: "" });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPart(false);
    }
  };

  // Handle Delete Part
  const handleDeletePart = async (partId: string) => {
    if (!confirm("Are you sure you want to remove this part from inventory?")) return;
    try {
      const res = await fetch(`/api/parts/${partId}`, { method: "DELETE" });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Issue Invoice
  const handleIssueInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForInvoice) return;
    setIssuingInvoice(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repairJobId: selectedJobForInvoice.id,
          laborCost,
        }),
      });

      if (res.ok) {
        setSelectedJobForInvoice(null);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIssuingInvoice(false);
    }
  };

  // Calculations for Admin Stats
  const totalCustomers = users.filter((u) => u.role === "CUSTOMER").length;
  const totalMechanics = users.filter((u) => u.role === "MECHANIC").length;
  const activeRepairs = jobs.filter((j) => j.status !== "COMPLETED" && j.status !== "READY_FOR_PICKUP").length;
  const completedRepairs = jobs.filter((j) => j.status === "COMPLETED" || j.status === "READY_FOR_PICKUP").length;
  const totalPartsStock = parts.reduce((sum, p) => sum + p.quantity, 0);
  const totalRevenue = invoices.filter((i) => i.paid).reduce((sum, i) => sum + i.amount, 0);

  const mechanics = users.filter((u) => u.role === "MECHANIC");

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Admin Header Banner */}
        <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-900 border border-cyan-500/20 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-2 sm:mb-3">
                <Activity className="w-3.5 h-3.5" /> Operations Command Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Administration</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Monitor shop metrics, manage customer accounts, dispatch repair jobs, and balance inventory stock.
              </p>
            </div>

            {/* Global Search Bar */}
            <div className="relative w-full md:w-72 lg:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers, VINs, jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Customers</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{totalCustomers}</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Mechanics</span>
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{totalMechanics}</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Active Jobs</span>
              <ClipboardList className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-cyan-400">{activeRepairs}</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">{completedRepairs}</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Parts Stock</span>
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{totalPartsStock}</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Responsive Horizontal Scroll Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-4 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === "overview"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === "users"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("repairs")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === "repairs"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Repair Directory ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === "inventory"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Parts Stock ({parts.length})</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <span className="inline-block w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Syncing administrative data...</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Recent Repair Jobs */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-bold text-white">Recent Repair Jobs</h3>
                    <button
                      onClick={() => setActiveTab("repairs")}
                      className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-white block truncate">{job.title}</span>
                          <span className="text-slate-400 text-[11px] block truncate">
                            {job.vehicle?.make} {job.vehicle?.model} • {job.vehicle?.owner?.firstName}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low Stock Parts Warning */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-bold text-white">Inventory Stock Status</h3>
                    <button
                      onClick={() => setShowPartModal(true)}
                      className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      + Add New Part
                    </button>
                  </div>
                  <div className="space-y-3">
                    {parts.map((p) => (
                      <div key={p.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-slate-400">${p.price.toLocaleString()} per unit</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                          p.quantity <= 5 ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" : "bg-slate-800 text-slate-300"
                        }`}>
                          {p.quantity} Units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-bold text-white">System User Accounts</h2>
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create User Account</span>
                  </button>
                </div>

                {/* Responsive Table Wrapper */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300 min-w-[600px]">
                      <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="px-5 py-3.5">User Name</th>
                          <th className="px-5 py-3.5">Email</th>
                          <th className="px-5 py-3.5">Role</th>
                          <th className="px-5 py-3.5">Registered</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {users
                          .filter((u) =>
                            searchQuery
                              ? `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase())
                              : true
                          )
                          .map((u) => (
                            <tr key={u.id} className="hover:bg-slate-800/40">
                              <td className="px-5 py-4 font-semibold text-white">
                                {u.firstName} {u.lastName}
                              </td>
                              <td className="px-5 py-4 text-slate-400 font-mono">{u.email}</td>
                              <td className="px-5 py-4">
                                <span
                                  className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase border font-bold ${
                                    u.role === "ADMIN"
                                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                      : u.role === "MECHANIC"
                                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  }`}
                                >
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-slate-400 font-mono">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* REPAIRS TAB */}
            {activeTab === "repairs" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-bold text-white">Master Repair Jobs</h2>
                  <button
                    onClick={() => setShowJobModal(true)}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Open Repair Job</span>
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                  {jobs
                    .filter((j) =>
                      searchQuery
                        ? `${j.title} ${j.vehicle?.make} ${j.vehicle?.model} ${j.vehicle?.registrationNo}`.toLowerCase().includes(searchQuery.toLowerCase())
                        : true
                    )
                    .map((j) => {
                      const mechanic = j.assignments?.[0]?.mechanic;
                      return (
                        <div key={j.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div>
                                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                                  JOB-#{j.id.substring(0, 8)}
                                </span>
                                <h3 className="text-base sm:text-lg font-bold text-white">{j.title}</h3>
                                <p className="text-xs text-slate-400">
                                  Vehicle: {j.vehicle?.make} {j.vehicle?.model} ({j.vehicle?.year}) • Reg: {j.vehicle?.registrationNo}
                                </p>
                              </div>
                              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                                {j.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-4">
                              {j.description}
                            </p>

                            {/* Assign Mechanic Dropdown */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs gap-2">
                              <span className="text-slate-400 font-medium">Assigned Mechanic:</span>
                              <select
                                value={mechanic?.id || ""}
                                onChange={(e) => handleAssignMechanic(j.id, e.target.value)}
                                className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-300 font-semibold focus:outline-none"
                              >
                                <option value="">-- Unassigned --</option>
                                {mechanics.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.firstName} {m.lastName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-slate-400 truncate">Owner: {j.vehicle?.owner?.firstName} {j.vehicle?.owner?.lastName}</span>
                            <button
                              onClick={() => setSelectedJobForInvoice(j)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-semibold flex items-center gap-1.5 shrink-0"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{j.invoice ? "Update Invoice" : "Issue Invoice"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* INVENTORY TAB */}
            {activeTab === "inventory" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-bold text-white">Parts Inventory Control</h2>
                  <button
                    onClick={() => setShowPartModal(true)}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Part</span>
                  </button>
                </div>

                {/* Responsive Table Wrapper */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
                      <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="px-5 py-3.5">Part Name</th>
                          <th className="px-5 py-3.5">Stock Quantity</th>
                          <th className="px-5 py-3.5">Unit Price ($)</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {parts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-800/40">
                            <td className="px-5 py-4 font-semibold text-white">{p.name}</td>
                            <td className="px-5 py-4 font-mono font-bold">
                              <span className={p.quantity <= 5 ? "text-rose-400" : "text-emerald-400"}>
                                {p.quantity} Units
                              </span>
                            </td>
                            <td className="px-5 py-4 font-mono text-cyan-300">${p.price.toLocaleString()}</td>
                            <td className="px-5 py-4 text-right">
                              <button
                                onClick={() => handleDeletePart(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                title="Delete Part"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal: Create User */}
        {showUserModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowUserModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Create System User</h2>
              <p className="text-xs text-slate-400 mb-6">Add a new admin, mechanic, or customer to AutoFix.</p>

              {userError && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                  {userError}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={userForm.firstName}
                      onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={userForm.lastName}
                      onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assign Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="MECHANIC">MECHANIC</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingUser}
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30"
                  >
                    {savingUser ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Create Job */}
        {showJobModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowJobModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Open Repair Job</h2>
              <p className="text-xs text-slate-400 mb-6">Create a new service job and assign to a mechanic.</p>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Repair Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Transmission Service / Brake Pads Replacement"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Select Customer Vehicle</label>
                  <select
                    required
                    value={jobForm.vehicleId}
                    onChange={(e) => setJobForm({ ...jobForm, vehicleId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Choose Vehicle --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.make} {v.model} ({v.registrationNo}) — Owner: {v.owner?.firstName} {v.owner?.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assign Mechanic (Optional)</label>
                  <select
                    value={jobForm.mechanicId}
                    onChange={(e) => setJobForm({ ...jobForm, mechanicId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Unassigned --</option>
                    {mechanics.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Reported Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe customer complaint or scheduled maintenance..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowJobModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingJob}
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30"
                  >
                    {savingJob ? "Opening..." : "Create Repair Job"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Inventory Part */}
        {showPartModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowPartModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Add Inventory Part</h2>
              <p className="text-xs text-slate-400 mb-6">Specify part details to add to shop inventory stock.</p>

              <form onSubmit={handleCreatePart} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Part Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Synthetic Engine Oil / Spark Plugs"
                    value={partForm.name}
                    onChange={(e) => setPartForm({ ...partForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 50"
                      value={partForm.quantity}
                      onChange={(e) => setPartForm({ ...partForm, quantity: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Unit Price ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 15000"
                      value={partForm.price}
                      onChange={(e) => setPartForm({ ...partForm, price: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowPartModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPart}
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30"
                  >
                    {savingPart ? "Adding..." : "Add Part to Inventory"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Issue Invoice */}
        {selectedJobForInvoice && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setSelectedJobForInvoice(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Issue Job Invoice</h2>
              <p className="text-xs text-slate-400 mb-4">{selectedJobForInvoice.title}</p>

              <form onSubmit={handleIssueInvoice} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Labor Cost ($)</label>
                  <input
                    type="number"
                    required
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <span className="text-slate-400 font-semibold block">Parts Used Summary:</span>
                  {selectedJobForInvoice.partsUsed?.length > 0 ? (
                    selectedJobForInvoice.partsUsed.map((pu: any) => (
                      <div key={pu.id} className="flex justify-between text-slate-300 font-mono">
                        <span>{pu.part?.name} (x{pu.quantity})</span>
                        <span>${(pu.part?.price * pu.quantity).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No parts logged</p>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setSelectedJobForInvoice(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={issuingInvoice}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30"
                  >
                    {issuingInvoice ? "Generating..." : "Generate Invoice"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center text-slate-400 text-sm">
          <span className="inline-block w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2" />
          <p>Syncing administrative data...</p>
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}


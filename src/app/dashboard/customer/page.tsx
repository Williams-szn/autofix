"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Car,
  Wrench,
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  DollarSign,
  AlertCircle,
  X,
  CreditCard,
  UserCheck,
  Bell,
  ChevronRight,
} from "lucide-react";

function CustomerDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "repairs" | "vehicles" | "invoices") || "repairs";

  const [activeTab, setActiveTab] = useState<"repairs" | "vehicles" | "invoices">(initialTab);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Vehicle Modal State
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    registrationNo: "",
    vin: "",
    mileage: "",
  });
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [vehicleError, setVehicleError] = useState<string | null>(null);

  // Diagnosis Modal State
  const [selectedJobForDiagnosis, setSelectedJobForDiagnosis] = useState<any | null>(null);

  // Payment Modal State
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  async function loadCustomerData() {
    setLoading(true);
    try {
      const [vRes, jRes, iRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/jobs"),
        fetch("/api/invoices"),
      ]);

      if (vRes.ok) setVehicles(await vRes.json());
      if (jRes.ok) setJobs(await jRes.json());
      if (iRes.ok) setInvoices(await iRes.json());
    } catch (err) {
      console.error("Failed to fetch customer data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomerData();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["repairs", "vehicles", "invoices"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  const handleRegisterVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingVehicle(true);
    setVehicleError(null);

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register vehicle");

      setShowVehicleModal(false);
      setVehicleForm({
        make: "",
        model: "",
        year: new Date().getFullYear().toString(),
        registrationNo: "",
        vin: "",
        mileage: "",
      });
      loadCustomerData();
    } catch (err: any) {
      setVehicleError(err.message);
    } finally {
      setSavingVehicle(false);
    }
  };

  const handlePayInvoice = async (invoiceId: string) => {
    setProcessingPayment(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: true }),
      });

      if (res.ok) {
        setSelectedInvoiceForPayment(null);
        loadCustomerData();
      }
    } catch (err) {
      console.error("Payment failed", err);
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "READY_FOR_PICKUP":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "IN_PROGRESS":
      case "DIAGNOSING":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Customer Header Banner */}
        <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/20 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-2 sm:mb-3">
                <Car className="w-3.5 h-3.5" /> Customer Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Vehicle Repair Status</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Track your active vehicle maintenance, review technician diagnoses, and approve service invoices.
              </p>
            </div>

            <button
              onClick={() => setShowVehicleModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Register Vehicle</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Responsive Scroll */}
        <div className="flex border-b border-slate-800 gap-4 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("repairs")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === "repairs"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Active Repairs ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("vehicles")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === "vehicles"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Car className="w-4 h-4" />
            <span>My Garage ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === "invoices"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices & Statements ({invoices.length})</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <span className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading your automotive records...</p>
          </div>
        ) : (
          <>
            {/* REPAIRS TAB */}
            {activeTab === "repairs" && (
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
                    <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-300">No Active Repair Jobs</h3>
                    <p className="text-xs text-slate-400 mt-1">When your vehicle is brought in for service, progress will appear here.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => {
                      const mechanic = job.assignments?.[0]?.mechanic;
                      return (
                        <div
                          key={job.id}
                          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
                        >
                          <div>
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                JOB-#{job.id.substring(0, 8)}
                              </span>
                            </div>

                            <h3 className="text-base sm:text-lg font-bold text-white mb-1">{job.title}</h3>
                            <p className="text-xs text-slate-400 mb-4">{job.description}</p>

                            {/* Vehicle detail */}
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1 mb-4">
                              <span className="text-slate-400 font-semibold block">Vehicle Information:</span>
                              <p className="text-slate-200 font-medium">
                                {job.vehicle?.make} {job.vehicle?.model} ({job.vehicle?.year})
                              </p>
                              <p className="text-slate-400 font-mono text-[11px]">
                                Reg No: {job.vehicle?.registrationNo || job.registrationNo}
                              </p>
                            </div>

                            {/* Assigned Mechanic */}
                            {mechanic ? (
                              <div className="flex items-center gap-2.5 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs mb-4">
                                <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-mono uppercase">Assigned Mechanic</span>
                                  <span className="font-semibold text-cyan-300">{mechanic.firstName} {mechanic.lastName}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 mb-4 font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4 shrink-0" />
                                <span>Awaiting Technician Assignment</span>
                              </div>
                            )}
                          </div>

                          {/* Diagnosis Action button */}
                          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                            <button
                              onClick={() => setSelectedJobForDiagnosis(job)}
                              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View Diagnostic Log</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* GARAGE / VEHICLES TAB */}
            {activeTab === "vehicles" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-white">Registered Garage Vehicles</h2>
                  <button
                    onClick={() => setShowVehicleModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Vehicle</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((v) => (
                    <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative shadow-lg">
                      <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                        <Car className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{v.make} {v.model}</h3>
                      <p className="text-xs text-slate-400 font-mono mb-4">Year: {v.year}</p>

                      <div className="space-y-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Registration:</span>
                          <span className="text-cyan-300 font-bold">{v.registrationNo}</span>
                        </div>
                        {v.vin && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">VIN:</span>
                            <span className="text-slate-300">{v.vin}</span>
                          </div>
                        )}
                        {v.mileage && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Mileage:</span>
                            <span className="text-slate-300">{v.mileage.toLocaleString()} miles</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INVOICES TAB */}
            {activeTab === "invoices" && (
              <div className="space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-white">Invoices & Statements</h2>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300 min-w-[600px]">
                      <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-3.5">Invoice ID</th>
                          <th className="px-6 py-3.5">Repair Title</th>
                          <th className="px-6 py-3.5">Total Amount</th>
                          <th className="px-6 py-3.5">Payment Status</th>
                          <th className="px-6 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-800/40">
                            <td className="px-6 py-4 font-mono font-semibold text-cyan-400">
                              INV-#{inv.id.substring(0, 8)}
                            </td>
                            <td className="px-6 py-4 font-semibold text-white">
                              {inv.repairJob?.title}
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-slate-100">
                              ${inv.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              {inv.paid ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                  PAID
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                  UNPAID
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {!inv.paid && (
                                <button
                                  onClick={() => setSelectedInvoiceForPayment(inv)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 ml-auto"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Pay Invoice</span>
                                </button>
                              )}
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

        {/* Vehicle Modal */}
        {showVehicleModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowVehicleModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Register Vehicle</h2>
              <p className="text-xs text-slate-400 mb-6">Add a vehicle to your garage profile.</p>

              {vehicleError && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                  {vehicleError}
                </div>
              )}

              <form onSubmit={handleRegisterVehicle} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Make</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Toyota"
                      value={vehicleForm.make}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Model</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Camry"
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Year</label>
                    <input
                      type="number"
                      required
                      value={vehicleForm.year}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Registration No</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ABC-123"
                      value={vehicleForm.registrationNo}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, registrationNo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">VIN (Optional)</label>
                    <input
                      type="text"
                      placeholder="VIN Number"
                      value={vehicleForm.vin}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vin: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Mileage</label>
                    <input
                      type="number"
                      placeholder="e.g. 45000"
                      value={vehicleForm.mileage}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowVehicleModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingVehicle}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30"
                  >
                    {savingVehicle ? "Registering..." : "Save Vehicle"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Diagnosis Modal */}
        {selectedJobForDiagnosis && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedJobForDiagnosis(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Diagnostic Inspection Log</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">{selectedJobForDiagnosis.title}</h2>
              <p className="text-xs text-slate-400 mb-6">
                Vehicle: {selectedJobForDiagnosis.vehicle?.make} {selectedJobForDiagnosis.vehicle?.model}
              </p>

              {selectedJobForDiagnosis.diagnosis ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] uppercase font-mono text-slate-400 font-bold block mb-1">Findings</span>
                    <p className="text-sm text-slate-200">{selectedJobForDiagnosis.diagnosis.findings}</p>
                  </div>

                  {selectedJobForDiagnosis.diagnosis.notes && (
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[11px] uppercase font-mono text-slate-400 font-bold block mb-1">Technician Recommendations</span>
                      <p className="text-sm text-slate-300">{selectedJobForDiagnosis.diagnosis.notes}</p>
                    </div>
                  )}

                  {selectedJobForDiagnosis.partsUsed?.length > 0 && (
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[11px] uppercase font-mono text-slate-400 font-bold block mb-2">Parts Logged to Repair</span>
                      <div className="space-y-1.5">
                        {selectedJobForDiagnosis.partsUsed.map((pu: any) => (
                          <div key={pu.id} className="flex justify-between text-xs font-mono">
                            <span className="text-slate-300">• {pu.part?.name}</span>
                            <span className="text-cyan-400">Qty: {pu.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Technician diagnostic report is pending.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {selectedInvoiceForPayment && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Confirm Invoice Payment</h2>
              <p className="text-xs text-slate-400 mb-6">
                INV-#{selectedInvoiceForPayment.id.substring(0, 8)} — {selectedInvoiceForPayment.repairJob?.title}
              </p>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 mb-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Service Labor:</span>
                  <span className="text-slate-200 font-mono">${selectedInvoiceForPayment.laborCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Parts Total:</span>
                  <span className="text-slate-200 font-mono">${selectedInvoiceForPayment.partsCost.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                  <span className="text-white">Total Charge:</span>
                  <span className="text-emerald-400 font-mono">${selectedInvoiceForPayment.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePayInvoice(selectedInvoiceForPayment.id)}
                  disabled={processingPayment}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  {processingPayment ? "Processing..." : "Confirm & Pay Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center text-slate-400 text-sm">
          <span className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
          <p>Syncing garage records...</p>
        </div>
      </div>
    }>
      <CustomerDashboardContent />
    </Suspense>
  );
}


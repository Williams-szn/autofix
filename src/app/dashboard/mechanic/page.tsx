"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Wrench,
  Car,
  Package,
  Plus,
  X,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

function MechanicDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "parts" ? "parts" : "jobs";

  const [activeTab, setActiveTab] = useState<"jobs" | "parts">(initialTab);
  const [jobs, setJobs] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Diagnosis Modal
  const [selectedJobForDiagnosis, setSelectedJobForDiagnosis] = useState<any | null>(null);
  const [diagnosisForm, setDiagnosisForm] = useState({ findings: "", notes: "" });
  const [savingDiagnosis, setSavingDiagnosis] = useState(false);

  // Add Part Modal
  const [selectedJobForPart, setSelectedJobForPart] = useState<any | null>(null);
  const [partForm, setPartForm] = useState({ partId: "", partQuantity: "1" });
  const [savingPart, setSavingPart] = useState(false);
  const [partError, setPartError] = useState<string | null>(null);

  async function loadMechanicData() {
    setLoading(true);
    try {
      const [jobsRes, partsRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/parts"),
      ]);

      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (partsRes.ok) setParts(await partsRes.json());
    } catch (err) {
      console.error("Failed to load mechanic data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMechanicData();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "parts") {
      setActiveTab("parts");
    } else {
      setActiveTab("jobs");
    }
  }, [searchParams]);

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadMechanicData();
      }
    } catch (err) {
      console.error("Status update error", err);
    }
  };

  const handleSaveDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForDiagnosis) return;
    setSavingDiagnosis(true);

    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repairJobId: selectedJobForDiagnosis.id,
          findings: diagnosisForm.findings,
          notes: diagnosisForm.notes,
        }),
      });

      if (res.ok) {
        setSelectedJobForDiagnosis(null);
        loadMechanicData();
      }
    } catch (err) {
      console.error("Save diagnosis error", err);
    } finally {
      setSavingDiagnosis(false);
    }
  };

  const handleAddPartToJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForPart) return;
    setSavingPart(true);
    setPartError(null);

    try {
      const res = await fetch(`/api/jobs/${selectedJobForPart.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partId: partForm.partId,
          partQuantity: partForm.partQuantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to attach part to repair job");
      }

      setSelectedJobForPart(null);
      setPartForm({ partId: "", partQuantity: "1" });
      loadMechanicData();
    } catch (err: any) {
      setPartError(err.message);
    } finally {
      setSavingPart(false);
    }
  };

  const openDiagnosisModal = (job: any) => {
    setSelectedJobForDiagnosis(job);
    setDiagnosisForm({
      findings: job.diagnosis?.findings || "",
      notes: job.diagnosis?.notes || "",
    });
  };

  const getStatusBadge = (status: string) => {
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

  const filteredJobs = jobs.filter((j) => {
    if (filterStatus === "ALL") return true;
    return j.status === filterStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Mechanic Header */}
        <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-900/30 via-slate-900 to-slate-900 border border-amber-500/20 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-2 sm:mb-3">
                <Wrench className="w-3.5 h-3.5" /> Technician Workbench
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Assigned Repair Jobs</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Perform diagnostic scans, record inspection notes, update repair stages, and log replacement parts.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-medium overflow-x-auto scrollbar-none w-full sm:w-auto">
              {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors shrink-0 ${
                    filterStatus === st
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Switch Tabs */}
        <div className="flex border-b border-slate-800 gap-4 sm:gap-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "jobs"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Assigned Jobs ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("parts")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "parts"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Shop Parts Inventory ({parts.length})</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <span className="inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading assigned jobs...</p>
          </div>
        ) : activeTab === "parts" ? (
          /* PARTS TAB */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Part Name</th>
                    <th className="px-5 py-3.5">Stock Level</th>
                    <th className="px-5 py-3.5">Unit Price ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {parts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-4 font-semibold text-white">{p.name}</td>
                      <td className="px-5 py-4 font-mono font-bold">
                        <span className={p.quantity <= 5 ? "text-rose-400" : "text-emerald-400"}>
                          {p.quantity} Units Available
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-amber-300">${p.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No Assigned Jobs</h3>
            <p className="text-xs text-slate-400 mt-1">There are no repair jobs currently matching this filter.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Job Header */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        JOB-#{job.id.substring(0, 8)}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{job.title}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border shrink-0 ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  {/* Customer & Vehicle Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs mb-4">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Customer:</span>
                      <p className="font-semibold text-slate-200">
                        {job.vehicle?.owner?.firstName} {job.vehicle?.owner?.lastName}
                      </p>
                      <p className="text-slate-400 text-[11px] truncate">{job.vehicle?.owner?.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Vehicle Specs:</span>
                      <p className="font-semibold text-slate-200">
                        {job.vehicle?.make} {job.vehicle?.model} ({job.vehicle?.year})
                      </p>
                      <p className="text-slate-400 text-[11px] font-mono">Reg: {job.registrationNo || job.vehicle?.registrationNo}</p>
                    </div>
                  </div>

                  {/* Customer Issue Description */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Reported Issue:</span>
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {job.description}
                    </p>
                  </div>

                  {/* Existing Diagnosis Findings */}
                  {job.diagnosis ? (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Diagnosis Record
                        </span>
                        <button
                          onClick={() => openDiagnosisModal(job)}
                          className="text-[11px] text-cyan-400 hover:underline font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-slate-200 font-medium">{job.diagnosis.findings}</p>
                      {job.diagnosis.notes && (
                        <p className="text-slate-400 text-[11px]">Notes: {job.diagnosis.notes}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs flex items-center justify-between">
                      <span className="text-amber-400 font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Diagnosis Pending
                      </span>
                      <button
                        onClick={() => openDiagnosisModal(job)}
                        className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg font-semibold hover:bg-amber-500/30"
                      >
                        + Add Diagnosis
                      </button>
                    </div>
                  )}

                  {/* Used Parts List */}
                  {job.partsUsed?.length > 0 && (
                    <div className="mb-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-400 font-semibold block mb-2">Parts Logged to Job:</span>
                      <div className="space-y-1">
                        {job.partsUsed.map((pu: any) => (
                          <div key={pu.id} className="flex justify-between text-slate-300 font-mono">
                            <span>• {pu.part?.name}</span>
                            <span>x{pu.quantity} (${(pu.part?.price * pu.quantity).toLocaleString()})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mechanic Actions Footer */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400 font-medium">Update Stage:</span>
                    <select
                      value={job.status}
                      onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="DIAGNOSING">DIAGNOSING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="READY_FOR_PICKUP">READY_FOR_PICKUP</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openDiagnosisModal(job)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{job.diagnosis ? "Update Diagnosis" : "Add Diagnosis"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedJobForPart(job);
                        setPartError(null);
                      }}
                      className="py-2 px-3 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>+ Log Part</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Diagnosis Entry</h2>
              <p className="text-xs text-slate-400 mb-6">Record technical findings for {selectedJobForDiagnosis.title}</p>

              <form onSubmit={handleSaveDiagnosis} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Inspection Findings (Required)
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Brake vibration detected. Front brake pads are severely worn."
                    value={diagnosisForm.findings}
                    onChange={(e) => setDiagnosisForm({ ...diagnosisForm, findings: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Technical Notes / Recommendations
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Replace front brake pads and resurface brake rotors."
                    value={diagnosisForm.notes}
                    onChange={(e) => setDiagnosisForm({ ...diagnosisForm, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForDiagnosis(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingDiagnosis}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-600/30"
                  >
                    {savingDiagnosis ? "Saving..." : "Save Diagnosis Log"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Part Modal */}
        {selectedJobForPart && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedJobForPart(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Log Part Usage</h2>
              <p className="text-xs text-slate-400 mb-6">Select a part from inventory to attach to this repair job.</p>

              {partError && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                  {partError}
                </div>
              )}

              <form onSubmit={handleAddPartToJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Select Part</label>
                  <select
                    required
                    value={partForm.partId}
                    onChange={(e) => setPartForm({ ...partForm, partId: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Choose Inventory Part --</option>
                    {parts.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                        {p.name} — ${p.price} ({p.quantity} in stock)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Quantity Used</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={partForm.partQuantity}
                    onChange={(e) => setPartForm({ ...partForm, partQuantity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForPart(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPart}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30"
                  >
                    {savingPart ? "Logging..." : "Log Part to Job"}
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

export default function MechanicDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center text-slate-400 text-sm">
          <span className="inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
          <p>Syncing workbench records...</p>
        </div>
      </div>
    }>
      <MechanicDashboardContent />
    </Suspense>
  );
}


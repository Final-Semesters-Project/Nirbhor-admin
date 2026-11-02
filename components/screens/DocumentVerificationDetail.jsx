"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  User,
  ShieldCheck,
  Check,
  X,
  Maximize2,
  Lock,
  FileCheck2,
  Calendar,
  Briefcase
} from "lucide-react";

export default function DocumentVerificationDetail({
  worker,
  onBack,
  onApprove,
  onReject
}) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const applicant = worker || {
    id: "VER-101",
    name: "Md. Ariful Islam",
    phone: "017xx-xxxxxx",
    category: "Electrician/AC Repair",
    joinedDate: "Jan 2024",
    totalSubmissions: 1,
    status: "Pending",
    selfieImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    nidNumber: "19942691500000843"
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(applicant.user_id || applicant.id);
    } catch (e) {
      console.error("Approval error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason before rejecting the application.");
      return;
    }
    setIsProcessing(true);
    try {
      await onReject(applicant.user_id || applicant.id, rejectionReason);
    } catch (e) {
      console.error("Rejection error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Document Verification
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Reviewing application for: <span className="font-semibold text-gray-800">{applicant.name}</span>
          </p>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
          <span>Back</span>
        </button>
      </div>

      {/* Warning Banner matching Screenshot 4 */}
      <div className="bg-red-50/80 border border-red-200/90 rounded-2xl p-4 flex items-start gap-3 text-red-900 shadow-2xs">
        <div className="p-1 rounded-full bg-red-100 text-red-600 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-red-800">
            Please verify the information carefully. Incorrect approval may create security risks.
          </h4>
          <p className="text-xs text-red-700/80 mt-0.5">
            Compare biometric selfie against government National ID card details and face photograph.
          </p>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (User card + Live Selfie) */}
        <div className="lg:col-span-5 space-y-6">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-500 shrink-0">
                <User className="w-7 h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {applicant.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {applicant.status || "Pending"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {applicant.phone}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Category</span>
                <span className="font-semibold text-gray-800 mt-0.5 block truncate">
                  {applicant.category}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Joined</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">
                  {applicant.joinedDate}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Total Submissions</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">
                  {applicant.totalSubmissions}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Security Level</span>
                <span className="font-semibold text-emerald-700 mt-0.5 block">
                  Level 2 (National ID)
                </span>
              </div>
            </div>
          </div>

          {/* Live Selfie Card matching Screenshot 4 */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                LIVE SELFIE
              </h3>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Biometric Captured
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-4/5 max-h-[380px] bg-gray-100 border border-gray-200 group">
              <img
                src={applicant.selfieImage}
                alt="Live Selfie"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-102"
              />

              {/* Watermark/Metadata Pill */}
              <div className="absolute bottom-3 left-3 right-3 bg-gray-900/85 backdrop-blur-md rounded-lg p-2.5 text-[11px] text-white flex items-center justify-between">
                <div>
                  <span className="font-semibold block">{applicant.name}</span>
                  <span className="text-gray-400 text-[10px]">Liveness check: Passed 99.8%</span>
                </div>
                <button
                  onClick={() => setSelectedImageModal(applicant.selfieImage)}
                  className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (NID FRONT & NID BACK cards) */}
        <div className="lg:col-span-7 space-y-6">
          {/* NID FRONT Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                NID FRONT
              </h3>
              <button
                onClick={() => setSelectedImageModal("nid-front")}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                title="Zoom Document"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* NID Document Front */}
            {applicant.nid_url_front ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 min-h-[220px] bg-gray-50 flex items-center justify-center p-3">
                <img
                  src={applicant.nid_url_front}
                  alt="NID Front"
                  className="max-h-[260px] w-full object-contain rounded-lg shadow-sm"
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[220px]">
                {/* Document Mockup Canvas */}
                <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-300 p-4 relative overflow-hidden">
                  {/* Government Card Banner */}
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#16654e] flex items-center justify-center text-white text-[9px] font-bold">
                        NB
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-800 uppercase tracking-tight">
                          Government National Identity Card
                        </div>
                        <div className="text-[8px] text-gray-500">
                          Government of the People&apos;s Republic
                        </div>
                      </div>
                    </div>
                    <div className="w-4 h-4 border border-emerald-600 rounded-sm bg-emerald-50 text-[7px] flex items-center justify-center text-emerald-800 font-bold">
                      ID
                    </div>
                  </div>

                  {/* Identity rows blurred / confidential view */}
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-20 rounded-md bg-gray-200 border border-gray-300 overflow-hidden relative shrink-0">
                      <img
                        src={applicant.selfieImage}
                        alt="ID Photo"
                        className="w-full h-full object-cover filter blur-[0.8px]"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="h-3 bg-gray-200 rounded w-4/5" />
                      <div className="h-2.5 bg-gray-100 rounded w-2/3" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-300/80 rounded w-3/4 mt-2" />
                    </div>
                  </div>

                  {/* Chip & Watermark */}
                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400 font-mono">
                    <span>NID: 19942691500000843</span>
                    <span className="font-sans font-semibold text-emerald-800">SMART CHIP</span>
                  </div>

                  {/* Restricted Access Overlay Pill */}
                  <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-white/95 rounded-xl shadow-lg border border-gray-200 px-4 py-2.5 flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-[#16654e]" />
                      <div className="text-left">
                        <div className="text-xs font-bold text-gray-900 leading-tight">
                          Confidential Document
                        </div>
                        <div className="text-[10px] text-gray-500">
                          NID Card Front View - Restricted Access
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NID BACK Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                NID BACK
              </h3>
              <button
                onClick={() => setSelectedImageModal("nid-back")}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                title="Zoom Document"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {applicant.nid_url_back ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 min-h-[220px] bg-gray-50 flex items-center justify-center p-3">
                <img
                  src={applicant.nid_url_back}
                  alt="NID Back"
                  className="max-h-[260px] w-full object-contain rounded-lg shadow-sm"
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[220px]">
                {/* Document Mockup Canvas Back */}
                <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-300 p-4 relative overflow-hidden">
                  <div className="space-y-2 mb-3">
                    <div className="text-[10px] text-gray-600 font-semibold">
                      Address / Permanent Residence Verification
                    </div>
                    <div className="h-2 bg-gray-200 rounded w-full" />
                    <div className="h-2 bg-gray-200 rounded w-5/6" />
                    <div className="h-2 bg-gray-200 rounded w-4/6" />
                  </div>

                  {/* Simulated Barcode */}
                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="h-7 w-48 bg-repeat-x flex items-center gap-[2px]">
                      {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 6, 3, 5, 2].map((w, i) => (
                        <span key={i} className="h-full bg-gray-800" style={{ width: `${w}px` }} />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-gray-400">V.2024-BD</span>
                  </div>

                  {/* Restricted Access Overlay Pill */}
                  <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-white/95 rounded-xl shadow-lg border border-gray-200 px-4 py-2.5 flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-[#16654e]" />
                      <div className="text-left">
                        <div className="text-xs font-bold text-gray-900 leading-tight">
                          Confidential Document
                        </div>
                        <div className="text-[10px] text-gray-500">
                          NID Card Back View - Restricted Access
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decision Section matching Screenshot 4 */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
        <div>
          <label
            htmlFor="rejectionReason"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
          >
            Rejection Reason
          </label>
          <textarea
            id="rejectionReason"
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain why the documents were rejected (e.g., blurry image, mismatching name)..."
            className="w-full p-3.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16654e] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            <span>Reject</span>
          </button>

          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#16654e] hover:bg-[#114f3d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>Approve</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-gray-400 text-center pt-2 italic">
          All verification actions are logged and auditable. Action performed by: Super Admin
        </p>
      </div>

      {/* Document Zoom Modal */}
      {selectedImageModal && (
        <div
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">
                Audited Document Preview
              </h3>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex flex-col items-center justify-center bg-gray-50 rounded-xl my-4">
              <img
                src={
                  selectedImageModal === "nid-front"
                    ? (applicant.nid_url_front || applicant.selfieImage)
                    : selectedImageModal === "nid-back"
                    ? (applicant.nid_url_back || applicant.selfieImage)
                    : applicant.selfieImage
                }
                alt="Document Preview"
                className="max-h-[420px] rounded-lg object-contain shadow"
              />
              <p className="text-xs text-gray-500 mt-3 font-mono">
                Hash: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedImageModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-gray-800 text-white rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


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
  Briefcase,
  ExternalLink,
  Shield,
} from "lucide-react";

export default function DocumentVerificationDetail({
  worker,
  onBack,
  onApprove,
  onReject,
}) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [frontImgError, setFrontImgError] = useState(false);
  const [backImgError, setBackImgError] = useState(false);

  const applicant = worker || {
    id: "VER-101",
    name: "Md. Ariful Islam",
    phone: "017xx-xxxxxx",
    joinedDate: "Jan 2024",
    status: "Pending",
    selfieImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    nidNumber: "19942691500000843",
  };

  // Format joined date dynamically from API fields (submitted_at, regDate, created_at, joinedDate)
  const formattedJoinedDate = (() => {
    const rawDate =
      applicant.submitted_at ||
      applicant.created_at ||
      applicant.regDate ||
      applicant.joinedDate;
    if (!rawDate) return "Recent";
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return String(rawDate);
  })();

  // 1. Direct Approve (Confirm) Action Handler
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

  // 2. Reject Submit Handler (called from Rejection Modal)
  const handleConfirmReject = async (e) => {
    e?.preventDefault();
    if (!rejectionReason.trim()) {
      return;
    }
    setIsProcessing(true);
    try {
      await onReject(applicant.user_id || applicant.id, rejectionReason.trim());
      setIsRejectModalOpen(false);
    } catch (e) {
      console.error("Rejection error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Profile Picture URL
  const profilePhotoUrl =
    applicant.photo_url ||
    applicant.selfieImage ||
    applicant.avatar ||
    null;

  // NID Image URLs with fallbacks for different backend/frontend naming conventions
  const nidFrontUrl =
    applicant.nid_url_front ||
    applicant.nidFront ||
    applicant.nid_front ||
    null;

  const nidBackUrl =
    applicant.nid_url_back ||
    applicant.nidBack ||
    applicant.nid_back ||
    null;

  return (
    <div className="space-y-6">
      {/* Top Header with Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Document Verification
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Reviewing application for:{" "}
            <span className="font-semibold text-gray-800">{applicant.name}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
          <span>Back</span>
        </button>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50/80 border border-red-200/90 rounded-2xl p-4 flex items-start gap-3 text-red-900 shadow-2xs">
        <div className="p-1 rounded-full bg-red-100 text-red-600 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-red-800">
            Please verify the information carefully. Incorrect approval may create security risks.
          </h4>
          <p className="text-xs text-red-700/80 mt-0.5">
            Compare profile picture against government National ID card details and photograph.
          </p>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (User card + Profile Picture) */}
        <div className="lg:col-span-5 space-y-6">
          {/* User Info Card (Category & Total Submissions Removed, Joined Date from API) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-500 shrink-0 overflow-hidden">
                {profilePhotoUrl ? (
                  <img
                    src={profilePhotoUrl}
                    alt={applicant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {applicant.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {applicant.status || applicant.verification_status || "Pending"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {applicant.phone}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px] font-medium">Joined</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">
                  {formattedJoinedDate}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px] font-medium">Security Level</span>
                <span className="font-semibold text-emerald-700 mt-0.5 block">
                  Level 2 (National ID)
                </span>
              </div>
            </div>
          </div>

          {/* Profile Picture Card (Row says PROFILE PICTURE, overlay box removed) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                PROFILE PICTURE
              </h3>
              {profilePhotoUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedImageModal(profilePhotoUrl)}
                  className="text-gray-400 hover:text-[#16654e] p-1 transition cursor-pointer"
                  title="Zoom Profile Picture"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {profilePhotoUrl ? (
              <div
                onClick={() => setSelectedImageModal(profilePhotoUrl)}
                className="relative rounded-xl overflow-hidden aspect-4/5 max-h-[380px] bg-gray-100 border border-gray-200 cursor-pointer group"
                title="Click to view full screen"
              >
                <img
                  src={profilePhotoUrl}
                  alt="Profile Picture"
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" /> Full Screen View
                  </span>
                </div>
              </div>
            ) : (
              <div className="min-h-[220px] rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center p-6 text-center">
                <User className="w-10 h-10 text-gray-300 mb-2 stroke-1" />
                <p className="text-xs font-semibold text-gray-400">No profile picture uploaded</p>
              </div>
            )}
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
              {nidFrontUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedImageModal(nidFrontUrl)}
                  className="text-gray-400 hover:text-[#16654e] p-1 transition cursor-pointer"
                  title="Zoom Document"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* NID Document Front View */}
            {nidFrontUrl ? (
              frontImgError ? (
                <div className="min-h-[220px] rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col items-center justify-center p-6 text-center">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-2 stroke-1" />
                  <p className="text-xs font-semibold text-amber-800">Image failed to load</p>
                  <p className="text-[11px] text-amber-700/80 mt-1 max-w-xs break-all truncate">
                    {nidFrontUrl}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setFrontImgError(false); setSelectedImageModal(nidFrontUrl); }}
                    className="mt-3 px-3 py-1 bg-white border border-amber-300 text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-100 transition cursor-pointer"
                  >
                    View / Retry
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setSelectedImageModal(nidFrontUrl)}
                  className="relative rounded-xl overflow-hidden border border-gray-200 min-h-[220px] bg-gray-50 flex items-center justify-center p-3 cursor-pointer group"
                  title="Click to view full screen"
                >
                  <img
                    src={nidFrontUrl}
                    alt="NID Front"
                    onError={() => setFrontImgError(true)}
                    className="max-h-[260px] w-full object-contain rounded-lg shadow-xs group-hover:opacity-90 transition"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" /> Full Screen View
                    </span>
                  </div>
                </div>
              )
            ) : (
              /* Blank/empty state when no front image uploaded from backend */
              <div className="min-h-[220px] rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center p-6 text-center">
                <FileCheck2 className="w-8 h-8 text-gray-300 mb-2 stroke-1" />
                <p className="text-xs font-semibold text-gray-400">No document uploaded</p>
                <p className="text-[11px] text-gray-400/80 mt-0.5">Front side of National ID has not been provided</p>
              </div>
            )}
          </div>

          {/* NID BACK Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                NID BACK
              </h3>
              {nidBackUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedImageModal(nidBackUrl)}
                  className="text-gray-400 hover:text-[#16654e] p-1 transition cursor-pointer"
                  title="Zoom Document"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* NID Document Back View */}
            {nidBackUrl ? (
              backImgError ? (
                <div className="min-h-[220px] rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col items-center justify-center p-6 text-center">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-2 stroke-1" />
                  <p className="text-xs font-semibold text-amber-800">Image failed to load</p>
                  <p className="text-[11px] text-amber-700/80 mt-1 max-w-xs break-all truncate">
                    {nidBackUrl}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setBackImgError(false); setSelectedImageModal(nidBackUrl); }}
                    className="mt-3 px-3 py-1 bg-white border border-amber-300 text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-100 transition cursor-pointer"
                  >
                    View / Retry
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setSelectedImageModal(nidBackUrl)}
                  className="relative rounded-xl overflow-hidden border border-gray-200 min-h-[220px] bg-gray-50 flex items-center justify-center p-3 cursor-pointer group"
                  title="Click to view full screen"
                >
                  <img
                    src={nidBackUrl}
                    alt="NID Back"
                    onError={() => setBackImgError(true)}
                    className="max-h-[260px] w-full object-contain rounded-lg shadow-xs group-hover:opacity-90 transition"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" /> Full Screen View
                    </span>
                  </div>
                </div>
              )
            ) : (
              /* Blank/empty state when no back image uploaded from backend */
              <div className="min-h-[220px] rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center p-6 text-center">
                <FileCheck2 className="w-8 h-8 text-gray-300 mb-2 stroke-1" />
                <p className="text-xs font-semibold text-gray-400">No document uploaded</p>
                <p className="text-[11px] text-gray-400/80 mt-0.5">Back side of National ID has not been provided</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decision Section (Rejection textarea removed, Confirm directly calls API, Reject opens modal) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Verification Decision
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Approve verification to grant verified badge, or reject with a reason to request re-submission.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsRejectModalOpen(true)}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            <span>Reject</span>
          </button>

          <button
            type="button"
            onClick={handleApprove}
            disabled={isProcessing}
            className="px-6 py-2.5 bg-[#16654e] hover:bg-[#114f3d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#16654e]/20 transition cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? "Processing..." : "Confirm & Approve"}</span>
          </button>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-gray-900">
                  Reject Verification Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <p className="text-xs text-gray-600">
                Please provide the reason why <strong className="text-gray-800">{applicant.name}</strong>&apos;s verification is being rejected. This reason is required by the verification API.
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Rejection Reason <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., National ID photo is blurry, name mismatch with database..."
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none font-medium"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <span className="text-[11px] font-semibold text-gray-400 block mb-1.5">
                  Common Reasons:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "NID photo is blurry or unreadable",
                    "Name does not match National ID card",
                    "Selfie photo does not match NID portrait",
                    "Expired or incomplete document submitted",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectionReason(preset)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200/80 transition cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectionReason.trim() || isProcessing}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>{isProcessing ? "Submitting..." : "Submit Rejection"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Zoom / Full Screen Modal */}
      {selectedImageModal && (
        <div
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150 flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="font-bold text-sm text-gray-900">
                Document Full View
              </h3>
              <button
                type="button"
                onClick={() => setSelectedImageModal(null)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 sm:p-4 flex flex-col items-center justify-center bg-gray-950/5 rounded-xl max-h-[75vh] overflow-auto">
              <img
                src={selectedImageModal}
                alt="Document Full View"
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-md"
              />
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              <span className="text-[11px] text-gray-400">Click anywhere outside to close</span>
              <button
                type="button"
                onClick={() => setSelectedImageModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-gray-900 hover:bg-black text-white rounded-xl cursor-pointer transition shadow-xs"
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

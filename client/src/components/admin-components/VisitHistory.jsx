import React, { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import AddTreatmentModal from "./AddTreatmentModal";
import ViewTreatmentsModal from "./ViewTreatmentsModal";
import VisitCard from "./VisitCard";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import "./VisitHistory.css";

export default function VisitHistory({ visits, refreshVisits }) {
  const [loadingVisitId, setLoadingVisitId] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(null);
  const [nextVisitDate, setNextVisitDate] = useState("");
  const [activeVisitId, setActiveVisitId] = useState(null);
  const [dailyForm, setDailyForm] = useState({
    date: "",
    morning: "",
    evening: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [treatments, setTreatments] = useState([]);

  const handleCheckOut = async (visitId) => {
    setLoadingVisitId(visitId);
    try {
      await axios.put(
        `${BASE_URL}/api/visits/checkout/${visitId}`,
        { nextVisit: nextVisitDate || null },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Checked out successfully");
      refreshVisits(); // ✅ Refresh visits after checkout
    } catch {
      toast.error("Failed to check out");
    } finally {
      setLoadingVisitId(null);
      setShowCheckoutModal(null);
      setNextVisitDate("");
      document.body.classList.remove("overflow-hidden");
    }
  };

  const handleAddTreatment = async () => {
    if (!dailyForm.date) return toast.error("Date required");
    try {
      await axios.post(
        `${BASE_URL}/api/treatments/${activeVisitId}/daily-treatment`,
        {
          date: dailyForm.date,
          morning: {
            therapy: dailyForm.morning,
            therapist: dailyForm.morningTherapist || "",
          },
          evening: {
            therapy: dailyForm.evening,
            therapist: dailyForm.eveningTherapist || "",
          },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Treatment added!");
      setShowAddModal(false);
      setDailyForm({
        date: "",
        morning: "",
        evening: "",
        morningTherapist: "",
        eveningTherapist: "",
      });
      setActiveVisitId(null);
    } catch (err) {
      console.error("Treatment Add Error:", err);
      toast.error("Error adding treatment");
    }
  };

  const handleViewTreatments = async (visitId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/treatments/${visitId}/daily-treatment`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTreatments(res.data);
      setShowViewModal(true);
    } catch {
      toast.error("Failed to fetch treatments");
    }
  };

  return (
    <div className="visit-history-container">
      <h2 className="title">Visit History</h2>
      {visits.length === 0 ? (
        <p className="text-muted">No visits yet.</p>
      ) : (
        <div className="visit-list">
          {visits.map((visit) => (
            <VisitCard
              key={visit._id}
              visit={visit}
              onCheckout={() => {
                setShowCheckoutModal(visit._id);
                document.body.classList.add("overflow-hidden");
              }}
              onAdd={() => {
                setActiveVisitId(visit._id);
                setShowAddModal(true);
                document.body.classList.add("overflow-hidden");
              }}
              onView={() => {
                handleViewTreatments(visit._id);
                document.body.classList.add("overflow-hidden");
              }}
              onRefresh={refreshVisits} // ✅ Pass down refresh method
            />
          ))}
        </div>
      )}

      <CheckoutModal
        visible={showCheckoutModal}
        loading={loadingVisitId === showCheckoutModal}
        date={nextVisitDate}
        setDate={setNextVisitDate}
        onCancel={() => {
          setShowCheckoutModal(null);
          setNextVisitDate("");
          document.body.classList.remove("overflow-hidden");
        }}
        onConfirm={() => handleCheckOut(showCheckoutModal)}
      />

      <AddTreatmentModal
        visible={showAddModal}
        form={dailyForm}
        setForm={setDailyForm}
        onCancel={() => {
          setShowAddModal(false);
          document.body.classList.remove("overflow-hidden");
        }}
        onSave={handleAddTreatment}
      />

      <ViewTreatmentsModal
        visible={showViewModal}
        treatments={treatments}
        onClose={() => {
          setShowViewModal(false);
          document.body.classList.remove("overflow-hidden");
        }}
      />
    </div>
  );
}

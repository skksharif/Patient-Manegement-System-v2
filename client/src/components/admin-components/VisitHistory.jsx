import React, { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import VisitCard from "./VisitCard";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import "./VisitHistory.css";

export default function VisitHistory({ visits, refreshVisits }) {
  const [loadingVisitId, setLoadingVisitId] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeVisitId, setActiveVisitId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [treatments, setTreatments] = useState([]);

  const [dailyForm, setDailyForm] = useState({
    date: "",
    morning: "",
    evening: "",
    morningTherapist: "",
    eveningTherapist: "",
  });

  const handleCheckOut = async (visitId) => {
    if (!checkoutDate) {
      toast.error("Please select a checkout date");
      return;
    }

    setLoadingVisitId(visitId);
    try {
      await axios.put(
        `${BASE_URL}/api/visits/checkout/${visitId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Checked out successfully");
      setShowCheckoutModal(null);
      setCheckoutDate("");
      document.body.classList.remove("overflow-hidden");
      refreshVisits();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to check out");
    } finally {
      setLoadingVisitId(null);
    }
  };

  const handleViewTreatments = async (visitId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/treatments/${visitId}/daily-treatment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
              onRefresh={refreshVisits}
            />
          ))}
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        visible={!!showCheckoutModal}
        loading={loadingVisitId === showCheckoutModal}
        date={checkoutDate}
        setDate={setCheckoutDate}
        onCancel={() => {
          setShowCheckoutModal(null);
          setCheckoutDate("");
          document.body.classList.remove("overflow-hidden");
        }}
        onConfirm={() => handleCheckOut(showCheckoutModal)}
      />
    </div>
  );
}

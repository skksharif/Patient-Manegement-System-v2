import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import BASE_URL from "../config";
import { FiDownload } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

import "./DownloadPatientHistory.css";

const DownloadPatientHistory = ({ patientId }) => {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);
    try {
      const patientRes = await axios.get(
        `${BASE_URL}/api/patients/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const patient = patientRes.data;

      const visitRes = await axios.get(
        `${BASE_URL}/api/visits/history/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const visits = visitRes.data;

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Border shadow effect
      doc.setDrawColor(180);
      doc.setLineWidth(0.2);
      doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

      // Logo
      const logo = "/doc-logo.png"; // logo should be in public folder
      doc.addImage(logo, "PNG", 15, 10, 25, 25);

      // Header Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Prakruthi Ashramam", pageWidth / 2, 18, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Patient Visit History Report", pageWidth / 2, 26, {
        align: "center",
      });

      // Patient Info Section
      const personalInfo = [
        ["Name", patient.name],
        ["Phone", patient.phone],
        ["Aadhar", patient.aadharNo],
        ["Gender", patient.gender],
        ["Age", patient.age],
        ["Address", patient.address],
        ["Created At", new Date(patient.createdAt).toLocaleString()],
      ];

      autoTable(doc, {
        startY: 36,
        head: [["Patient Details", ""]],
        body: personalInfo,
        theme: "plain",
        styles: {
          fontSize: 11,
          textColor: "#333",
          lineColor: "#ccc",
          lineWidth: 0.1,
        },
        headStyles: {
          fontStyle: "bold",
          fillColor: [220, 230, 241],
          textColor: "#000",
        },
        margin: { left: 14, right: 14 },
      });

      // Visit Table
      const visitData = visits.map((v, i) => [
        i + 1,
        v.type,
        v.reason || "-",
        v.note || "-",
        v.doctor || "-",
        v.roomNo || "-",
        v.checkInTime ? new Date(v.checkInTime).toLocaleString() : "-",
        v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : "-",
        v.nextVisit ? new Date(v.nextVisit).toLocaleDateString() : "Not set",
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [
          [
            "#",
            "Type",
            "Reason",
            "Note",
            "Doctor",
            "Room No",
            "Check-In",
            "Check-Out",
            "Next Visit",
          ],
        ],
        body: visitData,
        theme: "striped",
        styles: { fontSize: 10, cellPadding: 2.5 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 10, right: 10 },
      });

      // Footer on each page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10);
        doc.text(
          "AIMS Hospital · Contact: 9876543210 · aims@example.com",
          pageWidth / 2,
          pageHeight - 10,
          {
            align: "center",
          }
        );
      }

      // Save
      doc.save(`${patient.name}-VisitHistory.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
    setLoading(false);
  };

  return (
    <button onClick={generatePDF} className="download-btn" disabled={loading}>
      {loading ? (
        <>
          <FaSpinner className="spin" style={{ marginRight: 8 }} />
          Generating PDF...
        </>
      ) : (
        <>
          <FiDownload style={{ marginRight: 8 }} />
          Download History as PDF
        </>
      )}
    </button>
  );
};

export default DownloadPatientHistory;

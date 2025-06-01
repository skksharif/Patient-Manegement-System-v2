import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import BASE_URL from "../config";
import "./DownloadPatientHistory.css";
import { FaFileDownload } from "react-icons/fa";


const DownloadPatientHistory = ({ patientId }) => {
  const generatePDF = async () => {
    try {
      // 🔹 Fetch Patient Data
      const patientRes = await axios.get(
        `${BASE_URL}/api/patients/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const patient = patientRes.data;

      // 🔹 Fetch Visit History
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

      // 🏥 Title (optional: add logo here with doc.addImage)
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Prakruthi Ashram", pageWidth / 2, 15, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Patient Visit History Report", pageWidth / 2, 23, { align: "center" });

      // 📌 Section: Patient Details
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
        startY: 30,
        head: [["Patient Details", ""]],
        body: personalInfo,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2.5 },
        headStyles: { fillColor: [52, 152, 219] },
        margin: { left: 14, right: 14 },
      });

      // 📌 Section: Visit History
      const visitData = visits.map((v, i) => [
        i + 1,
        v.type,
        v.reason || "-",
        v.note || "-",
        v.checkInTime ? new Date(v.checkInTime).toLocaleString() : "-",
        v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : "-",
        v.nextVisit ? new Date(v.nextVisit).toLocaleDateString() : "Not set",
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [
          [
            "#",
            "Type",
            "Reason",
            "Note",
            "Check-In",
            "Check-Out",
            "Next Visit",
          ],
        ],
        body: visitData,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2.5 },
        headStyles: { fillColor: [39, 174, 96] },
        margin: { left: 10, right: 10 },
      });

      // 📄 Footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, 290);
      }

      // 💾 Save
      doc.save(`${patient.name}-VisitHistory.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <button onClick={generatePDF} className="download-btn">
       <FaFileDownload/> Download History as PDF
    </button>
  );
};

export default DownloadPatientHistory;

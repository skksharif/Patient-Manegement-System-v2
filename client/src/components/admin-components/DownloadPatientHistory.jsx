// Updated DownloadPatientHistory component
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
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const [patientRes, visitRes, groupedRes, caseStudyRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/patients/${patientId}`, { headers }),
        axios.get(`${BASE_URL}/api/visits/history/${patientId}`, { headers }),
        axios.get(`${BASE_URL}/api/treatments/by-checkinout`, { headers }),
        axios.get(`${BASE_URL}/api/visits/case-studies/grouped`, { headers }),
      ]);

      const patient = patientRes.data || {};
      const visits = visitRes.data || [];
      const grouped = groupedRes.data || [];
      const caseGroups = caseStudyRes.data || [];

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const usableWidth = pageWidth - 2 * margin;
      const oliveGreen = [46, 125, 50];
      const accentOrange = [226, 131, 50];
      const logo = "/doc-logo.png";

      const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-IN") : "Not Discharged";

      const trim = (s) => (s ? s.toString().trim() : "-");

      const addHeader = (firstPage = false) => {
        doc.setDrawColor(...oliveGreen);
        doc.setLineWidth(0.8);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
        const logoWidth = 40;
        const logoHeight = 16;
        const logoX = (pageWidth - logoWidth) / 2;
        if (firstPage) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(...oliveGreen);
          doc.text("CLIENT HISTORY", margin, 22);
        }
        doc.addImage(logo, "PNG", logoX, 12, logoWidth, logoHeight);
      };

      addHeader(true);

      autoTable(doc, {
        startY: 32,
        head: [["Patient Details", ""]],
        body: [
          ["Name", trim(patient.name)],
          ["Phone", trim(patient.phone)],
          ["Aadhar", trim(patient.aadharNo)],
          ["Gender", trim(patient.gender)],
          ["Age", patient.age != null ? patient.age : "-"],
          ["Address", doc.splitTextToSize(trim(patient.address), usableWidth * 0.7)],
        ],
        theme: "grid",
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 1.5 },
        headStyles: { fillColor: oliveGreen, textColor: 255 },
      });

      let y = doc.lastAutoTable.finalY + 12;

      // OP Records
      const opVisits = visits.filter((v) => v.type === "OP");
      if (opVisits.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("OP Records", margin, y);
        y += 6;

        autoTable(doc, {
          startY: y,
          head: [["Name", "Phone", "Therapist", "Therapy", "Date"]],
          body: opVisits.map((v) => [
            trim(patient.name),
            trim(patient.phone),
            trim(v.therapist),
            trim(v.therapy || v.reason),
            formatDate(v.checkInTime),
          ]),
          margin: { left: margin, right: margin },
          styles: { fontSize: 8, cellPadding: 1.5 },
          headStyles: { fillColor: accentOrange, textColor: 255 },
          didDrawPage: (data) => {
            y = data.cursor.y + 6;
            addHeader(false);
          },
        });
        y = doc.lastAutoTable.finalY + 12;
      }

      // IP Records
      const ipVisits = visits.filter((v) => v.type === "IP");
      if (ipVisits.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("IP Records", margin, y);
        y += 6;

        autoTable(doc, {
          startY: y,
          head: [["Name", "Phone", "Reason", "Note", "Room No", "Check-In", "Check-Out"]],
          body: ipVisits.map((v) => [
            trim(patient.name),
            trim(patient.phone),
            doc.splitTextToSize(trim(v.reason), 30),
            doc.splitTextToSize(trim(v.note), 40),
            trim(v.roomNo),
            formatDate(v.checkInTime),
            v.checkOutTime ? formatDate(v.checkOutTime) : "Not Discharged",
          ]),
          margin: { left: margin, right: margin },
          styles: { fontSize: 8, cellPadding: 1.5 },
          headStyles: { fillColor: accentOrange, textColor: 255 },
          columnStyles: {
            2: { cellWidth: 30 },
            3: { cellWidth: 40 },
          },
          didDrawPage: (data) => {
            y = data.cursor.y + 6;
            addHeader(false);
          },
        });
        y = doc.lastAutoTable.finalY + 12;
      }

      // Daily Treatments (Reversed Order)
      if (grouped.length) {
        doc.addPage();
        addHeader(false);
        y = 24;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Daily Treatments", margin, y);
        y += 15;

        [...grouped].forEach((grp, idx) => {
          const ci = formatDate(grp.checkIn);
          const co = grp.checkOut ? formatDate(grp.checkOut) : "Not Discharged";
          doc.setFontSize(9);
          doc.text(`Visit ${grouped.length - idx}: ${ci} to ${co}`, margin, y);
          y += 6;

          if (!grp.treatments?.length) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            doc.text("No treatments available for this visit.", margin, y);
            y += 10;
            return;
          }

          autoTable(doc, {
            startY: y,
            head: [["Date", "Morning Therapy", "Morning Therapist", "Evening Therapy", "Evening Therapist"]],
            body: grp.treatments.map((t) => [
              formatDate(t.date),
              trim(t.morning?.therapy),
              trim(t.morning?.therapist),
              trim(t.evening?.therapy),
              trim(t.evening?.therapist),
            ]),
            margin: { left: margin, right: margin },
            styles: { fontSize: 8, cellPadding: 1.3 },
            headStyles: { fillColor: accentOrange, textColor: 255 },
            didDrawPage: (data) => {
              y = data.cursor.y + 6;
              addHeader(false);
            },
          });

          y = doc.lastAutoTable.finalY + 10;
          if (y + 30 > pageHeight - margin) {
            doc.addPage();
            addHeader(false);
            y = 24;
          }
        });
      }

      // Case Studies Section (Reversed Order)
      if (caseGroups.length) {
        doc.addPage();
        addHeader(false);
        y = 24;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...oliveGreen);
        doc.text("Case Studies", margin, y);
        y += 10;

        [...caseGroups].reverse().forEach((grp, idx) => {
          const ci = formatDate(grp._id.checkIn);
          const co = grp._id.checkOut ? formatDate(grp._id.checkOut) : "Not Discharged";
          const title = `Visit ${caseGroups.length - idx}: ${ci} to ${co}`;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(0);
          doc.text(title, margin, y);
          y += 6;

          grp.caseStudies.forEach((cs) => {
            const para = doc.splitTextToSize(`${trim(cs.caseStudy)}`, usableWidth*1.2);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(para, margin, y+1);
            y += para.length * 4 + 2;

            if (y + 20 > pageHeight - margin) {
              doc.addPage();
              addHeader(false);
              y = 24;
            }
          });
          y += 4;
        });
      }

      doc.save(`${trim(patient.name)}-visit-history.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
    setLoading(false);
  };

  return (
    <button onClick={generatePDF} className="download-btn" disabled={loading}>
      {loading ? (
        <>
          <FaSpinner className="spin" style={{ marginRight: 8 }} /> Generating PDF...
        </>
      ) : (
        <>
          <FiDownload style={{ marginRight: 8 }} /> Download History as PDF
        </>
      )}
    </button>
  );
};

export default DownloadPatientHistory;

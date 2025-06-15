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
  function getTruncatedLines(doc, text, width, maxLines = 2) {
    const lines = doc.splitTextToSize(text, width);
    if (lines.length <= maxLines) return lines;

    const truncated = lines.slice(0, maxLines);
    const lastLine = truncated[truncated.length - 1];

    // Add ellipsis to the last line
    let shortened = lastLine;
    while (
      doc.getTextWidth(shortened + "...") > width &&
      shortened.length > 0
    ) {
      shortened = shortened.slice(0, -1);
    }
    truncated[truncated.length - 1] = shortened + "...";
    return truncated;
  }

  const generatePDF = async () => {
    setLoading(true);
    try {
      const patientRes = await axios.get(
        `${BASE_URL}/api/patients/${patientId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const patient = patientRes.data;

      const visitRes = await axios.get(
        `${BASE_URL}/api/visits/history/${patientId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const visits = visitRes.data;

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const oliveGreen = [46, 125, 50];
      const accentOrange = [226, 131, 50];
      const today = new Date().toLocaleDateString();
      const logo = "/doc-logo.png";

      const addPageBorder = () => {
        doc.setDrawColor(...oliveGreen);
        doc.setLineWidth(0.8);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      };

      const addHeader = (firstPage = false) => {
        addPageBorder();

        if (firstPage) {
          const logoWidth = 40;
          const logoHeight = 16;
          const logoX = (pageWidth - logoWidth) / 2;
          const logoY = 12;

          // Title to the left of logo
          const titleX = logoX - 70; // Adjust this as needed
          const titleY = logoY + 10;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(...oliveGreen);
          doc.text("CLIENT HISTORY", titleX, titleY); // Left of the logo

          doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight); // Centered logo
        } else {
          const logoWidth = 30;
          const logoHeight = 12;
          const logoX = (pageWidth - logoWidth) / 2;
          doc.addImage(logo, "PNG", logoX, 12, logoWidth, logoHeight); // Centered logo
        }
      };

      addHeader(true);

      const personalInfo = [
        ["Name", patient.name],
        ["Phone", patient.phone],
        ["Aadhar", patient.aadharNo],
        ["Gender", patient.gender],
        ["Age", patient.age],
        ["Address", patient.address],
      ];

      autoTable(doc, {
        startY: 32,
        head: [["Patient Details", ""]],
        body: personalInfo,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 1,
          textColor: "#333",
          lineColor: "#ccc",
        },
        headStyles: {
          fontStyle: "bold",
          fillColor: oliveGreen,
          textColor: 255,
        },
        margin: { left: 14, right: 14 },
      });

      let y = doc.lastAutoTable.finalY + 6;
      const marginX = 14;
      const lineHeight = 5;
      const labelWidth = 30;
      const valueWidth = (pageWidth - marginX * 2 - 8 - labelWidth * 2) / 2;

      visits.forEach((v, i) => {
        const leftFields = [
          ["Type", v.type || "-"],
          ["Doctor", v.doctor || "-"],
          ["Therapist", v.therapist || "-"],
          ["Reason", v.reason || "-"],
          ...(v.note ? [["Note", v.note]] : []),
        ];

        const rightFields = [
          ["Room", v.roomNo || "-"],
          [
            "Check-In",
            v.checkInTime ? new Date(v.checkInTime).toLocaleDateString() : "-",
          ],
          [
            "Check-Out",
            v.checkOutTime
              ? new Date(v.checkOutTime).toLocaleDateString()
              : "-",
          ],
          [
            "Next Visit",
            v.nextVisit
              ? new Date(v.nextVisit).toLocaleDateString()
              : "Not set",
          ],
        ];

        const numRows = Math.max(leftFields.length, rightFields.length);
        const contentHeight = numRows * lineHeight + 10;

        if (y + contentHeight > pageHeight - 20) {
          doc.addPage();
          addHeader(false);
          y = 24;
        }

        doc.setFillColor(248, 248, 248);
        doc.rect(marginX, y, pageWidth - marginX * 2, contentHeight, "F");

        doc.setFillColor(...accentOrange);
        doc.rect(marginX, y, pageWidth - marginX * 2, 6, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255);
        doc.text(`Visit ${visits.length - i}`, marginX + 2, y + 4);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor("#000");

        let rowY = y + 10;
        for (let r = 0; r < numRows; r++) {
          const left = leftFields[r];
          const right = rightFields[r];

          if (left) {
            const leftLines = getTruncatedLines(doc, left[1], valueWidth);
            doc.text(`${left[0]}:`, marginX + 4, rowY);
            doc.text(leftLines, marginX + 4 + labelWidth, rowY);
          }
          if (right) {
            const rightLines = getTruncatedLines(doc, right[1], valueWidth);
            doc.text(
              `${right[0]}:`,
              marginX + 4 + labelWidth + valueWidth + 4,
              rowY
            );
            doc.text(
              rightLines,
              marginX + 4 + labelWidth * 2 + valueWidth + 4,
              rowY
            );
          }

          const rowHeight =
            Math.max(
              left ? getTruncatedLines(doc, left[1], valueWidth).length : 1,
              right ? getTruncatedLines(doc, right[1], valueWidth).length : 1
            ) * lineHeight;
          rowY += rowHeight;
        }

        y += contentHeight + 2;
      });

      if (y + 12 > pageHeight - 20) {
        doc.addPage();
        addHeader(false);
        y = 24;
      }

      doc.setTextColor(...oliveGreen);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.text(
        "Note: This is a digitally generated report and does not require a signature.",
        marginX,
        y + 8
      );

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

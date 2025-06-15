import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Enquiry.css";
import BASE_URL from "../config";

export default function Enquiry() {
  const [form, setForm] = useState({ name: "", phone: "", enquiry: "" });
  const [enquiries, setEnquiries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({ term: "", field: "name" });

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/enquiries`);
      setEnquiries(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error("Failed to fetch enquiries", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.enquiry) {
      toast.warn("Please fill all fields", { position: "top-right" });
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/enquiries`, form);
      setForm({ name: "", phone: "", enquiry: "" });
      toast.success("Enquiry submitted successfully", {
        position: "top-right",
      });
      fetchEnquiries();
    } catch (err) {
      toast.error("Failed to submit enquiry", { position: "top-right" });
    }
    setLoading(false);
  };

  const handleSearch = () => {
    const searchTerm = search.term.toLowerCase();
    const searchField = search.field;

    const result = enquiries.filter((e) => {
      if (searchField === "name") {
        return e.name.toLowerCase().includes(searchTerm);
      } else if (searchField === "phone") {
        return e.phone.toLowerCase().includes(searchTerm);
      }
      return true; // Default case, though not expected
    });
    setFiltered(result);
  };

  return (
    <div className="enquiry-container">
      <div className="enquiry-layout">
        {/* Left Column: Form */}
        <div className="enquiry-form-section">
          <div className="enquiry-card">
            <h2 className="enquiry-title">Submit New Enquiry</h2>
            <form className="enquiry-form-horizontal" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="enquiry-input"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="enquiry-input"
              />
              <textarea
                placeholder="Enquiry Details"
                value={form.enquiry}
                onChange={(e) => setForm({ ...form, enquiry: e.target.value })}
                className="enquiry-textarea"
              />
              <button
                type="submit"
                disabled={loading}
                className="enquiry-button"
              >
                {loading ? "Submitting..." : "Submit Enquiry"}
              </button>
            </form>
          </div>
          <div className="enquiry-card">
            <h3 className="enquiry-subtitle">Search Enquiries</h3>
            <div className="search-box">
              <div className="search-fields">
                <input
                  type="text"
                  placeholder={`Search by ${
                    search.field === "name" ? "Name" : "Phone"
                  }`}
                  value={search.term}
                  onChange={(e) =>
                    setSearch({ ...search, term: e.target.value })
                  }
                  className="enquiry-input"
                />
                <div className="search-btn-opt">
                  <select
                    value={search.field}
                    onChange={(e) =>
                      setSearch({ ...search, field: e.target.value })
                    }
                    className="enquiry-select"
                  >
                    <option value="name">Search by Name</option>
                    <option value="phone">Search by Mobile</option>
                  </select>
                  <button onClick={handleSearch} className="enquiry-button">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Search and Enquiries */}
        <div className="enquiry-list-section">
          <div className="enquiry-list">
            <h3 className="enquiry-subtitle">Enquiries</h3>
            {filtered.length === 0 ? (
              <p className="no-data">No enquiries found.</p>
            ) : (
              <div className="enquiry-list-items">
                {filtered.map((e, i) => (
                  <div key={e._id} className="enquiry-card-item">
                    <h4 className="enquiry-card-title">
                      {i + 1}. {e.name}
                    </h4>
                    <p>
                      <strong>Phone:</strong> {e.phone}
                    </p>
                    <p>
                      <strong>Enquiry:</strong> {e.enquiry}
                    </p>
                    <p className="enquiry-date">
                      <strong>Date:</strong> {new Date(e.date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

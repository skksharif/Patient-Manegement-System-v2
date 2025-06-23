import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "./Enquiry.css";
import BASE_URL from "../config";

export default function Enquiry() {
  const formatDate = (date) => {
    if (!date) return "Not Available";
    const d = new Date(date);
    const dateStr = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return dateStr;
  };

  const [form, setForm] = useState({
    name: "",
    phone: "",
    enquiry: "",
    date: new Date(),
  });
  const [editId, setEditId] = useState(null);
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
      toast.error("Failed to fetch enquiries");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, enquiry, date } = form;
    if (!name || !phone || !enquiry) {
      toast.warn("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, date: form.date.toISOString() };
      if (editId) {
        await axios.put(`${BASE_URL}/api/enquiries/${editId}`, payload);
        toast.success("Enquiry updated");
      } else {
        await axios.post(`${BASE_URL}/api/enquiries`, payload);
        toast.success("Enquiry submitted");
      }

      setForm({ name: "", phone: "", enquiry: "", date: new Date() });
      setEditId(null);
      fetchEnquiries();
    } catch {
      toast.error("Failed to submit enquiry");
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      phone: item.phone,
      enquiry: item.enquiry,
      date: new Date(item.date),
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    const searchTerm = search.term.toLowerCase();
    const result = enquiries.filter((e) =>
      e[search.field].toLowerCase().includes(searchTerm)
    );
    setFiltered(result);
  };

  return (
    <div className="enquiry-container">
      <div className="enquiry-layout">
        <div className="enquiry-form-section">
          <div className="enquiry-card">
            <h2 className="enquiry-title">
              {editId ? "Edit" : "Submit New"} Enquiry
            </h2>
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
              <DatePicker
                selected={form.date}
                onChange={(date) => setForm({ ...form, date })}
                dateFormat="dd/MM/yyyy"
                className="enquiry-input"
              />
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="enquiry-button"
                >
                  {loading
                    ? "Submitting..."
                    : editId
                    ? "Update Enquiry"
                    : "Submit Enquiry"}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="enquiry-button cancel"
                    onClick={() => {
                      setEditId(null);
                      setForm({
                        name: "",
                        phone: "",
                        enquiry: "",
                        date: new Date(),
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="enquiry-card">
            <h3 className="enquiry-subtitle">Search Enquiries</h3>
            <div className="search-box">
              <div className="search-fields">
                <div className="search-btn-opt">
                  <input
                    type="text"
                    placeholder={`Search by ${search.field}`}
                    value={search.term}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearch({ ...search, term: value });
                      const searchTerm = value.toLowerCase();
                      const result = enquiries.filter((enquiry) =>
                        enquiry[search.field].toLowerCase().includes(searchTerm)
                      );
                      setFiltered(result);
                    }}
                    className="enquiry-input"
                  />

                  <select
                    value={search.field}
                    onChange={(e) => {
                      setSearch({ ...search, field: e.target.value });
                    }}
                    className="enquiry-select"
                  >
                    <option value="phone"> Phone</option>
                    <option value="name"> Name</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="enquiry-list-section">
          <div className="enquiry-list">
            <div className="enquiry-list-header">
              <h3 className="enquiry-subtitle">Enquiries</h3>
              <h3 className="enquiry-subtitle">
                Total Count : {filtered.length}
              </h3>
            </div>
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
                      <strong>Date:</strong> {formatDate(e.date)}
                    </p>
                    <button
                      className="enquiry-edit-btn"
                      onClick={() => handleEdit(e)}
                    >
                      Edit
                    </button>
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

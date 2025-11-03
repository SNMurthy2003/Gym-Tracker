import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import "./Dashboard.css";

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [openPanel, setOpenPanel] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Top tabs
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/members");
      const data = await res.json();
      setMembers(data || []);
    } catch (err) {
      console.error("fetchMembers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecent = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/members/recent");
      const data = await res.json();
      setRecentMembers(data || []);
    } catch (err) {
      console.error("fetchRecent:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchRecent();
  }, []);

  // Stats
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === "Active").length;
  const overduePayments = members.filter((m) => m.payment === "Overdue").length;

  // ✅ Force revenue to 10000 always
  const totalRevenue = 10000;

  const open = (panel) => {
    setOpenPanel(panel);
    fetchMembers();
    fetchRecent();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    alert("✅ Logged out successfully");
    window.location.href = "/";
  };

  return (
    <div className="dashboard container-max">
      {/* ✅ Top Header with Logout - REPOSITIONED */}
      <motion.div
        className="dashboard-topbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="dashboard-logo">Gym Admin Dashboard</h1>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </motion.div>

      {/* ✅ Top Tabs Navigation */}
      <div className="top-tabs">
        <button
          className={activeTab === "dashboard" ? "tab active" : "tab"}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={activeTab === "members" ? "tab active" : "tab"}
          onClick={() => setActiveTab("members")}
        >
          Members
        </button>
        <button
          className={activeTab === "payments" ? "tab active" : "tab"}
          onClick={() => setActiveTab("payments")}
        >
          Payments
        </button>
        <button
          className={activeTab === "whatsapp" ? "tab active" : "tab"}
          onClick={() => setActiveTab("whatsapp")}
        >
          WhatsApp
        </button>
      </div>

      {/* ✅ Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div>
          <div className="stat-cards-row">
            <div className="stat-card blue">
              <div className="stat-icon">👥</div>
              <p className="stat-label">Total Members</p>
              <h2 className="stat-value">{totalMembers}</h2>
              <p className="stat-sub">{activeMembers} active members</p>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">💰</div>
              <p className="stat-label">Total Revenue</p>
              <h2 className="stat-value">₹{totalRevenue}</h2>
              <p className="stat-sub">This month</p>
            </div>
            <div className="stat-card yellow">
              <div className="stat-icon">⏳</div>
              <p className="stat-label">Pending Payments</p>
              <h2 className="stat-value">
                {members.filter((m) => m.payment === "Pending").length}
              </h2>
              <p className="stat-sub">Awaiting payment</p>
            </div>
            <div className="stat-card red">
              <div className="stat-icon">🔔</div>
              <p className="stat-label">Overdue Payments</p>
              <h2 className="stat-value">{overduePayments}</h2>
              <p className="stat-sub">Requires attention</p>
            </div>
          </div>

          {overduePayments > 0 && (
            <div className="overdue-panel">
              <h3>🚨 Overdue Payments</h3>
              <div className="overdue-list">
                {members
                  .filter((m) => m.payment === "Overdue")
                  .map((m) => (
                    <div key={m._id} className="overdue-item">
                      <p>
                        <strong>{m.name}</strong> - ₹{m.amount || "0"}
                      </p>
                      <p className="overdue-date">
                        Due: {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ Members Tab */}
      {activeTab === "members" && (
        <MembersEmbedded
          title="All Members"
          members={members}
          loading={loading}
          fetchMembers={fetchMembers}
        />
      )}

      {/* ✅ Payments Tab */}
      {activeTab === "payments" && (
        <PaymentsEmbedded
          members={members}
          loading={loading}
          fetchMembers={fetchMembers}
        />
      )}

      {/* ✅ WhatsApp Tab */}
      {activeTab === "whatsapp" && (
        <motion.div
          className="embedded-panel whatsapp-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="whatsapp-header">
            <h2>WhatsApp Integration</h2>
            <p>Connect with GymTrack support instantly via WhatsApp</p>
          </div>

          <div className="whatsapp-content">
            <div className="whatsapp-qr-section">
              <div className="qr-code-container">
                <QRCodeSVG
                  value="https://wa.me/14155238886?text=join%20musical-move"
                  size={200}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#25D366"
                />
              </div>
              <p className="qr-caption">Scan or click to message GymTrack instantly on WhatsApp</p>
            </div>

            <div className="whatsapp-button-section">
              <a
                href="https://wa.me/14155238886?text=join%20musical-move"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Chat on WhatsApp
              </a>

              <div className="whatsapp-info">
                <p><strong>GymTrack WhatsApp Support</strong></p>
                <p>+1 415 523 8886</p>
                <p className="whatsapp-note">Scan the QR code or click the button above. Your message will be pre-filled with "join musical-move" — just press Send!</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Members Component with Add Modal ---------- */
function MembersEmbedded({ title, members, loading, fetchMembers }) {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [deletingMemberId, setDeletingMemberId] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Edit member handler
  const handleEditClick = (member) => {
    setEditingMember(member);
    setShowEditModal(true);
  };

  // Delete member handler
  const handleDeleteClick = (memberId) => {
    setDeletingMemberId(memberId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (isDeleting) return; // Prevent double submission
    setIsDeleting(true);

    try {
      const res = await fetch(`http://localhost:5000/api/members/${deletingMemberId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShowDeleteConfirm(false);
        setDeletingMemberId(null);
        await fetchMembers(); // Refresh the member list
        alert("✅ Member deleted successfully");
      } else {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        alert("❌ Error: " + (err.error || "Failed to delete member"));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete member. Please check your connection and try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="embedded-panel">
      <div className="embedded-panel-header">
        <h2>{title}</h2>
        <button
          className="btn-add-member"
          onClick={() => setShowAddModal(true)}
        >
          + Add Member
        </button>
      </div>

      {/* ✅ Add Member Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Member</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <form
                className="add-member-form"
                onSubmit={async (e) => {
                  e.preventDefault();

                  const plan = e.target[3].value;
                  const startDate = new Date(e.target[4].value);

                  // ✅ Auto calculate due date
                  let dueDate = new Date(startDate);
                  if (plan === "Monthly") {
                    dueDate.setDate(startDate.getDate() + 30);
                  } else if (plan === "Quarterly") {
                    dueDate.setDate(startDate.getDate() + 90);
                  } else if (plan === "Yearly") {
                    dueDate.setDate(startDate.getDate() + 365);
                  }

                  const formData = {
                    name: e.target[0].value,
                    phone: e.target[1].value,
                    email: e.target[2].value,
                    plan,
                    startDate,
                    dueDate,
                    paymentDate: null,
                    status: "Active",
                    amount: 1000,
                    payment: "Pending",
                    method: "Cash",
                  };

                  try {
                    const res = await fetch(
                      "http://localhost:5000/api/members",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                      }
                    );
                    if (res.ok) {
                      alert("✅ Member added successfully");
                      e.target.reset();
                      setShowAddModal(false);
                      fetchMembers();
                    } else {
                      const err = await res.json();
                      alert("❌ Error: " + err.error);
                    }
                  } catch (err) {
                    console.error("Add Member failed:", err);
                    alert("❌ Failed to add member");
                  }
                }}
              >
                <label>Name *</label>
                <input type="text" placeholder="Enter name" required />
                <label>Phone *</label>
                <input type="text" placeholder="Enter phone number" required />
                <label>Email</label>
                <input type="email" placeholder="Enter email" />
                <label>Membership Plan *</label>
                <select required>
                  <option value="">Select a plan</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                <label>Start Date *</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
                <button type="submit" className="btn-submit">
                  Add Member
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="embedded-table-wrap">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="members-table-embedded">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "#777" }}>
                    No members
                  </td>
                </tr>
              )}
              {members.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.phone || "-"}</td>
                  <td>{m.email || "-"}</td>
                  <td>{m.plan || "-"}</td>
                  <td>
                    <button
                      className={`status-btn ${
                        m.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {m.status === "Active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    {m.startDate
                      ? new Date(m.startDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action edit"
                        onClick={() => handleEditClick(m)}
                        title="Edit Member"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={() => handleDeleteClick(m._id)}
                        title="Delete Member"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Edit Member Modal */}
      {showEditModal && editingMember && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Member</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMember(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <form
                className="add-member-form"
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (isSubmitting) return; // Prevent double submission
                  setIsSubmitting(true);

                  try {
                    const plan = e.target[3].value;
                    const startDate = new Date(e.target[4].value);

                    // Auto calculate due date
                    let dueDate = new Date(startDate);
                    if (plan === "Monthly") {
                      dueDate.setDate(startDate.getDate() + 30);
                    } else if (plan === "Quarterly") {
                      dueDate.setDate(startDate.getDate() + 90);
                    } else if (plan === "Yearly") {
                      dueDate.setDate(startDate.getDate() + 365);
                    }

                    const formData = {
                      name: e.target[0].value,
                      phone: e.target[1].value,
                      email: e.target[2].value,
                      plan,
                      startDate,
                      dueDate,
                      status: e.target[5].value,
                      amount: editingMember.amount || 1000,
                      payment: editingMember.payment || "Pending",
                      method: editingMember.method || "Cash",
                    };

                    const res = await fetch(
                      `http://localhost:5000/api/members/${editingMember._id}`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                      }
                    );

                    if (res.ok) {
                      alert("✅ Member updated successfully");
                      setShowEditModal(false);
                      setEditingMember(null);
                      await fetchMembers(); // Refresh the list
                    } else {
                      const err = await res.json().catch(() => ({ error: "Unknown error" }));
                      alert("❌ Error: " + (err.error || "Failed to update member"));
                    }
                  } catch (err) {
                    console.error("Update Member failed:", err);
                    alert("❌ Failed to update member. Please check your connection and try again.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  defaultValue={editingMember.name}
                  required
                />
                <label>Phone *</label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  defaultValue={editingMember.phone}
                  required
                />
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  defaultValue={editingMember.email}
                />
                <label>Membership Plan *</label>
                <select required defaultValue={editingMember.plan}>
                  <option value="">Select a plan</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                <label>Start Date *</label>
                <input
                  type="date"
                  defaultValue={
                    editingMember.startDate
                      ? new Date(editingMember.startDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  required
                />
                <label>Status *</label>
                <select required defaultValue={editingMember.status}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button type="submit" className="btn-submit">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal delete-confirm-modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingMemberId(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="confirm-message">
                Are you sure you want to delete this member? This action cannot be undone.
              </p>
              <div className="confirm-actions">
                <button
                  className="btn-cancel-action"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingMemberId(null);
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm-delete"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Payments Component with WhatsApp ---------- */
function PaymentsEmbedded({ members, loading, fetchMembers }) {
  const [localMembers, setLocalMembers] = React.useState(members);

  React.useEffect(() => {
    setLocalMembers(members);
  }, [members]);

  // ✅ Toggle payment status manually (Pending → Paid → Overdue → Pending)
  const togglePaymentStatus = async (id, currentStatus) => {
    const states = ["Pending", "Paid", "Overdue"];
    const idx = states.indexOf(currentStatus);
    const nextStatus = idx === -1 ? "Pending" : states[(idx + 1) % states.length];

    try {
      const res = await fetch(`http://localhost:5000/api/members/${id}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment: nextStatus }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update payment");
      }

      const updated = await res.json();

      // ✅ Update local state
      setLocalMembers((prev) =>
        prev.map((m) => (m._id === id ? updated : m))
      );

      // ✅ Refresh from server
      fetchMembers();
    } catch (err) {
      console.error("Failed to update payment:", err);
      alert("❌ Failed to update payment status");
    }
  };

  // ✅ Delete member
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await fetch(`http://localhost:5000/api/members/${id}`, {
        method: "DELETE",
      });
      setLocalMembers((prev) => prev.filter((m) => m._id !== id));
      fetchMembers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Send WhatsApp Reminder
  const sendReminder = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/members/${id}/remind`,
        { method: "POST" }
      );
      const data = await res.json();
      alert(data.message || "Reminder sent!");
    } catch (err) {
      console.error("Reminder error:", err);
      alert("Failed to send reminder");
    }
  };

  return (
    <div className="embedded-panel">
      <div className="embedded-panel-header">
        <h2>Payments</h2>
        <p>Track and manage member payments</p>
      </div>
      <div className="embedded-table-wrap">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="members-table-embedded payments-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Method</th>
                <th>Actions</th>
                <th>WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {localMembers.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", color: "#777" }}>
                    No payments found
                  </td>
                </tr>
              )}
              {localMembers.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>₹{m.amount || "0"}</td>
                  <td>
                    {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    {m.paymentDate
                      ? new Date(m.paymentDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className={`status-btn ${m.payment?.toLowerCase()}`}
                      onClick={() => togglePaymentStatus(m._id, m.payment)}
                    >
                      {m.payment || "Pending"}
                    </button>
                  </td>
                  <td>{m.method || "-"}</td>
                  <td>
                    <button
                      className="btn-small danger"
                      onClick={() => handleDelete(m._id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    {m.payment !== "Paid" && (
                      <button
                        className="btn-small warning"
                        onClick={() => sendReminder(m._id)}
                      >
                        Send Reminder 📲
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

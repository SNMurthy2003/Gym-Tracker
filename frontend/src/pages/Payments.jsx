import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

/* ---------- Payments Component ---------- */
function PaymentsEmbedded({ members, loading, fetchMembers }) {
  const [localMembers, setLocalMembers] = React.useState(members);

  React.useEffect(() => {
    setLocalMembers(members);
  }, [members]);

  // ✅ Toggle payment status
  const togglePaymentStatus = async (id, currentStatus) => {
    let nextStatus =
      currentStatus === "Paid"
        ? "Pending"
        : currentStatus === "Pending"
        ? "Paid"
        : "Pending";

    try {
      await axios.put(`http://localhost:5000/api/members/${id}`, {
        payment: nextStatus,
      });
      fetchMembers();
    } catch (err) {
      console.error("Toggle payment error:", err);
    }
  };

  // ✅ Send WhatsApp Reminder
  const sendReminder = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/members/${id}/remind`
      );
      alert(res.data.message || "Reminder sent!");
    } catch (err) {
      console.error("Reminder error:", err);
      alert("Failed to send reminder");
    }
  };

  return (
    <div className="payments-table">
      <h3 className="mb-3">💳 Payments</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Member</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Method</th>
              <th>Actions</th>
              <th>WhatsApp</th> {/* ✅ new column */}
            </tr>
          </thead>
          <tbody>
            {localMembers.map((m) => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>₹{m.amount}</td>
                <td>{m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "-"}</td>
                <td>
                  {m.paymentDate
                    ? new Date(m.paymentDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <span
                    className={`badge ${
                      m.payment === "Paid"
                        ? "bg-success"
                        : m.payment === "Overdue"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {m.payment}
                  </span>
                </td>
                <td>{m.method}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => togglePaymentStatus(m._id, m.payment)}
                  >
                    Toggle Status
                  </button>
                </td>
                <td>
                  {/* ✅ Show button only if not Paid */}
                  {m.payment !== "Paid" && (
                    <button
                      className="btn btn-sm btn-warning"
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
  );
}

/* ---------- Payments Page ---------- */
function Payments() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/members");
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>
        Payments Page
      </h2>

      {/* ✅ Integrated Payments Table */}
      <div style={{ padding: "20px" }}>
        <PaymentsEmbedded
          members={members}
          loading={loading}
          fetchMembers={fetchMembers}
        />
      </div>
    </div>
  );
}

export default Payments;

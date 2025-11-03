import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", status: "Active", payment: "Paid" });
  const [editing, setEditing] = useState(null);

  // ✅ Fetch all members
  const fetchMembers = () => {
    fetch("http://localhost:5000/api/members")
      .then((res) => res.json())
      .then(setMembers)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update Member
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editing) {
      // Update
      fetch(`http://localhost:5000/api/members/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(() => {
          fetchMembers();
          setForm({ name: "", status: "Active", payment: "Paid" });
          setEditing(null);
        })
        .catch((err) => console.error(err));
    } else {
      // Add
      fetch("http://localhost:5000/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(() => {
          fetchMembers();
          setForm({ name: "", status: "Active", payment: "Paid" });
        })
        .catch((err) => console.error(err));
    }
  };

  // ✅ Edit Member
  const handleEdit = (m) => {
    setForm({ name: m.name, status: m.status, payment: m.payment });
    setEditing(m._id);
  };

  // ✅ Delete Member
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/members/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchMembers())
      .catch((err) => console.error(err));
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Manage Members</h1>

      {/* Member Form */}
      <form className="member-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter member name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select name="payment" value={form.payment} onChange={handleChange}>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
        <button type="submit">{editing ? "Update" : "Add"} Member</button>
      </form>

      {/* Members Table */}
      <table className="members-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
                No members found
              </td>
            </tr>
          ) : (
            members.map((m) => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.status}</td>
                <td>{m.payment}</td>
                <td>
                  <button onClick={() => handleEdit(m)}>Edit</button>
                  <button onClick={() => handleDelete(m._id)} className="danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

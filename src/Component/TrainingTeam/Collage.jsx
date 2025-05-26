import React, { useEffect, useState } from "react";

export default function CollegeManagement() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollege, setNewCollege] = useState({ name: "", location: "" });

  const fetchColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://crm-backend-production-ad67.up.railway.app1/getcolleges");
      if (!res.ok) throw new Error("Failed to fetch colleges");
      const data = await res.json();
      setColleges(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleEditStart = (college) => {
    setEditingId(college.id);
    setFormName(college.name);
    setFormLocation(college.location);
    setError(null);
  };

  const handleUpdate = async () => {
    if (!formName.trim() || !formLocation.trim()) {
      setError("Please fill in both name and location");
      return;
    }
    try {
      const res = await fetch(`https://crm-backend-production-ad67.up.railway.app1/updatecollege/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, location: formLocation }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update college");
        return;
      }

      setEditingId(null);
      setFormName("");
      setFormLocation("");
      setError(null);
      fetchColleges();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormName("");
    setFormLocation("");
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this college?")) return;
    try {
      const res = await fetch(`https://crm-backend-production-ad67.up.railway.app1/deleteCollege/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete college");
      setError(null);
      fetchColleges();
    } catch (err) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setError(null);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewCollege({ name: "", location: "" });
    setError(null);
  };

  const handleNewCollegeChange = (e) => {
    setNewCollege({ ...newCollege, [e.target.name]: e.target.value });
  };

  const handleAddCollege = async () => {
    if (!newCollege.name.trim() || !newCollege.location.trim()) {
      setError("Please fill in both fields");
      return;
    }

    try {
      const res = await fetch("https://crm-backend-production-ad67.up.railway.app1/addCollege", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCollege),
      });

      const contentType = res.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        setError(data?.error || "Failed to add college");
        return;
      }

      if (!data || Object.keys(data).length === 0) {
        setError("College already exists with same name and location.");
        return;
      }

      closeAddModal();
      setError(null);
      fetchColleges();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto mt-10 font-sans relative">
      <h2 className="text-2xl font-semibold text-center text-blue-800 mb-5">College Management</h2>

      <button
        className="bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg mb-5 hover:bg-blue-900"
        onClick={openAddModal}
      >
        Add New College
      </button>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading colleges...</div>
      ) : colleges.length === 0 ? (
        <div>No colleges found.</div>
      ) : (
        colleges.map((college) =>
          editingId === college.id ? (
            <div key={college.id} className="flex flex-col md:flex-row gap-2 mb-4 items-center border-b pb-2">
              <input
                className="w-full md:w-1/3 p-2 border rounded-md"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="College Name"
              />
              <input
                className="w-full md:w-1/3 p-2 border rounded-md"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="Location"
              />
              <div className="flex gap-2">
                <button className="bg-blue-800 text-white px-3 py-1 rounded-md text-sm" onClick={handleUpdate}>
                  Save
                </button>
                <button className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div key={college.id} className="flex justify-between items-center border-b py-3">
              <div>
                <strong>{college.name}</strong> — {college.location}
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-800 text-white px-3 py-1 rounded-md text-sm" onClick={() => handleEditStart(college)}>
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  onClick={() => handleDelete(college.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )
      )}

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeAddModal}>
          <div
            className="bg-white p-6 rounded-lg w-[90%] sm:w-[80%] md:w-[60%] lg:w-[30%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Add New College</h3>

            {error && (
              <div className="bg-red-600 text-white p-2 rounded-md mb-3 text-center font-semibold">
                {error}
              </div>
            )}

            <input
              className="w-full p-2 border rounded-md mb-3"
              type="text"
              name="name"
              value={newCollege.name}
              onChange={handleNewCollegeChange}
              placeholder="College Name"
            />
            <input
              className="w-full p-2 border rounded-md mb-4"
              type="text"
              name="location"
              value={newCollege.location}
              onChange={handleNewCollegeChange}
              placeholder="Location"
            />

            <div className="flex justify-end gap-3">
              <button className="bg-blue-800 text-white px-4 py-2 rounded-md" onClick={handleAddCollege}>
                Add College
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={closeAddModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

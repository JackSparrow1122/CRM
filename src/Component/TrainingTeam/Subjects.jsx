import React, { useEffect, useState } from "react";

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formName, setFormName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ subjectName: "" });

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://crm-backend-production-ad67.up.railway.app/getsubject");
      if (!res.ok) throw new Error("Failed to fetch subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleEditStart = (subject) => {
    setEditingId(subject.id);
    setFormName(subject.subjectName);
    setError(null);
  };

  const handleUpdate = async () => {
    if (!formName.trim()) {
      setError("Please fill in the subject name");
      return;
    }
    try {
      const res = await fetch(`http://crm-backend-production-ad67.up.railway.app/updateSubject/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName: formName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update subject");
        return;
      }

      setEditingId(null);
      setFormName("");
      setError(null);
      fetchSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormName("");
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      const res = await fetch(`http://crm-backend-production-ad67.up.railway.app/deletesubject/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete subject");
      fetchSubjects();
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
    setNewSubject({ subjectName: "" });
    setError(null);
  };

  const handleNewSubjectChange = (e) => {
    setNewSubject({ ...newSubject, [e.target.name]: e.target.value });
  };

  const handleAddSubject = async () => {
    if (!newSubject.subjectName.trim()) {
      setError("Please fill in the subject name");
      return;
    }

    try {
      const res = await fetch("http://crm-backend-production-ad67.up.railway.app/addSubject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubject),
      });

      const contentType = res.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        setError(data?.error || "Failed to add subject");
        return;
      }

      if (!data || Object.keys(data).length === 0) {
        setError("Subject already exists with the same name.");
        return;
      }

      closeAddModal();
      fetchSubjects();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto mt-10 font-sans relative">
      <h2 className="text-2xl font-semibold text-center text-blue-800 mb-5">
        Subject Management
      </h2>

      <button
        className="bg-blue-800 text-white font-semibold px-4 py-2 rounded-md mb-5 hover:bg-blue-900"
        onClick={openAddModal}
      >
        Add New Subject
      </button>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div>No subjects found.</div>
      ) : (
        subjects.map((subject) =>
          editingId === subject.id ? (
            <div key={subject.id} className="flex flex-col md:flex-row gap-2 mb-4 items-center border-b pb-2">
              <input
                className="w-full md:w-2/3 p-2 border rounded-md"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Subject Name"
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
            <div key={subject.id} className="flex justify-between items-center border-b py-3">
              <div>
                <strong>{subject.subjectName}</strong>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-800 text-white px-3 py-1 rounded-md text-sm"
                  onClick={() => handleEditStart(subject)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  onClick={() => handleDelete(subject.id)}
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeAddModal}
        >
          <div
            className="bg-white p-6 rounded-lg w-[90%] sm:w-[80%] md:w-[60%] lg:w-[30%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Add New Subject</h3>

            {error && (
              <div className="bg-red-600 text-white p-2 rounded-md mb-3 text-center font-semibold">
                {error}
              </div>
            )}

            <input
              className="w-full p-2 border rounded-md mb-4"
              type="text"
              name="subjectName"
              value={newSubject.subjectName}
              onChange={handleNewSubjectChange}
              placeholder="Subject Name"
            />

            <div className="flex justify-end gap-3">
              <button
                className="bg-blue-800 text-white px-4 py-2 rounded-md"
                onClick={handleAddSubject}
              >
                Add Subject
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={closeAddModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

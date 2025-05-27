import React, { useEffect, useState } from "react";

export default function TrainerManagement() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formName, setFormName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "", // ✅ Password field added
  });

  const fetchTrainers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://crm-backend-production-ad67.up.railway.app/gettrainers");
      if (!res.ok) throw new Error("Failed to fetch trainers");
      const data = await res.json();
      setTrainers(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleEditStart = (trainer) => {
    setEditingId(trainer.id);
    setFormName(trainer.name);
  };

  const handleUpdate = async () => {
    if (!formName.trim()) return alert("Please enter trainer name");
    try {
      const res = await fetch(`https://crm-backend-production-ad67.up.railway.app/updatetrainer/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName }),
      });
      if (!res.ok) throw new Error("Failed to update trainer");
      setEditingId(null);
      setFormName("");
      fetchTrainers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormName("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
    try {
      const res = await fetch(`https://crm-backend-production-ad67.up.railway.app/deleteTrainer/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete trainer");
      fetchTrainers();
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewTrainer({
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "", // ✅ Reset password
    });
  };

  const handleNewTrainerChange = (e) => {
    setNewTrainer({ ...newTrainer, [e.target.name]: e.target.value });
  };

  const handleAddTrainer = async () => {
    const { name, email, phoneNumber, address, password } = newTrainer;
    if (!name.trim() || !email.trim() || !phoneNumber.trim() || !address.trim() || !password.trim()) {
      return alert("Please fill in all fields");
    }

    try {
      const res = await fetch("https://crm-backend-production-ad67.up.railway.app/addtrainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTrainer),
      });
      if (!res.ok) throw new Error("Failed to add trainer");
      closeAddModal();
      fetchTrainers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto mt-10 font-sans relative">
      <h2 className="text-2xl font-semibold text-blue-800 mb-5">Trainer Management</h2>

      <button
        className="bg-blue-800 text-white font-semibold px-4 py-2 rounded-md mb-5 hover:bg-blue-900"
        onClick={openAddModal}
      >
        Add Trainer
      </button>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading trainers...</p>
      ) : trainers.length === 0 ? (
        <p>No trainers found.</p>
      ) : (
        trainers.map((trainer) => (
          <div key={trainer.id} className="flex justify-between items-center border-b py-3">
            {editingId === trainer.id ? (
              <div className="flex flex-col md:flex-row gap-3 w-full">
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="flex-grow border p-2 rounded-md"
                  placeholder="Trainer Name"
                />
                <div className="flex gap-2">
                  <button
                    className="bg-blue-800 text-white px-3 py-1 rounded-md text-sm"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="font-medium">{trainer.name}</span>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-800 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => handleEditStart(trainer)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => handleDelete(trainer.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
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
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Add New Trainer
            </h3>

            <input
              className="w-full p-2 border rounded-md mb-3"
              type="text"
              name="name"
              placeholder="Name"
              value={newTrainer.name}
              onChange={handleNewTrainerChange}
            />
            <input
              className="w-full p-2 border rounded-md mb-3"
              type="email"
              name="email"
              placeholder="Email"
              value={newTrainer.email}
              onChange={handleNewTrainerChange}
            />
            <input
              className="w-full p-2 border rounded-md mb-3"
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={newTrainer.phoneNumber}
              onChange={handleNewTrainerChange}
            />
            <input
              className="w-full p-2 border rounded-md mb-3"
              type="text"
              name="address"
              placeholder="Address"
              value={newTrainer.address}
              onChange={handleNewTrainerChange}
            />
            <input
              className="w-full p-2 border rounded-md mb-4"
              type="password"
              name="password"
              placeholder="Password"
              value={newTrainer.password}
              onChange={handleNewTrainerChange}
            />

            <div className="flex justify-end gap-3">
              <button
                className="bg-blue-800 text-white px-4 py-2 rounded-md"
                onClick={handleAddTrainer}
              >
                Submit
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

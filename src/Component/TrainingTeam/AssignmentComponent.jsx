import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newAssignment, setNewAssignment] = useState({
    trainerId: "",
    subjectId: "",
    collegeId: "",
    assignedDate: "",
    endDate: "",
    fees: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [assiRes, trainersRes, subjectsRes, collegesRes] = await Promise.all([
          axios.get("http://crm-backend-production-ad67.up.railway.app/getAssi"),
          axios.get("http://crm-backend-production-ad67.up.railway.app/gettrainers"),
          axios.get("http://crm-backend-production-ad67.up.railway.app/getsubject"),
          axios.get("http://crm-backend-production-ad67.up.railway.app/getcolleges"),
        ]);

        setAssignments(assiRes.data);
        setTrainers(trainersRes.data.sort((a, b) => a.name.localeCompare(b.name)));
        setSubjects(subjectsRes.data.sort((a, b) => a.subjectName.localeCompare(b.subjectName)));
        setColleges(collegesRes.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleNewAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewAssignmentSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      trainer: { id: parseInt(newAssignment.trainerId) },
      subject: { id: parseInt(newAssignment.subjectId) },
      college: { id: parseInt(newAssignment.collegeId) },
      assignedDate: newAssignment.assignedDate,
      endDate: newAssignment.endDate,
      fees: newAssignment.fees,
    };

    try {
      await axios.post("http://crm-backend-production-ad67.up.railway.app/addAssi", payload);
      setNewAssignment({
        trainerId: "",
        subjectId: "",
        collegeId: "",
        assignedDate: "",
        endDate: "",
        fees: "",
      });
      const res = await axios.get("http://crm-backend-production-ad67.up.railway.app/getAssi");
      setAssignments(res.data);
    } catch (error) {
      console.error("Error adding assignment:", error);
      alert("Failed to add assignment. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this assignment?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://crm-backend-production-ad67.up.railway.app/deleteAssi/${id}`);
      const res = await axios.get("http://crm-backend-production-ad67.up.railway.app/getAssi");
      setAssignments(res.data);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Failed to delete assignment. Please try again.");
    }
  };

  const generatePDF = (assignment) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Assignment Details", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);

    const rows = [
      ["Trainer", assignment.trainer?.name || "-"],
      ["Subject", assignment.subject?.subjectName || "-"],
      ["College", assignment.college?.name || "-"],
      ["Assigned Date", assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString() : "-"],
      ["End Date", assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : "-"],
      ["Fees", assignment.fees || "-"],
    ];

    let startY = 30;
    rows.forEach(([key, value], i) => {
      doc.text(`${key}:`, 14, startY + i * 10);
      doc.text(`${value}`, 60, startY + i * 10);
    });

    doc.save(`Assignment_${assignment.id}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-5">Assignment Management</h2>

      <form onSubmit={handleNewAssignmentSubmit} className="bg-gray-100 p-6 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="trainerId"
          value={newAssignment.trainerId}
          onChange={handleNewAssignmentChange}
          className="p-2 border rounded-md"
          required
        >
          <option value="">Select Trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>{trainer.name}</option>
          ))}
        </select>

        <select
          name="subjectId"
          value={newAssignment.subjectId}
          onChange={handleNewAssignmentChange}
          className="p-2 border rounded-md"
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>{subject.subjectName}</option>
          ))}
        </select>

        <select
          name="collegeId"
          value={newAssignment.collegeId}
          onChange={handleNewAssignmentChange}
          className="p-2 border rounded-md"
          required
        >
          <option value="">Select College</option>
          {colleges.map((college) => (
            <option key={college.id} value={college.id}>{college.name}</option>
          ))}
        </select>

        <input
          type="date"
          name="assignedDate"
          value={newAssignment.assignedDate}
          onChange={handleNewAssignmentChange}
          className="p-2 border rounded-md"
          required
        />

        <input
          type="date"
          name="endDate"
          value={newAssignment.endDate}
          onChange={handleNewAssignmentChange}
          className="p-2 border rounded-md"
          required
        />

        <input
          type="number"
          name="fees"
          min="0"
          value={newAssignment.fees}
          onChange={handleNewAssignmentChange}
          placeholder="Enter Fees (₹)"
          className="p-2 border rounded-md"
          required
        />

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-800 text-white px-4 py-2 rounded-md w-full md:w-auto"
          >
            Add Assignment
          </button>
        </div>
      </form>

      <h3 className="text-lg font-semibold mb-3">All Assignments</h3>

      {loading ? (
        <p>Loading assignments...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Trainer</th>
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">College</th>
                <th className="px-4 py-2 border">Assigned Date</th>
                <th className="px-4 py-2 border">End Date</th>
                <th className="px-4 py-2 border">Fees (₹)</th>
                <th className="px-4 py-2 border">PDF</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">No assignments found.</td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{assignment.trainer?.name || "-"}</td>
                    <td className="border px-4 py-2">{assignment.subject?.subjectName || "-"}</td>
                    <td className="border px-4 py-2">{assignment.college?.name || "-"}</td>
                    <td className="border px-4 py-2">
                      {assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="border px-4 py-2">{assignment.fees || "-"}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => generatePDF(assignment)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        PDF
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Assignment;

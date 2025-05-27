import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Login from "../../../pages/Login"; // Make sure Login component path is correct

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const tabs = ["Dashboard", "Assignment"];

function CountCard({ title, count }) {
  return (
    <div className="bg-white p-3 rounded-xl shadow-md w-full max-w-[160px] sm:max-w-[180px] md:max-w-[160px] text-center">
      <div className="text-4xl font-bold text-[#134C93]">{count}</div>
      <div className="text-lg font-semibold mt-2 break-words whitespace-normal">{title}</div>
    </div>
  );
}

function Dashboard({ count }) {
  const data = {
    labels: ["Assignments"],
    datasets: [
      {
        label: "Count",
        data: [count ?? 0],
        backgroundColor: "#134C93",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "CRM Dashboard Overview",
        color: "#134C93",
        font: { size: 22, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div>
      <h2 className="text-[#134C93] text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="flex flex-wrap gap-5 mb-8 justify-center md:justify-start">
        <CountCard title="Assignments" count={count ?? "..."} />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-md max-w-3xl mx-auto">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

function AssignmentComponent({ email }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAssignments() {
      setLoading(true);
      setError(null);
      try {
        const encodedEmail = encodeURIComponent(email);
        const res = await fetch(`https://crm-backend-production-ad67.up.railway.app/auth/${encodedEmail}`);
        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        setAssignments(data);
      } catch (err) {
        setError("Failed to load assignments.");
      }
      setLoading(false);
    }

    if (email) {
      fetchAssignments();
    } else {
      setError("Trainer email not found.");
      setLoading(false);
    }
  }, [email]);

  if (loading)
    return <p className="text-center text-[#134C93] font-semibold mt-10">Loading assignments...</p>;

  if (error)
    return (
      <p className="text-center text-red-600 font-semibold mt-10">
        {error}
      </p>
    );

  if (assignments.length === 0)
    return <p className="text-center text-gray-700 mt-10">No assignments found.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <h2 className="text-3xl font-bold text-[#134C93] mb-6 border-b-2 border-[#134C93] pb-2">
        Your Assignments
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-[#134C93] text-white">
            <tr>
              <th className="py-3 px-6 text-left">Trainer</th>
              <th className="py-3 px-6 text-left">Subject</th>
              <th className="py-3 px-6 text-left">College</th>
              <th className="py-3 px-6 text-left">Assigned Date</th>
              <th className="py-3 px-6 text-left">End Date</th>
              <th className="py-3 px-6 text-left">Fees</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assgn, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-3 px-6 text-gray-800">{assgn.trainer?.name || "N/A"}</td>
                <td className="py-3 px-6 font-semibold text-[#f37021]">
                  {assgn.subject?.subjectName || assgn.subject?.name || "N/A"}
                </td>
                <td className="py-3 px-6 text-gray-800">{assgn.college?.name || "N/A"}</td>
                <td className="py-3 px-6 text-gray-800">
                  {assgn.assignedDate
                    ? new Date(assgn.assignedDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="py-3 px-6 text-gray-800">
                  {assgn.endDate
                    ? new Date(assgn.endDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="py-3 px-6 text-gray-800">
                  {assgn.fees ? `Rs.${assgn.fees}` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CRM() {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);

  const email = localStorage.getItem("email");

  // Fetch count when dashboard selected
  async function fetchCount() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://crm-backend-production-ad67.up.railway.app/auth/${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const data = await res.json();
      setCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      setError("Failed to fetch counts. Please try again later.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (loggedIn && selectedTab === "Dashboard") {
      fetchCount();
    }
  }, [selectedTab, loggedIn, email]);

  if (!loggedIn) {
    return <Login />;
  }

  function renderTabContent() {
    switch (selectedTab) {
      case "Dashboard":
        return <Dashboard count={count} />;
      case "Assignment":
        return <AssignmentComponent email={email} />;
      default:
        return <Dashboard count={count} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="bg-black text-white w-56 h-screen p-5 flex flex-col font-sans">
        <div className="flex items-center gap-3 mb-10 justify-center font-bold text-2xl text-[#134C93]">
          {/* Logo if you want to add */}
          <span>CRM</span>
        </div>

        <div className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`p-3 rounded-md cursor-pointer select-none transition-colors ${
                selectedTab === tab ? "bg-[#134C93]" : "bg-transparent"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div
          className="mt-auto pt-3 border-t border-white cursor-pointer text-[#f37021] font-semibold text-lg select-none"
          onClick={() => setLoggedIn(false)}
        >
          Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#f7f9fc] overflow-y-auto font-sans">
        {loading ? (
          <p className="text-center text-[#134C93] font-semibold">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
}

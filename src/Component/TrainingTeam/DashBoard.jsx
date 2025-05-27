import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
// import logo from "../../assets/large.png";
import Login from "../../pages/Login";
import Trainer from "../../Component/TrainingTeam/Trainer";
import Subject from "../../Component/TrainingTeam/Subjects";
import College from "../../Component/TrainingTeam/Collage";
import AssignmentComponent from "../../Component/TrainingTeam/AssignmentComponent";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const tabs = ["Dashboard", "Trainer", "Subjects", "College", "Assignment"];

function CountCard({ title, count }) {
  return (
    <div className="bg-white p-3 rounded-xl shadow-md w-full max-w-[160px] sm:max-w-[180px] md:max-w-[160px] text-center">
      <div className="text-4xl font-bold text-[#134C93]">{count}</div>
      <div className="text-lg font-semibold mt-2 break-words whitespace-normal">
        {title}
      </div>
    </div>
  );
}

function Dashboard({ counts }) {
  const data = {
    labels: ["Trainers", "Subjects", "Colleges", "Assignments"],
    datasets: [
      {
        label: "Count",
        data: [
          counts.trainers ?? 0,
          counts.subjects ?? 0,
          counts.colleges ?? 0,
          counts.assignments ?? 0,
        ],
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
        <CountCard title="Assignments" count={counts.assignments ?? "..."} />
        <CountCard title="Trainers" count={counts.trainers ?? "..."} />
        <CountCard title="Subjects" count={counts.subjects ?? "..."} />
        <CountCard title="Colleges" count={counts.colleges ?? "..."} />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-md max-w-3xl mx-auto">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

export default function CRM() {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);

  async function fetchCounts() {
    setLoading(true);
    setError(null);
    try {
      const [assignmentsRes, trainersRes, subjectsRes, collegesRes] =
        await Promise.all([
          fetch("https://crm-backend-production-ad67.up.railway.app/getAssi"),
          fetch("https://crm-backend-production-ad67.up.railway.app/gettrainers"),
          fetch("https://crm-backend-production-ad67.up.railway.app/getsubject"),
          fetch("https://crm-backend-production-ad67.up.railway.app/getcolleges"),
        ]);

      if (
        !assignmentsRes.ok ||
        !trainersRes.ok ||
        !subjectsRes.ok ||
        !collegesRes.ok
      ) {
        throw new Error("API response not ok");
      }

      const assignmentsList = await assignmentsRes.json();
      const trainersList = await trainersRes.json();
      const subjectsList = await subjectsRes.json();
      const collegesList = await collegesRes.json();

      setCounts({
        assignments: Array.isArray(assignmentsList) ? assignmentsList.length : 0,
        trainers: Array.isArray(trainersList) ? trainersList.length : 0,
        subjects: Array.isArray(subjectsList) ? subjectsList.length : 0,
        colleges: Array.isArray(collegesList) ? collegesList.length : 0,
      });
    } catch (err) {
      setError("Failed to fetch counts. Please try again later.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (loggedIn && selectedTab === "Dashboard") {
      fetchCounts();
    }
  }, [selectedTab, loggedIn]);

  if (!loggedIn) {
    return <Login />;
  }

  function renderTabContent() {
    switch (selectedTab) {
      case "Dashboard":
        return <Dashboard counts={counts} />;
      case "Assignment":
        return <AssignmentComponent />;
      case "Trainer":
        return <Trainer />;
      case "Subjects":
        return <Subject />;
      case "College":
        return <College />;
      default:
        return <Dashboard counts={counts} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="bg-black text-white w-56 h-screen p-5 flex flex-col font-sans">
        <div className="flex items-center gap-3 mb-10 justify-center font-bold text-2xl text-[#134C93]">
          {/* <img src={logo} alt="Logo" className="w-10 h-10" /> */}
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

        {/* Logout */}
        <div
          className="mt-auto pt-3 border-t border-white cursor-pointer text-[#f37021] font-semibold text-lg select-none"
          onClick={() => {
            setLoggedIn(false);
            window.location.href = "https://crm-zeta-wheat.vercel.app/"; // <== 🟠 CHANGE THIS LINK
          }}
        >
          Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#f7f9fc] overflow-y-auto font-sans">
        {loading ? (
          <p>Loading counts...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
}

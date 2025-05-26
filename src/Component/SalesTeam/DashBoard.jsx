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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const sidebarStyle = {
  backgroundColor: "#000000",
  color: "white",
  height: "100vh",
  width: 220,
  padding: "20px 10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  boxSizing: "border-box",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const logoStyle = {
  fontWeight: "bold",
  fontSize: 28,
  marginBottom: 40,
  textAlign: "center",
  color: "#f37021",
};

const tabStyle = (active) => ({
  padding: "12px 15px",
  cursor: "pointer",
  backgroundColor: active ? "#f37021" : "transparent",
  marginBottom: 8,
  borderRadius: 6,
  transition: "background-color 0.3s",
  userSelect: "none",
});

const contentStyle = {
  flex: 1,
  padding: 24,
  backgroundColor: "#FCFAEE",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  overflowY: "auto",
};

const tabs = ["Dashboard", "Orders", "Customers", "Products", "Reports"];

function CountCard({ title, count }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        width: 140,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 36, fontWeight: "700", color: "#f37021" }}>{count}</div>
      <div style={{ fontSize: 18, fontWeight: "600", marginTop: 8 }}>{title}</div>
    </div>
  );
}

function Dashboard({ counts, salesData }) {
  const data = {
    labels: salesData.map((item) => item.month),
    datasets: [
      {
        label: "Revenue",
        data: salesData.map((item) => item.revenue),
        backgroundColor: "#f37021",
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
        text: "Monthly Revenue Overview",
        color: "#f37021",
        font: { size: 22, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1000 },
      },
    },
  };

  return (
    <div>
      <h2 style={{ color: "#f37021" }}>Sales Dashboard Overview</h2>
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <CountCard title="Total Sales" count={counts.sales ?? "..."} />
        <CountCard title="Orders" count={counts.orders ?? "..."} />
        <CountCard title="Customers" count={counts.customers ?? "..."} />
        <CountCard title="Products" count={counts.products ?? "..."} />
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          maxWidth: 700,
          margin: "auto",
        }}
      >
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

export default function SalesDashboard() {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [counts, setCounts] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchCountsAndSales() {
    setLoading(true);
    setError(null);
    try {
      // Example API endpoints — replace with your actual ones
      const [salesRes, ordersRes, customersRes, productsRes, monthlySalesRes] =
        await Promise.all([
          fetch("http://localhost:8081/api/sales/count"),
          fetch("http://localhost:8081/api/orders/count"),
          fetch("http://localhost:8081/api/customers/count"),
          fetch("http://localhost:8081/api/products/count"),
          fetch("http://localhost:8081/api/sales/monthly"),
        ]);

      if (
        !salesRes.ok ||
        !ordersRes.ok ||
        !customersRes.ok ||
        !productsRes.ok ||
        !monthlySalesRes.ok
      ) {
        throw new Error("API response not ok");
      }

      const salesCount = await salesRes.json();
      const ordersCount = await ordersRes.json();
      const customersCount = await customersRes.json();
      const productsCount = await productsRes.json();
      const monthlySales = await monthlySalesRes.json();

      setCounts({
        sales: salesCount.total ?? 0,
        orders: ordersCount.total ?? 0,
        customers: customersCount.total ?? 0,
        products: productsCount.total ?? 0,
      });

      setSalesData(monthlySales); // expects [{month: "Jan", revenue: 1000}, ...]
    } catch (err) {
      setError("Failed to fetch sales data. Please try again later.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (selectedTab === "Dashboard") {
      fetchCountsAndSales();
    }
  }, [selectedTab]);

  function renderTabContent() {
    switch (selectedTab) {
      case "Dashboard":
        return <Dashboard counts={counts} salesData={salesData} />;
      // You can add other tabs content here later
      default:
        return <Dashboard counts={counts} salesData={salesData} />;
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ ...logoStyle, textAlign: "center" }}>Sales</div>

        {tabs.map((tab) => (
          <div
            key={tab}
            style={tabStyle(selectedTab === tab)}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={contentStyle}>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
}

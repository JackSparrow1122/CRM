import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SalesDashboard from "./pages/Sales";
import TrainingDashboard from "./pages/Training";
import PlacementDashboard from "./pages/Placement";
import TrainerDetail from "./Component/TrainingTeam/Trainer/TrainerDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sales-dashboard" element={<SalesDashboard />} />
        <Route path="/training-dashboard" element={<TrainingDashboard />} />
        <Route path="/placement-dashboard" element={<PlacementDashboard />} />
        <Route path="/trainer-dashboard" element={<TrainerDetail/>} />
      </Routes>
    </Router>
  );
}

export default App;

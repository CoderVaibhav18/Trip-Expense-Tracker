import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RepaymentForm from "./pages/RepaymentForm";
import RepaymentHistory from "./pages/RepaymentHistory";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/:tripId" element={<Dashboard />} />
        <Route path="/repay/:tripId" element={<RepaymentForm />} />
        <Route path="/repayments/:tripId" element={<RepaymentHistory />} />
      </Routes>
    </Router>
  );
}

export default App;

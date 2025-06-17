import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RepaymentForm from "./pages/RepaymentForm";
import RepaymentHistory from "./pages/RepaymentHistory";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "./pages/Error";
import UserProtectedWrapper from "./auth/UserProtectedWrapper";
import Logout from "./pages/Logout";
import Project from "./pages/Project";
import AddExpense from "./pages/AddExpense";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/logout"
          element={
            <UserProtectedWrapper>
              <Logout />
            </UserProtectedWrapper>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/trip" element={<Project />} />
        <Route path="/trip/:tripId/add-expense" element={<AddExpense />} />
        <Route path="/repay/:tripId" element={<RepaymentForm />} />
        <Route path="/repayments/:tripId" element={<RepaymentHistory />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;

import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-white shadow py-4 px-8 flex gap-6">
    <Link to="/" className="text-blue-600 font-bold">Home</Link>
    <Link to="/dashboard/1">Dashboard</Link>
    <Link to="/repay/1">Repay</Link>
    <Link to="/repayments/1">History</Link>
  </nav>
);

export default Navbar;

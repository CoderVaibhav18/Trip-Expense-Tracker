import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Logout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate('/login')
    }
  });

  return <div>logout</div>;
};

export default Logout;

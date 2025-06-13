import React, { useEffect } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";

const Logout = () => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/user/logout", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  }, [token, navigate]);

  return <div>logout</div>;
};

export default Logout;

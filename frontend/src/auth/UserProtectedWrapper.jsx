import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const UserProtectedWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      localStorage.removeItem("user");
    }
  });

  API.get("/user/profile", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (res.data.statusCode === 200) {
        setIsLoading(false);
      }
    })
    .catch((err) => {
      console.error(err);
      localStorage.removeItem("accessToken");
      navigate("/login");
    });

  if (isLoading) {
    return <div>Loading.....</div>;
  }

  return <div>{children}</div>;
};

export default UserProtectedWrapper;

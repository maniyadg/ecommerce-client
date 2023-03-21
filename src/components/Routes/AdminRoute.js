import React , { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [accessToken, setaccessToken] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get("/api/admin-auth");
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (accessToken.token) authCheck();
  }, [accessToken.token]);

  return ok ? <Outlet /> : <Spinner path="" />;
}
import React, { createContext, useContext, useEffect, useState } from "react";
import { api, callInitAPI } from "../api/client";

const AuthContext = createContext(null);
const USER_KEY = "user"; // you already use this
export const INIT_KEY = "initCache:v1";
export const CREDENTIALS_KEY = "credentials"; // dev only, do not use in prod

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "null" || raw === "undefined") return null;
      return JSON.parse(raw).data.profile;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on refresh
  //   useEffect(() => {
  //     const savedUser = localStorage.getItem("user");
  //     console.log("bilowga", savedUser);
  //     if (savedUser) {
  //       console.log("bilowga2", user);
  //       setUser(JSON.parse(savedUser));
  //     }
  //     console.log("bilowga3", user);
  //     setLoading(false);
  //   }, []);

  //  Login: call backend, store user locally (no token)
  const login = async ({ username, password }) => {
    clearAuthCaches();
    // Adjust endpoint + response to your API
    // Expected example response: { id, email, fullName, role, ... }
    const { data } = await api.post("/api/auth/login", { username, password });
    // console.log("boos"+data);
    if (data) {
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      // Save credentials temporarily (for dev only)
      localStorage.setItem(
        CREDENTIALS_KEY,
        JSON.stringify({ username, password })
      );

      setUser(data.data.profile);

      // call init API to load all needed data at once
      callInitAPI();
    } else console.log("no data");
  };

  // Logout: wipe local state
  const logout = () => {
    clearAuthCaches();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const clearAuthCaches = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(INIT_KEY);
  localStorage.removeItem(CREDENTIALS_KEY);
  console.log("Cleared auth caches");
};

export const clearInitData = () => {
  localStorage.removeItem(INIT_KEY);
  console.log("Cleared init data cache");
};

export const useAuth = () => useContext(AuthContext);

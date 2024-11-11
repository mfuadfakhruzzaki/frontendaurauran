/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthProvider.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const isAuthenticated = !!token;

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  }, [token]);

  // **Add Axios Interceptors**
  useEffect(() => {
    // Request Interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (request) => {
        console.log("Starting Request", {
          method: request.method,
          url: request.url,
          data: request.data,
          headers: request.headers,
        });
        return request;
      },
      (error) => {
        console.error("Request Error", error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        console.log("Response:", {
          status: response.status,
          data: response.data,
          headers: response.headers,
        });
        return response;
      },
      (error) => {
        console.error("Response Error", {
          status: error.response?.status,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );

    // Cleanup function to remove interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post("https://api.zacht.tech/auth/login", {
      email,
      password,
    });
    const token = response.data.data.token;
    setToken(token);
    localStorage.setItem("token", token);
  };

  const register = async (data: any) => {
    await axios.post("https://api.zacht.tech/auth/register", data);
  };

  const logout = async () => {
    try {
      await axios.post("https://api.zacht.tech/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setToken(null);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

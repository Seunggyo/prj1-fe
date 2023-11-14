import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LoginContext = createContext(null);

function LoginProvider({ children }) {
  const [login, setLogin] = useState("");

  function fetchLogin() {
    axios.get("/api/member/login").then((Response) => setLogin(Response.data));
  }

  function isAuthenticated() {
    return login !== "";
  }

  function isAdmin() {
    if (login.auth) {
      return login.auth.some((elem) => elem.name === "admin");
    }
    return false;
  }

  // function isManager() {
  //   return login.auth.some((e) => e.name === "manager");
  // }

  function hasAccess(userId) {
    return login.id === userId;
  }

  useEffect(() => {
    fetchLogin();
  }, []);
  console.log(login);

  return (
    <LoginContext.Provider
      value={{ login, fetchLogin, isAuthenticated, hasAccess, isAdmin }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;

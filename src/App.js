import React, { createContext, useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import { BoardWrite } from "./page/board/BoardWrite";
import { BoardList } from "./page/board/BoardList";
import { BoardView } from "./page/board/BoardView";
import { BoardEdit } from "./page/board/BoardEdit";
import { MemberSignup } from "./page/Member/MemberSignup";
import { MemberList } from "./page/Member/MemberList";
import { MemberLogin } from "./page/Member/MemberLogin";
import { MemberView } from "./page/Member/MemberView";
import { MemberEdit } from "./page/Member/MemberEdit";
import axios from "axios";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
      <Route path="board/:id" element={<BoardView />} />
      <Route path="edit/:id" element={<BoardEdit />}></Route>
      <Route path="signup" element={<MemberSignup />} />
      <Route path="member/list" element={<MemberList />} />
      <Route path="member" element={<MemberView />} />
      <Route path="member/edit" element={<MemberEdit />} />
      <Route path="login" element={<MemberLogin />} />
    </Route>,
  ),
);

export const LoginContext = createContext(null);

function App() {
  const [login, setLogin] = useState("");

  function fetchLogin() {
    axios.get("/api/member/login").then((Response) => setLogin(Response.data));
  }

  function isAuthenticated() {
    return login !== "";
  }

  function hasAccess(userId) {
    return login.id === userId;
  }

  useEffect(() => {
    fetchLogin();
  }, []);

  return (
    <LoginContext.Provider
      value={{ login, fetchLogin, isAuthenticated, hasAccess }}
    >
      <RouterProvider router={routes} />
    </LoginContext.Provider>
  );
}

export default App;

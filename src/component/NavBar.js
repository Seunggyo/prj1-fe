import { Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../App";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated } = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  function hadleLogout() {
    //Todo : 로그아웃 후 할일 추가
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "로그아웃 되었습니다.",
          status: "info",
        });
        navigate("/");
      })
      .finally(() => fetchLogin());
  }

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>home</Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>write</Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/signup")}>signup</Button>
      )}
      {isAuthenticated() && (
        <Button onClick={() => navigate("/member/list")}>member list</Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>login</Button>
      )}
      {isAuthenticated() && <Button onClick={hadleLogout}>log out</Button>}
    </Flex>
  );
}

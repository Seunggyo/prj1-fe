import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function NavBar() {
  const navigate = useNavigate();

  function hadleLogout() {
    axios.post("/api/member/logout").then(console.log("로그아웃"));
  }

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>home</Button>
      <Button onClick={() => navigate("/write")}>write</Button>
      <Button onClick={() => navigate("/signup")}>signup</Button>
      <Button onClick={() => navigate("/member/list")}>member list</Button>
      <Button onClick={() => navigate("/login")}>login</Button>
      <Button onClick={hadleLogout}>log out</Button>
    </Flex>
  );
}

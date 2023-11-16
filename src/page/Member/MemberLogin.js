import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { fetchLogin } = useContext(LoginContext);

  function handleLogin() {
    // TODO : 로그인 후 성공 , 실패, 완료 코드 추가
    axios
      .post("/api/member/login", { id, password })
      .then(() => {
        toast({
          status: "success",
          description: "로그인에 성공하셨습니다.",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "로그인에 실패하였습니다.",
          status: "error",
        });
      });
  }

  return (
    <Box>
      <h1>로그인</h1>
      <FormControl>
        <FormLabel>아이디</FormLabel>
        <Input value={id} onChange={(e) => setId(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>암호</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="twitter" onClick={handleLogin}>
        로그인
      </Button>
    </Box>
  );
}

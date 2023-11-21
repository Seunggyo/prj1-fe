import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faList,
  faPenToSquare,
  faRightFromBracket,
  faRightToBracket,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams();
  const location = useLocation();

  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }

  function hadleLogout() {
    //Todo : 로그아웃 후 할일 추가
    axios.post("/api/member/logout").then(() => {
      toast({
        description: "로그아웃 되었습니다.",
        status: "info",
      });
      navigate("/");
    });
  }

  return (
    <Flex>
      {isAuthenticated() && <Box>{login.nickName}님</Box>}
      <Button onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faHouse} />
        home
      </Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>
          <FontAwesomeIcon icon={faPenToSquare} />
          write
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/signup")}>
          <FontAwesomeIcon icon={faUserPlus} />
          signup
        </Button>
      )}
      {isAdmin() && (
        <Button onClick={() => navigate("/member/list")}>
          <FontAwesomeIcon icon={faList} />
          member list
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={() => navigate("/member?" + urlParams.toString())}>
          <FontAwesomeIcon icon={faUser} />
          my page
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>
          <FontAwesomeIcon icon={faRightToBracket} />
          login
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={hadleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          log out
        </Button>
      )}
      <Button onClick={() => navigate("/map")}>지도</Button>
    </Flex>
  );
}

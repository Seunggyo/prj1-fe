import { Button, Flex, useToast } from "@chakra-ui/react";
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
      <Button
        leftIcon={<FontAwesomeIcon icon={faHouse} />}
        onClick={() => navigate("/")}
      >
        home
      </Button>
      {isAuthenticated() && (
        <Button
          leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
          onClick={() => navigate("/write")}
        >
          write
        </Button>
      )}
      {isAuthenticated() || (
        <Button
          leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
          onClick={() => navigate("/signup")}
        >
          signup
        </Button>
      )}
      {isAdmin() && (
        <Button
          leftIcon={<FontAwesomeIcon icon={faList} />}
          onClick={() => navigate("/member/list")}
        >
          member list
        </Button>
      )}
      {isAuthenticated() && (
        <Button
          leftIcon={<FontAwesomeIcon icon={faUser} />}
          onClick={() => navigate("/member?" + urlParams.toString())}
        ></Button>
      )}
      {isAuthenticated() || (
        <Button
          leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
          onClick={() => navigate("/login")}
        >
          {login.nickName}님
        </Button>
      )}
      {isAuthenticated() && (
        <Button
          leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
          onClick={hadleLogout}
        >
          log out
        </Button>
      )}
    </Flex>
  );
}

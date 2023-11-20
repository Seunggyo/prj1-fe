import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider";
import { CommentContainer } from "../../component/CommentContainer";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LikeContainer({ like, onClick }) {
  const { isAuthenticated } = useContext(LoginContext);

  if (like === null) {
    return <Spinner />;
  }
  return (
    <Flex gap={2}>
      <Tooltip isDisabled={isAuthenticated()} hasArrow label={"로그인 하세요"}>
        <Button variant="ghost" size="xl" onClick={onClick}>
          {/*<FontAwesomeIcon icon={faHeart} size="xl" />*/}
          {like.like && <FontAwesomeIcon icon={fullHeart} size="xl" />}
          {like.like || <FontAwesomeIcon icon={emptyHeart} size="xl" />}
        </Button>
      </Tooltip>
      <Heading size="lg">{like.countLike}</Heading>
    </Flex>
  );
}

export function BoardView() {
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const { id } = useParams();

  const { hasAccess, isAdmin } = useContext(LoginContext);

  useEffect(() => {
    axios.get("/api/board/id/" + id).then((r) => setBoard(r.data));
  }, []);
  useEffect(() => {
    axios.get("/api/like/board/" + id).then((r) => setLike(r.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/board/remove/" + id)
      .then((r) => {
        toast({
          description: id + "번 게시물이 삭제 되었습니다.",
          status: "success",
        });
        navigate("/");
      })

      .catch((e) => {
        toast({
          description: "삭제에 문제가 발생했습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  function handleLike() {
    axios
      .post("/api/like", { boardId: board.id })
      .then((r) => setLike(r.data))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading size="xl">{board.id} 번 글 보기</Heading>
        <LikeContainer like={like} onClick={handleLike} />
      </Flex>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input readOnly value={board.title} />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Input readOnly value={board.content} />
      </FormControl>
      {/* 이미지 출력 */}
      {board.files.map((file) => (
        <Box key={file.id} my="5px" border="3px solid black">
          <Image width="100%" src={file.url} alt={file.name} />
        </Box>
      ))}
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input readOnly value={board.nickName} />
      </FormControl>
      <FormControl>
        <FormLabel>작성일시</FormLabel>
        <Input readOnly value={board.inserted} />
      </FormControl>
      {(hasAccess(board.writer) || isAdmin()) && (
        <Box>
          <Button colorScheme="green" onClick={() => navigate("/edit/" + id)}>
            수정
          </Button>
          <Button colorScheme="red" onClick={onOpen}>
            삭제
          </Button>
        </Box>
      )}

      {/*  삭제 모달*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제확인</ModalHeader>
          <ModalCloseButton />

          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <CommentContainer boardId={id} />
    </Box>
  );
}

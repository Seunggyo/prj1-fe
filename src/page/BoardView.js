import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export function BoardView() {
  const [board, setBoard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    axios.get("/api/board/id/" + id).then((r) => setBoard(r.data));
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

  return (
    <Box>
      <h1>{board.id} 번 글 보기</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input readOnly value={board.title} />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Input readOnly value={board.content} />
      </FormControl>
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input readOnly value={board.writer} />
      </FormControl>
      <FormControl>
        <FormLabel>작성일시</FormLabel>
        <Input readOnly value={board.inserted} />
      </FormControl>
      <Button colorScheme="green" onClick={() => navigate("/edit/" + id)}>
        수정
      </Button>
      <Button colorScheme="red" onClick={onOpen}>
        삭제
      </Button>

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
    </Box>
  );
}
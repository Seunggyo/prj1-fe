import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);
  const { id } = useParams();
  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/board/id/" + id).then((r) => updateBoard(r.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleTitleChange(e) {
    updateBoard((draft) => {
      draft.title = e.target.value;
    });
  }

  function handleContentChange(e) {
    updateBoard((draft) => {
      draft.content = e.target.value;
    });
  }

  function handleSubmit() {
    axios
      .put("/api/board/edit", board)
      .then(() => {
        toast({
          description: "수정이 완료되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "문제가 생겼습니다.",
          status: "error",
        });
      });
  }

  return (
    <Box>
      <h1>{id} 번 글 수정</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={board.title} onChange={handleTitleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Input value={board.content} onChange={handleContentChange} />
      </FormControl>
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input
          value={board.writer}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.writer = e.target.value;
            });
          }}
        />
      </FormControl>
      <Button colorScheme={"blue"} onClick={handleSubmit}>
        저장
      </Button>
      <Button onClick={() => navigate(-1)}>취소</Button>
    </Box>
  );
}

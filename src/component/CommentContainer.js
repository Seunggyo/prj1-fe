import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

function CommentForm({ boardId }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      boardId,
      comment,
    });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmit}>쓰기</Button>
    </Box>
  );
}

function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState(null);

  const params = new URLSearchParams();

  params.set("id", boardId);

  useEffect(() => {
    axios
      .get("/api/comment/list?" + params)
      .then((r) => setCommentList(r.data));
  }, []);
  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>댓글 작성자</Th>
            <Th>내용</Th>
            <Th>올린시간</Th>
          </Tr>
        </Thead>
        <Tbody>
          {commentList &&
            commentList.map((c) => (
              <Tr key={c.id}>
                <Td>{c.memberId}</Td>
                <Td>{c.comment}</Td>
                <Td>{c.inserted}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}

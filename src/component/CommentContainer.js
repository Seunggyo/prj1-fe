import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { LoginContext } from "./LoginProvider";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

function CommentList({ commentList, onDeleteModalOpen, isSubmitting }) {
  const { hasAccess } = useContext(LoginContext);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((c) => (
            <Box key={c.id}>
              <Flex justifyContent="space-between">
                <Heading size="xs">{c.memberId}</Heading>
                <Text fontSize="xs">{c.inserted}</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
                  {c.comment}
                </Text>
                {hasAccess(c.memberId) && (
                  <Box>
                    <Button
                      isDisabled={isSubmitting}
                      onClick={() => onDeleteModalOpen(c.id)}
                      size="xs"
                      colorScheme="red"
                    >
                      <DeleteIcon />
                    </Button>
                    <Button colorScheme="green" size="xs">
                      <EditIcon />
                    </Button>
                  </Box>
                )}
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용
  const commentIdRef = useRef(0);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { isAuthenticated } = useContext(LoginContext);

  const toast = useToast();

  // const [id, setId] = useState(0);

  function handleSubmit(comment) {
    setIsSubmitting(true);
    axios
      .post("/api/comment/add", comment)
      .then(() => {
        toast({
          description: "댓글이 등록 되었습니다.",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "댓글 등록 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleDelete() {
    // Todo: then, catch, finally
    setIsSubmitting(true);
    axios
      .delete("/api/comment/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "댓글이 삭제 되었습니다.",
          status: "success",
        });
      })
      .catch((e) => {
        if (e.response.status === 401 || e.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else {
          toast({
            description: "댓글 삭제 중 문제가 생겼습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        onClose();
      });
  }

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);
      axios
        .get("/api/comment/list?" + params)
        .then((r) => setCommentList(r.data));
    }
  }, [isSubmitting]);

  function handleDeleteModalOpen(id) {
    // setId(id);
    commentIdRef.current = id;

    onOpen();
  }

  return (
    <Box>
      {isAuthenticated() && (
        <CommentForm
          boardId={boardId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제확인</ModalHeader>
          <ModalCloseButton />

          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

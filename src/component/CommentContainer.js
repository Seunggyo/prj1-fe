import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
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
import { LoginContext } from "./LoginProvider";
import { DeleteIcon, EditIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function CommentForm({ boardId, isSubmitting, onSubmit, comment, setComment }) {
  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Flex>
        <Textarea
          placeholder="댓글을 작성해 주세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Center isDisabled={isSubmitting} onClick={handleSubmit}>
          <Button h={"full"} size={5}>
            <Heading p={5}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </Heading>
          </Button>
        </Center>
      </Flex>
    </Box>
  );
}

function CommentItem({ c, onDeleteModalOpen, isSubmitting, setIsSubmitting }) {
  const [isEditing, setIsEditing] = useState(false);
  const { hasAccess } = useContext(LoginContext);
  const [commentEdited, setCommentEdited] = useState(c.comment);
  const toast = useToast();

  function handleSubmit() {
    // todo : textarea 닫기
    // todo : 응답 코드에 따른 기능들 추가

    setIsSubmitting(true);

    axios
      .put("/api/comment/edit", {
        id: c.id,
        comment: commentEdited,
      })
      .then(() => {
        toast({
          description: "댓글이 수정 되었습니다.",
          status: "success",
        });
      })
      .catch((e) => {
        if (e.response.status === 401 || e.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        }

        if (e.response.status === 400) {
          toast({
            description: "댓글을 공백으로 둘수 없습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsEditing(false);
      });
  }

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading size="xs">{c.memberNickName}</Heading>
        <Text fontSize="xs">{c.ago}</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
            {c.comment}
          </Text>
          {isEditing && (
            <Box>
              <Textarea
                value={commentEdited}
                onChange={(e) => setCommentEdited(e.target.value)}
              />
              <Button
                isDisabled={isSubmitting}
                colorScheme="blue"
                onClick={handleSubmit}
              >
                저장
              </Button>
            </Box>
          )}
        </Box>
        {hasAccess(c.memberId) && (
          <Box>
            {isEditing || (
              <Button
                variant="ghost"
                size="xs"
                colorScheme="green"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
              </Button>
            )}
            {isEditing && (
              <Button
                variant="ghost"
                size="xs"
                colorScheme="gray"
                onClick={() => setIsEditing(false)}
              >
                <NotAllowedIcon />
              </Button>
            )}
            <Button
              variant="ghost"
              isDisabled={isSubmitting}
              onClick={() => onDeleteModalOpen(c.id)}
              size="xs"
              colorScheme="red"
            >
              <DeleteIcon />
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

function CommentList({
  commentList,
  onDeleteModalOpen,
  isSubmitting,
  setIsSubmitting,
}) {
  const { hasAccess } = useContext(LoginContext);

  return (
    <Center mt={10}>
      <Card w={"lg"}>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {commentList.map((c) => (
              <CommentItem
                key={c.id}
                c={c}
                onDeleteModalOpen={onDeleteModalOpen}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Center>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
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
        setComment("");
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
      <Center mt={10}>
        <Box w={"lg"}>
          <Heading>
            <FontAwesomeIcon icon={faComments} /> COMMENT
          </Heading>
        </Box>
      </Center>
      {isAuthenticated() && (
        <Center mt={10}>
          <Box w={"lg"}>
            <CommentForm
              comment={comment}
              setComment={setComment}
              boardId={boardId}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </Box>
        </Center>
      )}
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
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

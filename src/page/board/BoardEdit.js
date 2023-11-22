import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
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
  Switch,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);
  const [removeFileIds, setRemoveFileIds] = useState([]);
  const [uploadFiles, setUploadFiles] = useState(null);

  const { id } = useParams();
  const toast = useToast();

  const navigate = useNavigate();

  const { isOpen, onClose, onOpen } = useDisclosure();

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
      .putForm("/api/board/edit", {
        id: board.id,
        title: board.title,
        content: board.content,
        removeFileIds,
        uploadFiles,
      })
      .then(() => {
        toast({
          description: "수정이 완료되었습니다.",
          status: "success",
        });
        navigate("/board/" + id);
      })
      .catch((e) => {
        if (e.response.status === 400) {
          toast({
            description: "요청이 잘못되었습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "수정중 문제가 생겼습니다.",
            status: "error",
          });
        }
      })
      .finally(() => onClose);
  }

  function handleRemoveFileSwitch(e) {
    if (e.target.checked) {
      setRemoveFileIds([...removeFileIds, e.target.value]);
    } else {
      setRemoveFileIds(removeFileIds.filter((item) => item !== e.target.value));
    }
  }

  return (
    <Center>
      <Card w={"lg"}>
        <CardHeader>
          <Heading>{id} 번 글 수정</Heading>
        </CardHeader>
        <CardBody>
          <FormControl mb={5}>
            <FormLabel>제목</FormLabel>
            <Input value={board.title} onChange={handleTitleChange} />
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>본문</FormLabel>
            <Input value={board.content} onChange={handleContentChange} />
          </FormControl>
          {board.files.length > 0 &&
            board.files.map((file) => (
              <Card
                key={file.id}
                sx={{ marginTop: "20px", marginBottom: "20px" }}
              >
                <CardBody>
                  <Image src={file.url} alt={file.name} width="100%" />
                </CardBody>
                <Divider />
                <CardFooter>
                  <FormControl display="flex" alignItems={"center"} gap={2}>
                    <FormLabel colorScheme="red" m={0} p={0}>
                      <FontAwesomeIcon color="red" icon={faTrashCan} />
                    </FormLabel>
                    <Switch
                      value={file.id}
                      onChange={handleRemoveFileSwitch}
                      colorScheme="red"
                    />
                  </FormControl>
                </CardFooter>
              </Card>
            ))}
          {/*추가할파일 선택*/}
          <FormControl mb={5}>
            <FormLabel>이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setUploadFiles(e.target.files)}
            />
            <FormHelperText>
              한 개 파일은 3MB, 총 용량은 10MB 이내로 첨부하세요.
            </FormHelperText>
          </FormControl>
        </CardBody>
        <CardFooter>
          <Flex gap={2}>
            <Button colorScheme={"blue"} onClick={onOpen}>
              저장
            </Button>
            <Button onClick={() => navigate(-1)}>취소</Button>
          </Flex>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>저장</ModalHeader>
          <ModalCloseButton />

          <ModalBody>저장 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleSubmit} colorScheme="twitter">
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}

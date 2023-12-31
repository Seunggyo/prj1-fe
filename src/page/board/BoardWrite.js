import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploadFiles, setUploadFiles] = useState(null);

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleSubmit() {
    setIsSubmitting(true);
    axios
      .postForm("/api/board/add", {
        title,
        content,
        uploadFiles,
      })
      .then(() => {
        toast({
          description: "새글이 저장 되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((e) => {
        if (e.response.status === 400) {
          toast({
            description: "작성한 내용을 확인 해주세요.",
            status: "error",
          });
        } else {
          toast({
            description: "저장중 문제가 발생했습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <Center>
      <Card w={"xl"}>
        <CardHeader>
          <Heading>게시물 작성</Heading>
        </CardHeader>
        <CardBody>
          <FormControl mb={5}>
            <FormLabel>제목</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>본문</FormLabel>
            <Textarea
              h={"sm"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></Textarea>
          </FormControl>
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
          <Button
            isDisabled={isSubmitting}
            onClick={handleSubmit}
            colorScheme="twitter"
          >
            저장
          </Button>
        </CardFooter>
      </Card>
    </Center>
  );
}

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import axios from "axios";

export function ImageComponent({ board, updateBoard }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isSubmit, setIsSubmit] = useState(false);
  const imageIdRef = useRef(0);
  const toast = useToast();
  const [uploadFile, setUploadFile] = useState(null);

  function handleDelete() {
    setIsSubmit(true);
    axios
      .delete("/api/board/fileDelete/" + board.files.map((file) => file.id))
      .then(
        toast({
          description: "이미지 삭제가 완료되었습니다.",
          status: "success",
        }),
      )
      .finally(() => {
        setIsSubmit(false);
        onClose();
      });
  }

  return (
    <Box>
      <FormControl>
        <FormLabel>이미지</FormLabel>
        {board.files &&
          board.files.map((file) => (
            <Box key={file.id} my="5px" border="3px solid black">
              <Flex>
                <Image width="100%" src={file.url} alt={file.name} />
                <Button onClick={onOpen}>삭제</Button>
              </Flex>
            </Box>
          ))}
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setUploadFile(e.target.files)}
        />
      </FormControl>
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

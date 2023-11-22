import { Box, Button, Center, Flex, Input, Select } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("c", category);
    params.set("k", keyword);
    navigate("/?" + params);
  }

  return (
    <Center mt={6}>
      <Flex gap={2}>
        <Box>
          <Select
            width={"200px"}
            defaultValue={"all"}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">제목+본문</option>
            <option value="title">제목</option>
            <option value="content">본문</option>
          </Select>
        </Box>
        <Box>
          <Input
            width={"400px"}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <Button onClick={handleSearch}>
            <SearchIcon />
          </Button>
        </Box>
      </Flex>
    </Center>
  );
}

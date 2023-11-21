import { Button, Flex, Input, Select } from "@chakra-ui/react";
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
    <Flex>
      <Select onChange={(e) => setCategory(e.target.value)}>
        <option selected value="all">
          제목+본문
        </option>
        <option value="title">제목</option>
        <option value="content">본문</option>
      </Select>
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <Button onClick={handleSearch}>
        <SearchIcon />
      </Button>
    </Flex>
  );
}

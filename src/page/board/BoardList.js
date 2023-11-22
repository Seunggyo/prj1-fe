import {
  Badge,
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faHeart,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { SearchComponent } from "../../component/SearchComponent";

function PageButton({ pageNumber, variant, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    navigate("/?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function Pagination({ pageInfo }) {
  const navigate = useNavigate();
  const pageNumbers = [];
  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Center mt={6} mb={20}>
      <Box>
        {pageInfo.prevPageNumber && (
          <PageButton pageNumber={pageInfo.prevPageNumber} variant={"ghost"}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </PageButton>
        )}
        {pageNumbers.map((pageNumber) => (
          <PageButton
            key={pageNumber}
            variant={pageNumber === pageInfo.currentPage ? "solid" : "ghost"}
            pageNumber={pageNumber}
          >
            {pageNumber}
          </PageButton>
        ))}
        {pageInfo.nextPageNumber && (
          <PageButton pageNumber={pageInfo.nextPageNumber} variant={"ghost"}>
            <FontAwesomeIcon icon={faChevronRight} />
          </PageButton>
        )}
      </Box>
    </Center>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    axios.get("/api/board/list?" + params).then((r) => {
      setBoardList(r.data.boardList);
      setPageInfo(r.data.pageInfo);
    });
  }, [location]);

  if (boardList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading>게시물 목록</Heading>
      <Box mt={8}>
        <Table>
          <Thead>
            <Tr>
              <Th w={"100px"}>id</Th>
              <Th>title</Th>
              <Th w={"100px"}>by</Th>
              <Th w={"150px"}>nickname</Th>
              <Th w={"150px"}>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList &&
              boardList.map((board) => (
                <Tr
                  _hover={{
                    cursor: "pointer",
                  }}
                  key={board.id}
                  onClick={() => navigate("/board/" + board.id)}
                >
                  <Td>{board.id}</Td>
                  <Td>
                    {board.title}
                    {board.countComment > 0 && (
                      <Badge>
                        <ChatIcon />
                        {board.countComment}
                      </Badge>
                    )}
                    {board.countLike !== 0 && (
                      <Badge>
                        <FontAwesomeIcon icon={faHeart} />
                        {board.countLike}
                      </Badge>
                    )}
                    {board.countFile > 0 && (
                      <Badge>
                        <FontAwesomeIcon icon={faImage} />
                        {board.countFile}
                      </Badge>
                    )}
                  </Td>
                  <Td>{board.writer}</Td>
                  <Td>{board.nickName}</Td>
                  <Td>{board.ago}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      <SearchComponent />
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}

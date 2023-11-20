import {
  Badge,
  Box,
  Button,
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
} from "@fortawesome/free-solid-svg-icons";
import { SearchComponent } from "../../component/SearchComponent";

function Pagination({ pageInfo }) {
  const navigate = useNavigate();
  const pageNumbers = [];
  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageInfo.prevPageNumber && (
        <Button
          onClick={() => navigate("/?p=" + pageInfo.prevPageNumber)}
          variant={"ghost"}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
      )}
      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          onClick={() => navigate("/?p=" + pageNumber)}
          variant={pageNumber === pageInfo.currentPage ? "solid" : "ghost"}
        >
          {pageNumber}
        </Button>
      ))}
      {pageInfo.nextPageNumber && (
        <Button
          onClick={() => navigate("/?p=" + pageInfo.nextPageNumber)}
          variant={"ghost"}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      )}
    </Box>
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
      <h1>게시물 목록</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>title</Th>
              <Th>by</Th>
              <Th>nickname</Th>
              <Th>at</Th>
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

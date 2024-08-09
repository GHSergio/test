import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { useTheme, useMediaQuery } from "@mui/material";

// 規範 值
type ViewMode = "card" | "list";
type CurrentPage = "menu" | "favorite";

// 定義 Movie 屬性型別
interface Movie {
  id: number;
  title: string;
  image: string;
  release_date: string;
  description: string;
}

// 定義 state 屬性型別
export interface MovieContextProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentPage: CurrentPage;
  setCurrentPage: (page: CurrentPage) => void;
  movies: Movie[];
  handleMoreClick: (movieId: number) => void;
  favoriteList: Movie[];
  addToFavorite: (movieId: number) => void;
  removeFromFavorite: (movieId: number) => void;
  BASE_URL: string;
  INDEX_URL: string;
  POSTER_URL: string;
  modalOpen: boolean;
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  handleCloseModal: () => void;
  paginationPage: number;
  setPaginationPage: (page: number) => void;
  moviesPerPage: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  filterMovies: (movies: Movie[], keyword: string) => Movie[];
  paginateMovies: (movies: Movie[], page: number, perPage: number) => Movie[];
  alert: {
    severity: "success" | "error" | "info" | "warning";
    message: string;
  } | null;
  setAlert: (
    alert: {
      severity: "success" | "error" | "info" | "warning";
      message: string;
    } | null
  ) => void;
  getGridTemplateColumns: () => string;
  isSmallScreen: boolean;
}

const BASE_URL = `https://webdev.alphacamp.io`;
const INDEX_URL = BASE_URL + `/api/movies/`;
const POSTER_URL = BASE_URL + `/posters/`;

//創建MovieContext
export const MovieContext = createContext<MovieContextProps | undefined>(
  undefined
);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [currentPage, setCurrentPage] = useState<CurrentPage>("menu");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favoriteList, setFavoriteList] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [alert, setAlert] = useState<{
    severity: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  //定義 breakpoint
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.down("xl"));

  //每頁顯示movie筆數
  const moviesPerPage = useMemo(() => {
    if (isSmallScreen) return 4;
    if (isMediumScreen) return 8;
    if (isLargeScreen) return 12;
    if (isExtraLargeScreen) return 16;
    return 21;
  }, [isSmallScreen, isMediumScreen, isLargeScreen, isExtraLargeScreen]);

  // 使用 useMediaQuery 來設置不同斷點的樣式
  const getGridTemplateColumns = useCallback(() => {
    if (isSmallScreen) {
      return "repeat(auto-fit, minmax(300px, 1fr))";
    }
    if (isMediumScreen) {
      return "repeat(auto-fit, minmax(500px, 1fr))";
    }
    if (isLargeScreen) {
      return "repeat(auto-fit, minmax(500px, 1fr))";
    }
    if (isExtraLargeScreen) {
      return "repeat(auto-fit, minmax(600px, 1fr))";
    }
    return "repeat(auto-fit, minmax(800px, 1fr))";
  }, [isSmallScreen, isMediumScreen, isLargeScreen, isExtraLargeScreen]);

  //從傳入的movies篩選出title包含keyword的item
  const filterMovies = useCallback(
    (movies: Movie[], keyword: string): Movie[] => {
      if (!keyword) {
        return movies;
      }
      return movies.filter((movie) =>
        movie.title.toLowerCase().includes(keyword.toLowerCase())
      );
    },
    []
  );

  //將傳入的movies分頁
  const paginateMovies = useCallback(
    (movies: Movie[], page: number, perPage: number): Movie[] => {
      const startIndex = (page - 1) * perPage;
      return movies.slice(startIndex, startIndex + perPage);
    },
    []
  );

  //處理換頁
  const handlePageChange = useCallback(
    (
      // 表示是故意不使用的 避免TS錯誤
      _: React.ChangeEvent<unknown>, // 事件對象參數
      value: number // 新的頁碼值參數
    ) => {
      setPaginationPage(value);
    },
    []
  );

  //顯示 Movie detail
  const handleMoreClick = useCallback(
    (movieId: number) => {
      const selectedMovie = movies.find((movie) => movie.id === movieId);
      if (selectedMovie) {
        setSelectedMovie(selectedMovie);
        setModalOpen(true);
      }
    },
    [movies]
  );

  //添加該movie到FavoriteList
  const addToFavorite = useCallback(
    (movieId: number) => {
      const selectedMovie = movies.find((movie) => movie.id === movieId);
      if (selectedMovie && !favoriteList.some((fav) => fav.id === movieId)) {
        setFavoriteList((prev) => [...prev, selectedMovie]);
        setAlert({ severity: "success", message: "已添加到收藏清單！" });
      } else {
        setAlert({ severity: "warning", message: "該電影已在收藏清單內！" });
      }
    },
    [movies, favoriteList]
  );

  //移除該movie從FavoriteList
  const removeFromFavorite = useCallback((movieId: number) => {
    setFavoriteList((prev) => prev.filter((movie) => movie.id !== movieId));
    setAlert({ severity: "info", message: "已從收藏清單移除！" });
  }, []);

  //關閉 Modal
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedMovie(null);
  }, []);

  // 初始獲取movie data
  useEffect(() => {
    console.log("Fetching movies from API:", INDEX_URL); // 打印API URL
    axios
      .get(INDEX_URL)
      .then((response) => {
        console.log("API response:", response); // 打印API響應
        if (response.data && response.data.results) {
          setMovies(response.data.results);
        } else {
          console.error("Invalid API response structure:", response.data); // 打印無效響應結構
        }
      })
      .catch((error) => {
        console.error("Error fetching the movies:", error); // 打印錯誤
      });
  }, []);

  return (
    <MovieContext.Provider
      value={{
        viewMode,
        setViewMode,
        currentPage,
        setCurrentPage,
        favoriteList,
        addToFavorite,
        BASE_URL,
        INDEX_URL,
        POSTER_URL,
        movies,
        handleMoreClick,
        modalOpen,
        handleCloseModal,
        selectedMovie,
        setSelectedMovie,
        paginationPage,
        setPaginationPage,
        handlePageChange,
        moviesPerPage,
        searchKeyword,
        setSearchKeyword,
        paginateMovies,
        filterMovies,
        removeFromFavorite,
        alert,
        setAlert,
        getGridTemplateColumns,
        isSmallScreen,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

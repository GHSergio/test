import React, { createContext, useState, useEffect, ReactNode } from "react";
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

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.down("xl"));

  //每頁顯示movie筆數
  let moviesPerPage;
  if (isSmallScreen) {
    moviesPerPage = 4;
  } else if (isMediumScreen) {
    moviesPerPage = 8;
  } else if (isLargeScreen) {
    moviesPerPage = 12;
  } else if (isExtraLargeScreen) {
    moviesPerPage = 16;
  } else {
    moviesPerPage = 21;
  }

  //從傳入的movies篩選出title包含keyword的item
  const filterMovies = (movies: Movie[], keyword: string): Movie[] => {
    if (!keyword) {
      return movies;
    }
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  //將傳入的movies分頁
  const paginateMovies = (
    movies: Movie[],
    page: number,
    perPage: number
  ): Movie[] => {
    //每頁從哪筆data開始
    const startIndex = (page - 1) * perPage;
    //回傳startIndex ~ startIndex + moviesPerPage 筆 data
    return movies.slice(startIndex, startIndex + perPage);
  };

  //處理換頁
  const handlePageChange = (
    // event: React.ChangeEvent<unknown>, // 事件對象參數
    // TS不使用就改成這樣,是故意不使用的 避免錯誤
    _: React.ChangeEvent<unknown>, // 事件對象參數
    value: number // 新的頁碼值參數
  ) => {
    setPaginationPage(value);
  };

  //顯示 Movie detail
  const handleMoreClick = (movieId: number) => {
    const selectedMovie = movies.find((movie) => movie.id === movieId);
    if (selectedMovie) {
      setSelectedMovie(selectedMovie);
      setModalOpen(true);
    }
  };

  //添加該movie到FavoriteList
  const addToFavorite = (movieId: number) => {
    const selectedMovie = movies.find((movie) => movie.id === movieId);
    if (selectedMovie && !favoriteList.some((fav) => fav.id === movieId)) {
      setFavoriteList((prev) => [...prev, selectedMovie]);
      setAlert({ severity: "success", message: "已添加到收藏清單！" });
    } else {
      setAlert({ severity: "warning", message: "該電影已在收藏清單內！" });
    }
  };

  //移除該movie從FavoriteList
  const removeFromFavorite = (movieId: number) => {
    setFavoriteList((prev) => prev.filter((movie) => movie.id !== movieId));
    setAlert({ severity: "info", message: "已從收藏清單移除！" });
  };

  //關閉 Modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovie(null);
  };

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
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

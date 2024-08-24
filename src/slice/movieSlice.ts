import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

// 定義State
interface MovieState {
  viewMode: ViewMode;
  currentPage: CurrentPage;
  movies: Movie[];
  favoriteList: Movie[];
  modalOpen: boolean;
  selectedMovie: Movie | null;
  paginationPage: number;
  searchKeyword: string;
  alert: {
    severity: "success" | "error" | "info" | "warning";
    message: string;
  } | null;
  isSmallScreen?: boolean;
  loading: boolean;
}

//定義State initial value
const initialState: MovieState = {
  viewMode: "card",
  currentPage: "menu",
  movies: [],
  favoriteList: [],
  modalOpen: false,
  selectedMovie: null,
  paginationPage: 1,
  searchKeyword: "",
  alert: null,
  isSmallScreen: false,
  loading: false,
};

let moviesPerPage;
const BASE_URL = `https://webdev.alphacamp.io`;
const INDEX_URL = BASE_URL + `/api/movies/`;
const POSTER_URL = BASE_URL + `/posters/`;

// 定義非同步操作
// rejectWithValue 是 createAsyncThunk 提供的第二個參數的解構 -> 用來在異步操作失敗時返回自定義的錯誤信息。
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(INDEX_URL);
      return response.data.results;
    } catch (error) {
      return rejectWithValue("數據獲取發生錯誤");
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<CurrentPage>) => {
      state.currentPage = action.payload;
    },
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
    },
    setFavoriteList: (state, action: PayloadAction<Movie[]>) => {
      state.favoriteList = action.payload;
    },
    setSelectedMovie: (state, action: PayloadAction<Movie | null>) => {
      state.selectedMovie = action.payload;
    },
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
    setPaginationPage: (state, action: PayloadAction<number>) => {
      state.paginationPage = action.payload;
    },
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    },
    setAlert: (
      state,
      action: PayloadAction<{
        severity: "success" | "error" | "info" | "warning";
        message: string;
      } | null>
    ) => {
      state.alert = action.payload;
    },

    //函式區
    addToFavorite: (state, action: PayloadAction<number>) => {
      const selectedMovie = state.movies.find(
        (movie) => movie.id === action.payload
      );
      if (
        selectedMovie &&
        !state.favoriteList.some((fav) => fav.id === action.payload)
      ) {
        state.favoriteList.push(selectedMovie);
        state.alert = { severity: "success", message: "已添加到收藏清單！" };
      } else {
        state.alert = {
          severity: "warning",
          message: "該電影已在收藏清單內！",
        };
      }
    },
    removeFromFavorite: (state, action: PayloadAction<number>) => {
      state.favoriteList = state.favoriteList.filter(
        (movie) => movie.id !== action.payload
      );
      state.alert = { severity: "info", message: "已從收藏清單移除！" };
    },
    handleCloseModal: (state) => {
      state.modalOpen = false;
      state.selectedMovie = null;
    },
    handleMoreClick: (state, action: PayloadAction<number>) => {
      const selectedMovie = state.movies.find(
        (movie) => movie.id === action.payload
      );
      if (selectedMovie) {
        state.selectedMovie = selectedMovie;
        state.modalOpen = true;
      }
    },
    handlePageChange: (state, action: PayloadAction<number>) => {
      state.paginationPage = action.payload;
    },
  },
  //用來處理 createAsyncThunk 生成的三種狀態（pending、fulfilled、rejected），以及其他在 slice 之外觸發的 actions。
  extraReducers: (builder) => {
    // 處理載入狀態
    builder.addCase(fetchMovies.pending, (state) => {
      state.loading = true;
    });
    // 處理成功狀態
    builder.addCase(
      fetchMovies.fulfilled,
      (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.movies = action.payload;
      }
    );
    // 處理失敗狀態
    builder.addCase(fetchMovies.rejected, (state) => {
      state.loading = false;
    });
  },
});

// 不直接修改 state -> 輔助函式
const filterMovies = (movies: Movie[], keyword: string): Movie[] => {
  if (!keyword) return movies;
  return movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword.toLowerCase())
  );
};

const paginateMovies = (
  movies: Movie[],
  page: number,
  perPage: number
): Movie[] => {
  const startIndex = (page - 1) * perPage;
  return movies.slice(startIndex, startIndex + perPage);
};

export {
  filterMovies,
  paginateMovies,
  BASE_URL,
  INDEX_URL,
  POSTER_URL,
  moviesPerPage,
};

export const {
  setViewMode,
  setCurrentPage,
  setMovies,
  setFavoriteList,
  setSelectedMovie,
  setModalOpen,
  setPaginationPage,
  setSearchKeyword,
  setAlert,
  addToFavorite,
  removeFromFavorite,
  handleCloseModal,
  handleMoreClick,
  handlePageChange,
} = movieSlice.actions;

export default movieSlice.reducer;

import React, { useEffect, useMemo, useCallback } from "react";
import PosterCard from "../components/PosterCard";
import PosterList from "../components/PosterList";
import { Box, Pagination, Typography, Alert } from "@mui/material";
import MovieModal from "./MovieModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index";
import {
  POSTER_URL,
  handleMoreClick,
  addToFavorite,
  handleCloseModal,
  handlePageChange,
  paginateMovies,
  filterMovies,
  setAlert,
  fetchMovies,
} from "../slice/movieSlice";
import { useThemeContext } from "../contexts/useThemeContext";

const MovieList: React.FC = () => {
  // const {
  //   viewMode,
  //   movies,
  //   POSTER_URL,
  //   handleMoreClick,
  //   addToFavorite,
  //   modalOpen,
  //   handleCloseModal,
  //   selectedMovie,
  //   paginationPage,
  //   handlePageChange,
  //   searchKeyword,
  //   moviesPerPage,
  //   paginateMovies,
  //   filterMovies,
  //   alert,
  //   setAlert,
  //   getGridTemplateColumns,
  //   isSmallScreen,
  // } = useMovie();
  const { getGridTemplateColumns, isSmallScreen, moviesPerPage } =
    useThemeContext();
  const dispatch: AppDispatch = useDispatch();
  // 從 store 提取 State
  const viewMode = useSelector((state: RootState) => state.movie.viewMode);
  const movies = useSelector((state: RootState) => state.movie.movies);
  const modalOpen = useSelector((state: RootState) => state.movie.modalOpen);
  const selectedMovie = useSelector(
    (state: RootState) => state.movie.selectedMovie
  );
  const paginationPage = useSelector(
    (state: RootState) => state.movie.paginationPage
  );
  const searchKeyword = useSelector(
    (state: RootState) => state.movie.searchKeyword
  );
  const alert = useSelector((state: RootState) => state.movie.alert);
  const loading = useSelector((state: RootState) => state.movie.loading);

  // 在組件掛載時觸發 `fetchMovies` 來獲取數據
  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // 使用 useMemo 來優化 依賴於其他 狀態 的計算
  //電影過濾
  const filteredMovies = useMemo(() => {
    return filterMovies(movies, searchKeyword);
  }, [movies, searchKeyword]);

  //電影分頁
  const paginatedMovies = useMemo(() => {
    return paginateMovies(filteredMovies, paginationPage, moviesPerPage);
  }, [filteredMovies, paginationPage, moviesPerPage]);

  // 中間函數，處理 Pagination 組件的 onChange 事件
  // Slice(page) & MUI(event,page) 參數預期不符合產生的衝突 -> 修改MUI預期的event參數
  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    dispatch(handlePageChange(page));
  };

  //alert 1秒後 自動消失
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        dispatch(setAlert(null));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [alert, dispatch]);

  //手動 Close alert
  const handleCloseAlert = useCallback(() => {
    dispatch(setAlert(null));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Alert */}
      {alert && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          <Alert severity={alert.severity} onClose={handleCloseAlert}>
            {alert.message}
          </Alert>
        </Box>
      )}
      {filteredMovies.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Typography variant="h6">此關鍵字，查無相關搜尋結果！</Typography>
        </Box>
      ) : (
        <>
          {viewMode === "card" ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isSmallScreen
                  ? "repeat(auto-fill, minmax(150px, 1fr))"
                  : "repeat(auto-fill, minmax(300px, 1fr))",
                gap: isSmallScreen ? 0 : 2,
              }}
            >
              {paginatedMovies.map((movie) => (
                <PosterCard
                  key={movie.id}
                  id={movie.id}
                  poster={POSTER_URL + movie.image}
                  title={movie.title}
                  onMoreClick={() => dispatch(handleMoreClick?.(movie.id))}
                  onIconClick={() => dispatch(addToFavorite?.(movie.id))}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: getGridTemplateColumns(),
                gap: 2,
              }}
            >
              {paginatedMovies.map((movie) => (
                <PosterList
                  key={movie.id}
                  id={movie.id}
                  poster={POSTER_URL + movie.image}
                  title={movie.title}
                  onMoreClick={() => dispatch(handleMoreClick?.(movie.id))}
                  onIconClick={() => dispatch(addToFavorite?.(movie.id))}
                />
              ))}
            </Box>
          )}
        </>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={Math.ceil(filteredMovies.length / moviesPerPage)}
          page={paginationPage}
          onChange={handlePaginationChange}
          color="primary"
        />
      </Box>
      {/* Modal */}
      {selectedMovie && (
        <MovieModal
          open={modalOpen}
          handleClose={() => dispatch(handleCloseModal())}
          movie={selectedMovie}
        />
      )}
    </div>
  );
};

export default MovieList;

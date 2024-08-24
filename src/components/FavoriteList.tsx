import React, { useEffect, useMemo, useCallback } from "react";
import PosterCard from "../components/PosterCard";
import PosterList from "../components/PosterList";
import { Box, Pagination, Typography, Alert } from "@mui/material";
import MovieModal from "./MovieModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";
import {
  POSTER_URL,
  handleMoreClick,
  removeFromFavorite,
  handleCloseModal,
  handlePageChange,
  paginateMovies,
  filterMovies,
  setAlert,
} from "../slice/movieSlice";
import { useThemeContext } from "../contexts/useThemeContext";

const FavoriteList: React.FC = () => {
  // const {
  //   viewMode,
  //   POSTER_URL,
  //   handleMoreClick,
  //   modalOpen,
  //   handleCloseModal,
  //   selectedMovie,
  //   paginationPage,
  //   handlePageChange,
  //   moviesPerPage,
  //   searchKeyword,
  //   favoriteList,
  //   paginateMovies,
  //   filterMovies,
  //   removeFromFavorite,
  //   alert,
  //   setAlert,
  //   getGridTemplateColumns,
  //   isSmallScreen,
  // } = useMovie();

  //電影過濾
  const { getGridTemplateColumns, isSmallScreen, moviesPerPage } =
    useThemeContext();
  const dispatch = useDispatch();

  // 從 store 提取 State
  const viewMode = useSelector((state: RootState) => state.movie.viewMode);
  const favoriteList = useSelector(
    (state: RootState) => state.movie.favoriteList
  );
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

  const filteredMovies = useMemo(() => {
    return filterMovies(favoriteList, searchKeyword);
  }, [favoriteList, searchKeyword]);

  //電影分頁
  const paginatedMovies = useMemo(() => {
    return paginateMovies(filteredMovies, paginationPage, moviesPerPage);
  }, [filteredMovies, paginationPage, moviesPerPage]);

  // 中間函數，處理 Pagination 組件的 onChange 事件
  // Slice & MUI 參數預期不符合產生的衝突 -> 修改MUI預期的event參數
  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    dispatch(handlePageChange(page));
  };

  // console.log("篩選後的電影清單:", filteredMovies);
  // console.log("當前分頁:", paginationPage);
  // console.log("此分頁該顯示的電影:", paginatedMovies);

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
      {/* render */}
      {filteredMovies.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Typography variant="h6">此關鍵字，查無相關搜尋結果！</Typography>
        </Box>
      ) : (
        // 依照viewMode
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
                  onIconClick={() => dispatch(removeFromFavorite?.(movie.id))}
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
                  onIconClick={() => dispatch(removeFromFavorite?.(movie.id))}
                />
              ))}
            </Box>
          )}
        </>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        <Pagination
          count={Math.ceil(filteredMovies.length / moviesPerPage)}
          page={paginationPage}
          onChange={handlePaginationChange}
          color="primary"
        />
      </Box>
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

export default FavoriteList;

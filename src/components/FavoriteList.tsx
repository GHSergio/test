import React, { useEffect } from "react";
import PosterCard from "../components/PosterCard";
import PosterList from "../components/PosterList";
import { useMovie } from "../contexts/useMovie";
import {
  Box,
  useTheme,
  useMediaQuery,
  Pagination,
  Typography,
  Alert,
} from "@mui/material";
import MovieModal from "./MovieModal";
const MovieList: React.FC = () => {
  const {
    viewMode,
    POSTER_URL,
    handleMoreClick,
    modalOpen,
    handleCloseModal,
    selectedMovie,
    paginationPage,
    handlePageChange,
    moviesPerPage,
    searchKeyword,
    favoriteList,
    paginateMovies,
    filterMovies,
    removeFromFavorite,
    alert,
    setAlert,
  } = useMovie();
  const theme = useTheme();

  // 使用 useMediaQuery 來設置不同斷點的樣式
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));

  console.log("接收到的收藏清單:", favoriteList);

  // 設置不同 breakPoint 排版
  const getGridTemplateColumns = () => {
    if (isSmallScreen) {
      return "repeat(auto-fit, minmax(300px, 1fr))";
    }
    if (isMediumScreen) {
      return "repeat(auto-fit, minmax(500px, 1fr))";
    }
    if (isLargeScreen) {
      return "repeat(auto-fit, minmax(600px, 1fr))";
    }
    return "repeat(auto-fit, minmax(600px, 1fr))";
  };

  //電影過濾
  const filteredMovies = filterMovies(favoriteList, searchKeyword);
  //電影分頁
  const paginatedMovies = paginateMovies(
    filteredMovies,
    paginationPage,
    moviesPerPage
  );

  //alert 1秒後 自動消失
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  //手動 Close alert
  const handleCloseAlert = () => {
    setAlert(null);
  };

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
                  onMoreClick={() => handleMoreClick?.(movie.id)}
                  onIconClick={() => removeFromFavorite?.(movie.id)}
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
                  onMoreClick={() => handleMoreClick?.(movie.id)}
                  onIconClick={() => removeFromFavorite?.(movie.id)}
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
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      {selectedMovie && (
        <MovieModal
          open={modalOpen}
          handleClose={handleCloseModal}
          movie={selectedMovie}
        />
      )}
    </div>
  );
};

export default MovieList;

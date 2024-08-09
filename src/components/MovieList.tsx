import React, { useEffect, useMemo } from "react";
import PosterCard from "../components/PosterCard";
import PosterList from "../components/PosterList";
import { useMovie } from "../contexts/useMovie";
import { Box, Pagination, Typography, Alert } from "@mui/material";
import MovieModal from "./MovieModal";

const MovieList: React.FC = () => {
  const {
    viewMode,
    movies,
    POSTER_URL,
    handleMoreClick,
    addToFavorite,
    modalOpen,
    handleCloseModal,
    selectedMovie,
    paginationPage,
    handlePageChange,
    searchKeyword,
    moviesPerPage,
    paginateMovies,
    filterMovies,
    alert,
    setAlert,
    getGridTemplateColumns,
    isSmallScreen,
  } = useMovie();

  // 使用 useMemo 來優化 依賴於其他 狀態 的計算
  //電影過濾
  const filteredMovies = useMemo(
    () => filterMovies(movies, searchKeyword),
    [movies, searchKeyword, filterMovies]
  );

  //電影分頁
  const paginatedMovies = useMemo(
    () => paginateMovies(filteredMovies, paginationPage, moviesPerPage),
    [filteredMovies, paginationPage, moviesPerPage, paginateMovies]
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
                  onIconClick={() => addToFavorite?.(movie.id)}
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
                  onIconClick={() => addToFavorite?.(movie.id)}
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
      {/* Modal */}
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

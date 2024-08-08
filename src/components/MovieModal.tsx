import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMovie } from "../contexts/useMovie";

interface MovieModalProps {
  open: boolean;
  handleClose: () => void;
  movie: {
    title: string;
    image: string;
    release_date: string;
    description: string;
  };
}

const MovieModal: React.FC<MovieModalProps> = ({
  open,
  handleClose,
  movie,
}) => {
  const { POSTER_URL } = useMovie();
  const movieImage = `${POSTER_URL}${movie.image}`;
  const theme = useTheme();

  //寬度600以下
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  //寬度600~1280
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "xl"));

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // "600以下"  85% : "600~1280"  65% : 其他(1280以上) 50%
    width: isSmallScreen ? "85%" : isMediumScreen ? "65%" : "50%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
  };

  const imageStyle = {
    width: isSmallScreen ? "100%" : "50%",
    marginBottom: isSmallScreen ? "16px" : "0",
  };

  const contentStyle = {
    display: isSmallScreen ? "block" : "flex",
    gap: isSmallScreen ? "0" : "16px",
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        {/* Header 區域: 顯示電影標題和發行日期，右上角顯示關閉按鈕 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          {/* title & release_date */}
          <Box sx={{ maxWidth: "80%" }}>
            <Tooltip
              title={movie.title}
              componentsProps={{
                tooltip: {
                  sx: {
                    fontSize: "1.2em",
                    backgroundColor: "rgba(0, 0, 0, 0.87)",
                    color: "white",
                  },
                },
              }}
            >
              <Typography
                id="modal-title"
                variant="h6"
                component="h2"
                sx={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {movie.title}
              </Typography>
            </Tooltip>
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              Release Date: {movie.release_date}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <hr />
        {/* Content 區域: 根據屏幕大小動態顯示圖片和描述文字 */}
        <Box sx={contentStyle}>
          <img src={movieImage} alt={movie.title} style={imageStyle} />
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: isSmallScreen ? "0.8rem" : "1rem",
                letterSpacing: "0.08rem",
              }}
            >
              {movie.description}
            </Typography>
          </Box>
        </Box>
        <hr />
        {/* Footer 區域: 右側顯示關閉按鈕 */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MovieModal;

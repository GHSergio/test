import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  IconButton,
  Divider,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMovie } from "../contexts/useMovie";

interface PosterListProps {
  id: number;
  poster: string;
  title: string;
  onMoreClick: () => void;
  onIconClick: () => void;
}

const PosterList: React.FC<PosterListProps> = ({
  id,
  poster,
  title,
  onMoreClick,
  onIconClick,
}) => {
  const { favoriteList, currentPage } = useMovie();
  const theme = useTheme();

  // 是否在收藏內
  const isFavorite = (id: number) => {
    return favoriteList.some((favorite) => favorite.id === id);
  };

  // 小螢幕時
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <List
      sx={{
        boxShadow: theme.palette.custom.boxShadow,
        backgroundColor: theme.palette.custom.cardBackground,
        borderRadius: "5px",
        height: "100px",
      }}
    >
      <ListItem
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100%",
          padding: 1,
        }}
      >
        {/* image */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <ListItemAvatar>
            <Avatar
              src={poster}
              alt={title}
              variant="square"
              sx={{
                width: "60px",
                height: "80px",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
          </ListItemAvatar>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ mx: 0 }} />
        {/* 右半區 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: isSmallScreen ? "75%" : "90%",
            padding: isSmallScreen ? "0px 0px" : "0px 0px",
            marginLeft: 0.5,
          }}
        >
          <Tooltip title={title} arrow>
            <Typography
              noWrap
              sx={{
                color: theme.palette.custom.textColor,
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                // maxWidth: "90%",
                width: "70%",
                marginBottom: isSmallScreen ? 1 : 0,
              }}
            >
              {title}
            </Typography>
          </Tooltip>

          {/* More & Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tooltip
              title={"更多資訊"}
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
              <Button
                onClick={onMoreClick}
                sx={{
                  marginRight: isSmallScreen ? 0 : 1,
                  color: theme.palette.custom.buttonTextColor,
                  backgroundColor: theme.palette.custom.buttonBackgroundColor,
                  fontSize: isSmallScreen ? "0.5rem" : "1rem",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: theme.palette.custom.buttonHover,
                  },
                  width: "70px",
                  height: "30px",
                  marginLeft: 1,
                }}
              >
                More
              </Button>
            </Tooltip>
            <Tooltip
              title={currentPage === "menu" ? "添加到收藏" : "從收藏移除"}
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
              <IconButton
                aria-label={
                  currentPage === "menu"
                    ? "add to favorites"
                    : "remove from favorites"
                }
                onClick={onIconClick}
              >
                {currentPage === "menu" ? (
                  <FavoriteIcon
                    style={{ color: isFavorite(id) ? "red" : "inherit" }}
                    sx={{
                      transform: isSmallScreen ? "scale(0.8)" : "scale(1)",
                    }}
                  />
                ) : (
                  <DeleteIcon
                    sx={{
                      color: theme.palette.custom.deleteIcon,
                      transform: isSmallScreen ? "scale(0.8)" : "scale(1)",
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </ListItem>
    </List>
  );
};

export default PosterList;

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Divider,
  Tooltip,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMovie } from "../contexts/useMovie";

interface PosterCardProps {
  id: number;
  poster: string;
  title: string;
  onMoreClick: () => void;
  onIconClick: () => void;
}

const PosterCard: React.FC<PosterCardProps> = ({
  id,
  poster,
  title,
  onMoreClick,
  onIconClick,
}) => {
  const { favoriteList, currentPage, isSmallScreen } = useMovie();
  const theme = useTheme();

  // 是否在收藏內
  const isFavorite = useMemo(() => {
    return favoriteList.some((favorite) => favorite.id === id);
  }, [favoriteList, id]);

  return (
    <Card
      sx={{
        height: isSmallScreen ? "250px" : "520px",
        margin: 0.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: theme.palette.custom.cardBackground,
        boxShadow: theme.palette.custom.boxShadow,
      }}
    >
      <CardContent
        sx={{
          paddingBottom: isSmallScreen ? "0px" : "16px",
        }}
      >
        <CardMedia
          component="img"
          image={poster}
          alt={title}
          sx={{
            height: isSmallScreen ? "150px" : "350px",
            objectFit: "contain",
            maxHeight: "100%",
            marginBottom: isSmallScreen ? "0px" : "15px",
          }}
        />
        <Tooltip
          title={title}
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
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              color: theme.palette.custom.textColor,
              fontWeight: "bold",
              textOverflow: "ellipsis",
              textAlign: "center",
              overflow: "hidden",
              whiteSpace: "nowrap",
              transform: isSmallScreen ? "scale(0.5)" : "scale(1)",
              margin: 0,
            }}
          >
            {title}
          </Typography>
        </Tooltip>
      </CardContent>
      <Divider />

      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 0,
          paddingX: isSmallScreen ? 0 : 1,
          paddingY: isSmallScreen ? 0 : 1,
          marginTop: isSmallScreen ? 0 : 1,
          marginX: isSmallScreen ? 0 : 2,
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
            variant="outlined"
            onClick={onMoreClick}
            sx={{
              color: theme.palette.custom.buttonTextColor,
              backgroundColor: theme.palette.custom.buttonBackgroundColor,
              fontSize: "1rem",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: theme.palette.custom.buttonHover,
              },
              transform: isSmallScreen ? "scale(0.5)" : "scale(1)",
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
                style={{ color: isFavorite ? "red" : "inherit" }}
                sx={{
                  color: theme.palette.custom.deleteIcon,
                  transform: isSmallScreen ? "scale(0.6)" : "scale(1)",
                }}
              />
            ) : (
              <DeleteIcon
                sx={{
                  color: theme.palette.custom.deleteIcon,
                  transform: isSmallScreen ? "scale(0.6)" : "scale(1)",
                }}
              />
            )}
          </IconButton>
        </Tooltip>
      </CardContent>
    </Card>
  );
};

export default PosterCard;

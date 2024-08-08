import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Movie as MovieIcon,
  Brightness7 as Brightness7Icon,
  Brightness4 as Brightness4Icon,
} from "@mui/icons-material";
import { useThemeContext } from "../contexts/useThemeContext";
import { useMovie } from "../contexts/useMovie";

const Navbar: React.FC = () => {
  // 使用自定義的主題上下文，獲取當前模式和切換主題的函數
  const { mode, toggleTheme } = useThemeContext();
  // 使用媒體查詢來檢查螢幕寬度是否小於720px
  const isMobile = useMediaQuery("(max-width:720px)");
  // 用於控制菜單打開的狀態
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { setCurrentPage, currentPage } = useMovie();
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile ? (
          <>
            {/* 漢堡菜單按鈕，在小螢幕下顯示 */}
            <Tooltip
              title={"展開選擇切換清單"}
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
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            {/* 漢堡菜單內容 */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <Tooltip
                title={"切換至電影清單"}
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
                <MenuItem onClick={handleMenuClose}>MovieList</MenuItem>
              </Tooltip>
              <Tooltip
                title={"切換至收藏清單"}
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
                <MenuItem onClick={handleMenuClose}>Favorite</MenuItem>
              </Tooltip>
            </Menu>
            {/* 中間顯示的應用標題和圖標 */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MovieIcon sx={{ mr: 1 }} />
              MovieListApp
            </Typography>
          </>
        ) : (
          <>
            {/* 默認狀態下的應用圖標 */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="movie-icon"
              sx={{ mr: 2 }}
            >
              <MovieIcon />
            </IconButton>

            {/* 默認狀態下的應用標題 */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: theme.palette.custom.textColor,
                fontWeight: "600",
              }}
            >
              MovieListApp
            </Typography>

            {/* 默認狀態下的導航按鈕 */}
            <Tooltip
              title={"切換至電影清單"}
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
                color="inherit"
                sx={{
                  color: theme.palette.custom.textColor,
                  fontWeight: "bold",
                  backgroundColor:
                    currentPage === "menu"
                      ? theme.palette.custom.buttonActive
                      : "none",
                  "&:hover": {
                    backgroundColor: theme.palette.custom.buttonHover,
                  },
                }}
                onClick={() => setCurrentPage("menu")}
              >
                Movie
              </Button>
            </Tooltip>
            <Tooltip
              title={"切換至收藏清單"}
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
                color="inherit"
                sx={{
                  color: theme.palette.custom.textColor,
                  fontWeight: "bold",
                  backgroundColor:
                    currentPage === "favorite"
                      ? theme.palette.custom.buttonActive
                      : "none",
                  "&:hover": {
                    backgroundColor: theme.palette.custom.buttonHover,
                  },
                  marginLeft: "5px",
                }}
                onClick={() => setCurrentPage("favorite")}
              >
                Favorite
              </Button>
            </Tooltip>
          </>
        )}

        {/* 切換主題模式的按鈕 */}
        <Tooltip
          title={mode === "light" ? "切換至深色主題" : "切換至淺色主題"}
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
            edge="end"
            color="inherit"
            aria-label="theme-toggle"
            onClick={toggleTheme}
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

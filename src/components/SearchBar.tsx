import React from "react";
import {
  Grid,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useMovie } from "../contexts/useMovie";

const SearchBar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  //從Movie Context 提取 setViewMode
  const { viewMode, setViewMode, searchKeyword, setSearchKeyword } = useMovie();

  // 將 keyword 更新到 state
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <Grid container spacing={2} p={2} alignItems="center">
      <Grid
        item
        container
        direction={isMobile ? "column" : "row"}
        spacing={1}
        alignItems="center"
        xs={isMobile ? 12 : true}
        marginX={"10px"}
      >
        {/* 搜尋框 */}
        <Tooltip
          title={"輸入搜尋關鍵字"}
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
          <Grid
            item
            xs={isMobile ? 12 : true}
            style={{
              flex: isMobile ? "none" : "0 0 auto",
              minWidth: isMobile ? "100%" : "250px",
            }}
          >
            <TextField
              label="Search Movies"
              variant="outlined"
              fullWidth
              value={searchKeyword}
              onChange={handleSearchChange}
            />
          </Grid>
        </Tooltip>
      </Grid>

      {/* 排列模式切換按鈕 */}
      <Grid
        item
        style={{ textAlign: isMobile ? "center" : "right", flexShrink: 1 }}
      >
        <Tooltip
          title={"切換至卡片模式"}
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
            onClick={() => setViewMode?.("card")}
            color={viewMode === "card" ? "primary" : "default"}
          >
            <ViewModuleIcon />
          </IconButton>
        </Tooltip>

        <Tooltip
          title={"切換至清單模式"}
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
            onClick={() => setViewMode?.("list")}
            color={viewMode === "list" ? "primary" : "default"}
          >
            <ViewListIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default SearchBar;

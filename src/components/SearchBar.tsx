import React from "react";
import { Grid, TextField, IconButton, Tooltip } from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useMovie } from "../contexts/useMovie";
import { debounce } from "lodash";

const SearchBar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    searchKeyword,
    setSearchKeyword,
    setPaginationPage,
    isSmallScreen,
  } = useMovie();

  //減少頁碼更新的頻率
  const debouncedPageChange = debounce(() => {
    setPaginationPage(1);
  }, 100);

  // 將 keyword 更新到 state
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchKeyword(value); // 立即更新搜尋關鍵字
    debouncedPageChange(); // 延遲更新頁碼
  };

  return (
    <Grid container spacing={2} p={2} alignItems="center">
      <Grid
        item
        container
        direction={isSmallScreen ? "column" : "row"}
        spacing={1}
        alignItems="center"
        xs={isSmallScreen ? 12 : true}
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
            xs={isSmallScreen ? 12 : true}
            style={{
              flex: isSmallScreen ? "none" : "0 0 auto",
              minWidth: isSmallScreen ? "100%" : "250px",
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
        style={{ textAlign: isSmallScreen ? "center" : "right", flexShrink: 1 }}
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

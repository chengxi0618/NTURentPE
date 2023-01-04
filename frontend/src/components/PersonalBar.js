import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import { useNavigate } from "react-router"
import Notif from "./Notification"
import Menu from "./Menu"
import { useRent } from "../containers/hooks/useRent"

export default function PersonalBar() {
  const useRentContext = useRent()
  const { username } = useRentContext

  const navigate = useNavigate()
  return (
    <Box sx={{ flexGrow: 1, position: "fixed", zIndex: 10 }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "white",
          color: "black",
          boxShadow:
            "0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            {username}'s Event
          </Typography>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Notif></Notif>
            <Menu></Menu>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

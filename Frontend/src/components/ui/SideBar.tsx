import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, IconButton } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import getMenuByRole from "../../utils/getMenuByRole";

interface SideBarProps {
  value: boolean;
  setOpen: () => void;
}

export default function SideBar({ value, setOpen }: SideBarProps) {
  const role = useAppSelector((state) => state.auth.user?.role);
  console.log("role------", role);
  const menuList = role ? getMenuByRole(role) : [];
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <Box sx={{ display: "flex", justifyContent: "right", px: 2 }}>
          <IconButton onClick={() => setOpen()} sx={{}}>
            <CloseIcon
              fontSize="medium"
              sx={{ color: "black", my: 1, ":hover": { color: "#1976D2" } }}
            />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />
        {!role ? (
          <CircularProgress size={20} sx={{ m: 2 }} />
        ) : (
          menuList.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                sx={{ display: "flex", justifyContent: "center", px: 2 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
      <Divider />
      {/* <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <div>
      <Drawer
        variant="temporary"
        slotProps={{
          paper: {
            sx: {
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
              height: "85vh",
              top: "8vh",
            },
          },
        }}
        anchor="left"
        open={value}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}

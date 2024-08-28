import React, { useState } from 'react';
import { FaFilePdf } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { IoReorderThreeOutline } from "react-icons/io5";
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    if (!isSmUp) {
      setIsOpen(false);
    }
  };

  return (
    <div>
      {!isSmUp && (
        <IconButton
          aria-label="open sidebar"
          onClick={toggleSidebar}
          sx={{
            p: 2,
            mt: 7,
            backgroundColor:"whitesmoke",
            ml: 3,
            color: 'text.secondary',
          }}
        >
          <IoReorderThreeOutline size={30} />
        </IconButton>
      )}

      <Drawer
        anchor="left"
        open={isOpen || isSmUp}
        onClose={toggleSidebar}
        variant={isSmUp ? "persistent" : "temporary"}
        sx={{
          width: 256,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 256,
            boxSizing: 'border-box',
            top: {
              xs: '0', 
              sm: '6.1rem',  
            },
          },
          display: { xs: 'block', sm: 'block' },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <List sx={{ py: 4 }}>
          <ListItem component="a" href="/" onClick={handleItemClick}>
            <ListItemIcon>
              <MdDashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem component="a" href="/search-by-image" onClick={handleItemClick}>
            <ListItemIcon>
              <FaImage />
            </ListItemIcon>
            <ListItemText primary="Search By Image" />
          </ListItem>
          <ListItem component="a" href="/search-by-pdf" onClick={handleItemClick}>
            <ListItemIcon>
              <FaFilePdf />
            </ListItemIcon>
            <ListItemText primary="Search By PDF" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default Sidebar;

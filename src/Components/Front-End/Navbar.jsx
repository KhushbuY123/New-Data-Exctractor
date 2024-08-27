import React from 'react';
import { FaUser } from "react-icons/fa";
import logo from './logo.png';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  '&:hover': {
    backgroundColor: theme.palette.grey[700],
  },
}));

const Navbar = () => {
  return (
    <>
    <StyledAppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button href="/" sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: 'auto', width: 150, objectFit:"cover" }}
          />
        </Button>
        <StyledIconButton
          edge="end"
          aria-label="user menu"
          id="user-menu-button"
          aria-expanded="false"
        >
          <FaUser size={15} color="white" />
        </StyledIconButton>
      </Toolbar>
    </StyledAppBar>
    </>
  );
};

export default Navbar;

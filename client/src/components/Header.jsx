import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { isTokenExpired, clearAuthState } from '../utils/axios';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #1C1C1C;
  padding: 1rem 0;
  width: 100%;
  position: relative;
`;

const Nav = styled.nav`
  background-color: #ffffff;
  border-radius: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NavContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const CenterTitle = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.7rem;
  font-weight: bold;
  font-style: italic;
  color: #1C1C1C;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #1C1C1C;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MenuIcon = styled.div`
  width: 30px;
  height: 3px;
  background-color: #1C1C1C;
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 3px;
    background-color: #1C1C1C;
    transition: transform 0.3s ease;
  }

  &::before {
    transform: translateY(-10px);
  }

  &::after {
    transform: translateY(10px);
  }

  ${props => props.isOpen && `
    background-color: transparent;

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  `}
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Periodically check token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      try {
        const token = localStorage.getItem('token');
        
        // Only check if token exists (don't log warnings for no token)
        if (token) {
          // Check if token is expired
          if (isTokenExpired(token)) {
            console.log('Token expired during active session, logging out');
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        // Don't auto-logout on error checking the token - could be temporary
      }
    };
    
    // Check token on component mount
    checkTokenExpiration();
    
    // Set up interval to check token every minute
    const tokenCheckInterval = setInterval(checkTokenExpiration, 60000);
    
    return () => clearInterval(tokenCheckInterval);
  }, []);

  const handleLogout = () => {
    try {
      console.log('Logging out user');
      dispatch(logout());
      clearAuthState();
      navigate('/signin');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force navigation to signin even if there was an error
      navigate('/signin');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderContainer>
      <Nav>
        <NavContainer>
          <CenterTitle>
            IOT BASED LIQUID DISPENSER
          </CenterTitle>
          <HamburgerButton onClick={toggleMenu} aria-label="Toggle menu">
            <MenuIcon isOpen={isMenuOpen} />
          </HamburgerButton>
        </NavContainer>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #1C1C1C;
  padding: 1rem 0;
  width: 100%;
  position: relative;
`;

const Nav = styled.nav`
  background-color: #ffffff;
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.div`
  font-size: 1.7rem;
  font-weight: bold;
  font-style: italic;
  color: #1C1C1C;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    padding: 1rem;
    z-index: 100;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 1rem 1rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const NavItem = styled.li`
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  text-align: center;
`;

const NavLink = styled(Link)`
  color: #1C1C1C;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
  display: block;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.active {
    background-color: #4CAF50;
    color: white;
  }
`;

const AuthButton = styled.button`
  background-color: ${props => props.isLogin ? '#4CAF50' : '#f44336'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
  width: 100%;

  &:hover {
    opacity: 0.9;
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
  const { isAuthenticated } = useSelector(state => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <Nav>
        <NavContainer>
          <Title>
            IOT BASED LIQUID DISPENSER
          </Title>
          <HamburgerButton onClick={toggleMenu} aria-label="Toggle menu">
            <MenuIcon isOpen={isMenuOpen} />
          </HamburgerButton>
        </NavContainer>
        
        <NavLinks isOpen={isMenuOpen}>
          {/* Only show Home for non-authenticated users */}
          {!isAuthenticated && (
            <NavItem>
              <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            </NavItem>
          )}
          
          {isAuthenticated ? (
            <>
              <NavItem>
                <NavLink 
                  to="/report" 
                  onClick={closeMenu}
                  className={location.pathname === '/report' ? 'active' : ''}
                >
                  Dashboard
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink 
                  to="/consumption" 
                  onClick={closeMenu}
                  className={location.pathname === '/consumption' ? 'active' : ''}
                >
                  Consumption
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink 
                  to="/live-data" 
                  onClick={closeMenu}
                  className={location.pathname === '/live-data' ? 'active' : ''}
                >
                  Live Data
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink 
                  to="/profile" 
                  onClick={closeMenu}
                  className={location.pathname === '/profile' ? 'active' : ''}
                >
                  Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <AuthButton onClick={handleLogout} isLogin={false}>
                  Sign Out
                </AuthButton>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink 
                  to="/signin" 
                  onClick={closeMenu}
                  className={location.pathname === '/signin' ? 'active' : ''}
                >
                  Sign In
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink 
                  to="/signup" 
                  onClick={closeMenu}
                  className={location.pathname === '/signup' ? 'active' : ''}
                >
                  Sign Up
                </NavLink>
              </NavItem>
            </>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

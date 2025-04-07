import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import UserInfo from './UserInfo';
import YearlyReport from './Live_data';
import TotalReport from './Consumption';
import Profile from './Profile';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: 'Arial, sans-serif';
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  background-color: #ffffff;
  height: calc(100vh - 60px);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 60px;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  width: 200px;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    z-index: 999;
    width: 250px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 60px);
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  background-color: #f4f4f4;
`;

const NavButton = styled.button`
  width: 100%;
  padding: 15px 0;
  margin-bottom: 1rem;
  background-color: ${props => props.active ? '#004080' : '#007bff'};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: white;
  position: relative;
  
  &:hover {
    background-color: #0056b3;
    transform: scale(1.02);
  }
`;

const SignOutButton = styled.button`
  width: 100%;
  padding: 15px 0;
  background-color: #dc3545;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #c82333;
    transform: scale(1.02);
  }
`;

const Overlay = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
`;

function Report() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('UserInfo');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleSignOut = async () => {
    dispatch(logout());
    navigate('/');
  };

  const handleButtonClick = (menu) => {
    setActiveMenu(menu);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <Container>
      <Overlay isOpen={isSidebarOpen && isMobile} onClick={() => setIsSidebarOpen(false)} />
      
      <MainContent>
        <Sidebar isOpen={isSidebarOpen || !isMobile}>
          <NavButton
            active={activeMenu === 'Profile'}
            onClick={() => handleButtonClick('Profile')}
            className="sidebar-button"
          >
            Profile
          </NavButton>
          <NavButton
            active={activeMenu === 'UserInfo'}
            onClick={() => handleButtonClick('UserInfo')}
            className="sidebar-button"
          >
            User Info
          </NavButton>
          <NavButton
            active={activeMenu === 'ConsumptionAnalysis'}
            onClick={() => handleButtonClick('ConsumptionAnalysis')}
            className="sidebar-button"
          >
            Consumption Analysis
          </NavButton>
          <NavButton
            active={activeMenu === 'LiveMenu'}
            onClick={() => handleButtonClick('LiveMenu')}
            className="sidebar-button"
          >
            Live Menu
          </NavButton>
          <SignOutButton
            onClick={handleSignOut}
            className="signout-button"
          >
            Sign Out
          </SignOutButton>
        </Sidebar>

        <Content>
          {activeMenu === 'LiveMenu' && <YearlyReport />}
          {activeMenu === 'UserInfo' && <UserInfo />}
          {activeMenu === 'ConsumptionAnalysis' && <TotalReport />}
          {activeMenu === 'Profile' && <Profile />}
        </Content>
      </MainContent>
    </Container>
  );
}

export default Report;

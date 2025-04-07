import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import api from '../utils/axios';
import styled from 'styled-components';

// Function to get token from cookies
const getTokenFromCookies = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('token=')) {
      return cookie.substring(6);
    }
  }
  return null;
};

const TableContainer = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  overflow-x: auto;
  overflow-y: auto;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    height: calc(100vh - 250px);
    margin: 5px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; // Ensure table doesn't get too narrow on mobile

  @media (max-width: 768px) {
    min-width: 800px; // Allow horizontal scrolling on mobile
  }
`;

const TableHeader = styled.th`
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const TableCell = styled.td`
  border: 1px solid #dee2e6;
  padding: 10px;
  font-size: 14px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 12px;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  @media (max-width: 768px) {
    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const UserInfo = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching data from /records endpoint');
        const response = await api.get('/records');
        console.log('API Response:', response);
        
        if (response.data) {
          setTableData(response.data);
          setFilteredData(response.data);
        } else {
          console.error('No data received from API');
          setError('No data available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {
          console.error('Error response:', error.response);
          if (error.response.status === 401) {
            setError('Session expired. Please sign in again.');
            localStorage.removeItem('token');
            window.location.href = '/signin';
          } else {
            setError(error.response.data?.message || 'Error fetching data');
          }
        } else {
          setError('Network error. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(tableData);
    } else {
      const filtered = tableData.filter(record => 
        record.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.deviceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.phoneNo?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, tableData]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const styles = {
    searchSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
      position: 'relative',
      marginBottom: '10px',
      overflow: 'hidden',
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '400px',
      zIndex: 100,
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      marginBottom: '10px',

      '@media (max-width: 768px)': {
        padding: '8px',
        marginBottom: '5px',
      }
    },
    searchInput: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '6px',
      border: '1px solid #ced4da',
      outline: 'none',
      transition: 'border-color 0.3s',
      textAlign: 'center',

      '@media (max-width: 768px)': {
        padding: '8px',
        fontSize: '14px',
      }
    }
  };

  return (
    <div style={styles.searchSection}>
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search"
          style={styles.searchInput}
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      
      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading data...</div>}
      
      {error && (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          Error: {error}
        </div>
      )}
      
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>S.No</TableHeader>
              <TableHeader>Date & Time</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Username</TableHeader>
              <TableHeader>Device ID</TableHeader>
              <TableHeader>Phone No</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((record, index) => (
                <TableRow key={record._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {record.datetime ? moment(record.datetime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                  </TableCell>
                  <TableCell>{record.location || 'N/A'}</TableCell>
                  <TableCell>{record.username || 'N/A'}</TableCell>
                  <TableCell>{record.deviceId || 'N/A'}</TableCell>
                  <TableCell>{record.phoneNo || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <TableCell colSpan="6" style={{ textAlign: 'center' }}>No data found</TableCell>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserInfo;

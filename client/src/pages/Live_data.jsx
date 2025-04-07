import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import LoadingSpinner from '../components/LoadingSpinner';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  position: relative;
  margin-bottom: 10px;
  padding: 0 10px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0 5px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    padding: 8px;
    gap: 10px;
    margin-bottom: 5px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ced4da;
  outline: none;
  transition: border-color 0.3s;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const TableContainer = styled.div`
  border: 2px solid #008000;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #f0f8ff;
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  height: calc(100vh - 200px);

  @media (max-width: 768px) {
    padding: 10px;
    margin: 0 5px 20px 5px;
    height: calc(100vh - 250px);
  }
`;

const Table = styled.table`
  border: 1px solid #000;
  border-collapse: collapse;
  margin: 0 auto;
  width: 100%;
  min-width: 800px;

  @media (max-width: 768px) {
    min-width: 1000px;
  }
`;

const Th = styled.th`
  background-color: #d9e6f2;
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 6px;
    font-size: 12px;
  }
`;

const Td = styled.td`
  border: 1px solid #000;
  padding: 8px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 6px;
    font-size: 12px;
  }
`;

const DownloadButton = styled.div`
  background-color: ${props => props.isHovered ? '#005700' : 'white'};
  color: black;
  border: 2px solid #008000;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    background-color: #005700;
    color: white;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
    margin-top: 5px;
  }
`;

const Live_data = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    setLoading(true);
    axios.get('https://iotdevice.apdp.co.in/api/reports')
      .then(response => {
        const filtered = filterLastYearData(response.data);
        setTableData(filtered);
        setFilteredData(filtered);
        setError(null);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
        setError('Failed to load data. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filterLastYearData = (data) => {
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365); // Filter data from the last 365 days

    return data
      .filter(item => new Date(item.datetime) >= oneYearAgo) // Filter last year's data
      .sort((a, b) => new Date(b.datetime) - new Date(a.datetime)); // Sort in reverse chronological order
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterTableData(query);
  };

  const filterTableData = (query) => {
    if (!query.trim()) {
      // If the query is empty, reset to show all data
      setFilteredData(tableData);
      return;
    }

    const filtered = tableData.filter(item => {
      const deviceId = item.deviceId ? String(item.deviceId).toLowerCase() : '';
      return deviceId.includes(query.toLowerCase()); // Changed to includes for better UX
    });

    setFilteredData(filtered);
  };

  const handleDownloadClick = () => {
    document.getElementById('test-table-xls-button').click();
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <Container>
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <SearchBox>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Device ID"
        />
      </SearchBox>
      
      <TableContainer>
        <Table id="table-to-xls">
          <thead>
            <tr>
              <Th>S.No</Th>
              <Th>Device ID</Th>
              <Th>DateTime</Th>
              <Th>HandWash (500ml)</Th>
              <Th>BodyWash (500ml)</Th>
              <Th>Shampoo (500ml)</Th>
              <Th>HandWash (250ml)</Th>
              <Th>BodyWash (250ml)</Th>
              <Th>Shampoo (250ml)</Th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{row.deviceId}</Td>
                  <Td>{new Date(row.datetime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</Td>
                  <Td>{row.handWash500 < 0 ? 0 : row.handWash500}</Td>
                  <Td>{row.bodyWash500 < 0 ? 0 : row.bodyWash500}</Td>
                  <Td>{row.shampoo500 < 0 ? 0 : row.shampoo500}</Td>
                  <Td>{row.handWash250 < 0 ? 0 : row.handWash250}</Td>
                  <Td>{row.bodyWash250 < 0 ? 0 : row.bodyWash250}</Td>
                  <Td>{row.shampoo250 < 0 ? 0 : row.shampoo250}</Td>
                </tr>
              ))
            ) : (
              <tr>
                <Td colSpan="9" style={{ textAlign: 'center' }}>No data found</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>

      <DownloadButton
        isHovered={isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleDownloadClick}
      >
        Download Excel
      </DownloadButton>

      <div style={{ display: 'none' }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="yearly_report"
          sheet="YearlyReport"
          buttonText="Download as XLS"
        />
      </div>
    </Container>
  );
};

export default Live_data;

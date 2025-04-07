import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import moment from 'moment-timezone';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    padding: 0 20px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 0 10px;
        margin-top: 10px;
    }
`;

const SearchSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0.5rem 0;
    margin-bottom: 10px;
    max-height: 100px;

    @media (max-width: 768px) {
        padding: 0.3rem 0;
        max-height: 80px;
    }
`;

const SearchBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    max-width: 800px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 10px;
    flex-wrap: wrap;
    max-height: 80px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding: 8px;
        max-height: 120px;
    }
`;

const SearchInput = styled.input`
    flex: 3;
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
    outline: none;
    text-align: center;
    width: 100%;
    max-width: 200px;

    @media (max-width: 768px) {
        max-width: 100%;
        padding: 8px;
        font-size: 14px;
    }
`;

const SearchSelect = styled.select`
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
    outline: none;
    text-align: center;
    background-color: white;
    width: 100%;
    max-width: 150px;

    @media (max-width: 768px) {
        max-width: 100%;
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
    max-width: 1000px;
    overflow-x: auto;
    margin-top: 10px;
    -webkit-overflow-scrolling: touch;
    height: calc(100vh - 250px);

    @media (max-width: 768px) {
        padding: 10px;
        margin: 5px;
        height: calc(100vh - 300px);
    }
`;

const DownloadButton = styled.button`
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
    border: 1px solid #000;
    padding: 12px;
    background-color: #d9e6f2;
    text-align: center;
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 1;

    @media (max-width: 768px) {
        padding: 8px;
        font-size: 12px;
    }
`;

const Td = styled.td`
    border: 1px solid #000;
    padding: 12px;
    text-align: center;

    @media (max-width: 768px) {
        padding: 8px;
        font-size: 12px;
    }
`;

const Consumption = () => {
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [yearly, setYearly] = useState('');
    const [monthly, setMonthly] = useState('');
    const [weekly, setWeekly] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://iotdevice.apdp.co.in/api/reports/');
                const aggregatedData = response.data.reduce((acc, item) => {
                    const { deviceId, handWash500, handWash250, bodyWash500, bodyWash250, shampoo500, shampoo250, datetime } = item;

                    const handWashTotal = (handWash500 + handWash250);
                    const bodyWashTotal = (bodyWash500 + bodyWash250);
                    const shampooTotal = (shampoo500 + shampoo250);

                    if (!acc[deviceId]) {
                        acc[deviceId] = {
                            deviceId,
                            datetime: moment(datetime).tz('Asia/Kolkata').format('YYYY-MM-DD'),
                            handWashTotal: (handWashTotal / 1000).toFixed(3),
                            bodyWashTotal: (bodyWashTotal / 1000).toFixed(3),
                            shampooTotal: (shampooTotal / 1000).toFixed(3),
                        };
                    } else {
                        acc[deviceId].handWashTotal = (parseFloat(acc[deviceId].handWashTotal) + handWashTotal / 1000).toFixed(3);
                        acc[deviceId].bodyWashTotal = (parseFloat(acc[deviceId].bodyWashTotal) + bodyWashTotal / 1000).toFixed(3);
                        acc[deviceId].shampooTotal = (parseFloat(acc[deviceId].shampooTotal) + shampooTotal / 1000).toFixed(3);
                    }
                    return acc;
                }, {});

                setTableData(Object.values(aggregatedData));
                setError(null);
            } catch (error) {
                console.error('There was an error fetching the data!', error);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Only filter data if there's a search query
        if (searchQuery || yearly || monthly || weekly) {
            filterTableData(tableData, searchQuery, yearly, monthly, weekly);
        } else {
            setFilteredData([]);
        }
    }, [searchQuery, yearly, monthly, weekly, tableData]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleYearlyChange = (year) => {
        setYearly(year);
    };

    const handleMonthlyChange = (month) => {
        setMonthly(month);
    };

    const handleWeeklyChange = (week) => {
        setWeekly(week);
    };

    const filterTableData = (data, query, year, month, week) => {
        let filtered = data;

        if (query) {
            filtered = filtered.filter(item => {
                const deviceId = item.deviceId ? String(item.deviceId).toLowerCase() : '';
                return deviceId === query.toLowerCase();
            });
        }

        if (year) {
            filtered = filtered.filter(item => {
                const itemYear = moment(item.datetime).format('YYYY');
                return itemYear === year.split('-')[0];
            });
        }

        if (month && month !== "Null") {
            filtered = filtered.filter(item => {
                const itemMonth = moment(item.datetime).format('MMMM');
                return itemMonth === month;
            });
        }

        if (week && week !== "Null") {
            const weekNumber = parseInt(week.split(' ')[1], 10);
            const itemMonth = moment().month(month).month();
            
            filtered = filtered.filter(item => {
                const itemDate = moment(item.datetime);
                const itemYear = itemDate.year();
                const itemMonth = itemDate.month();

                if (itemYear !== parseInt(year.split('-')[0]) || itemMonth !== itemMonth) {
                    return false;
                }

                const dayOfMonth = itemDate.date();

                let calculatedWeekNumber;
                if (dayOfMonth >= 1 && dayOfMonth <= 7) {
                    calculatedWeekNumber = 1;
                } else if (dayOfMonth >= 8 && dayOfMonth <= 14) {
                    calculatedWeekNumber = 2;
                } else if (dayOfMonth >= 15 && dayOfMonth <= 21) {
                    calculatedWeekNumber = 3;
                } else if (dayOfMonth >= 22 && dayOfMonth <= 28) {
                    calculatedWeekNumber = 4;
                } else if (dayOfMonth >= 29) {
                    calculatedWeekNumber = 5;
                } else {
                    calculatedWeekNumber = null;
                }

                return calculatedWeekNumber === weekNumber;
            });
        }

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
            <SearchSection>
                <SearchBox>
                    <SearchInput
                        type="text"
                        placeholder="Search by Device ID"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <SearchSelect
                        value={yearly}
                        onChange={(e) => handleYearlyChange(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {/* Add your year options here */}
                    </SearchSelect>
                    <SearchSelect
                        value={monthly}
                        onChange={(e) => handleMonthlyChange(e.target.value)}
                    >
                        <option value="">Select Month</option>
                        {/* Add your month options here */}
                    </SearchSelect>
                    <SearchSelect
                        value={weekly}
                        onChange={(e) => handleWeeklyChange(e.target.value)}
                    >
                        <option value="">Select Week</option>
                        {/* Add your week options here */}
                    </SearchSelect>
                </SearchBox>
            </SearchSection>

            <TableContainer>
                <Table id="test-table-xls">
                    <thead>
                        <tr>
                            <Th>Device ID</Th>
                            <Th>Date</Th>
                            <Th>Hand Wash (L)</Th>
                            <Th>Body Wash (L)</Th>
                            <Th>Shampoo (L)</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {(filteredData.length > 0 ? filteredData : tableData).map((item, index) => (
                            <tr key={index}>
                                <Td>{item.deviceId}</Td>
                                <Td>{item.datetime}</Td>
                                <Td>{item.handWashTotal}</Td>
                                <Td>{item.bodyWashTotal}</Td>
                                <Td>{item.shampooTotal}</Td>
                            </tr>
                        ))}
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

            <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="test-table-xls"
                filename="consumption_data"
                sheet="Consumption Data"
                buttonText="Download as XLS"
                style={{ display: 'none' }}
            />
        </Container>
    );
};

export default Consumption;

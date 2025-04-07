import React from 'react';
import { ClipLoader } from 'react-spinners';
import styled from 'styled-components';

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: ${props => props.fullScreen ? '100vh' : props.minHeight || '200px'};
    width: ${props => props.fullScreen ? '100vw' : '100%'};
    position: ${props => props.fullScreen ? 'fixed' : 'relative'};
    top: 0;
    left: 0;
    background: ${props => props.fullScreen ? 'rgba(255, 255, 255, 0.8)' : 'transparent'};
    z-index: 1000;
    
    @media (max-width: 768px) {
        min-height: ${props => props.fullScreen ? '100vh' : props.minHeight || '150px'};
    }
`;

const LoadingSpinner = ({ 
    fullScreen = false, 
    size = 40, 
    color = '#4CAF50',
    minHeight,
    className
}) => {
    return (
        <SpinnerContainer 
            fullScreen={fullScreen} 
            minHeight={minHeight}
            className={className}
        >
            <ClipLoader
                size={size}
                color={color}
                loading={true}
            />
        </SpinnerContainer>
    );
};

export default LoadingSpinner; 
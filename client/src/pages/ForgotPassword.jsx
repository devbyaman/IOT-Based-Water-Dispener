import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
`;

const FormContainer = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h1`
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    &:focus {
        outline: none;
        border-color: #4CAF50;
    }
`;

const Button = styled.button`
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #45a049;
    }
    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: #ff0000;
    text-align: center;
    margin-top: 1rem;
`;

const SuccessMessage = styled.p`
    color: #4CAF50;
    text-align: center;
    margin-top: 1rem;
`;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resetToken, setResetToken] = useState('');
    const navigate = useNavigate();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/otp/request-reset', { email });
            setStep(2);
            setSuccess('OTP sent to your email');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/otp/verify', { email, otp });
            setResetToken(response.data.resetToken);
            setStep(3);
            setSuccess('OTP verified successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/otp/reset-password', {
                email,
                resetToken,
                newPassword
            });
            setSuccess('Password reset successfully');
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <FormContainer>
                <Title>Reset Password</Title>
                {loading && <LoadingSpinner />}
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}
                
                {step === 1 && (
                    <Form onSubmit={handleRequestOTP}>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" disabled={loading}>
                            Send OTP
                        </Button>
                    </Form>
                )}

                {step === 2 && (
                    <Form onSubmit={handleVerifyOTP}>
                        <Input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <Button type="submit" disabled={loading}>
                            Verify OTP
                        </Button>
                    </Form>
                )}

                {step === 3 && (
                    <Form onSubmit={handleResetPassword}>
                        <Input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                        <Button type="submit" disabled={loading}>
                            Reset Password
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </Container>
    );
};

export default ForgotPassword; 
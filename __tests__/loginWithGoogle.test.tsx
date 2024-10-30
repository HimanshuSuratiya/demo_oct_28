

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGoogleLogin } from '@react-oauth/google';
import LoginWithGoogle from '../components/LoginWithGoogle';
import useLoginStore from '../redux/loginStore';

jest.mock('../redux/loginStore', () => jest.fn());
jest.mock('@react-oauth/google');

describe('LoginWithGoogle Component', () => {
    const mockToggleAuth = jest.fn();
    const mockSetAccessToken = jest.fn();

    beforeEach(() => {
        useLoginStore.mockImplementation(() => ({
            toggleAuth: mockToggleAuth,
            setAccessToken: mockSetAccessToken,
        }));
        jest.clearAllMocks();
    });

    test('renders the login button', () => {
        render(<LoginWithGoogle />);
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('calls login function on button click', () => {
        const mockLogin = jest.fn();
        useGoogleLogin.mockReturnValue(mockLogin);
        render(<LoginWithGoogle />);
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(mockLogin).toHaveBeenCalled();
    });

    // test('handles successful login with Google', () => {
    //     const mockLogin = jest.fn();
    //     useGoogleLogin.mockReturnValue(mockLogin);

    //     // Simulate successful login response
    //     const mockTokenResponse = { access_token: 'mockAccessToken' };
    //     mockLogin.mockImplementation((options) => {
    //         console.log(options)
    //         options.onSuccess(mockTokenResponse);
    //     });

    //     render(<LoginWithGoogle />);
    //     fireEvent.click(screen.getByRole('button', { name: /login/i }));

    //     // Assertions
    //     expect(mockToggleAuth).toHaveBeenCalled();
    //     expect(mockSetAccessToken).toHaveBeenCalledWith(mockTokenResponse.access_token);
    // });

});

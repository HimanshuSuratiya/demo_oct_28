import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@/pages/App';
import useLoginStore from '../redux/loginStore';
import useUserStore from '../redux/userStore';
import useFetchUser from '../hooks/useFetchUser';
import dayjs from 'dayjs';

jest.mock('../redux/loginStore');
jest.mock('../redux/userStore');
jest.mock('../hooks/useFetchUser');
jest.mock('../components/DatePicker', () => ({ setDate }) => (
    <input
        type="date"
        onChange={(e) => setDate(dayjs(e.target.value).toDate())}
    />
));
jest.mock('../components/LoginWithGoogle', () => () => <div>Login with Google</div>);
jest.mock('../components/Events', () => ({ date }) => <div>Events for {dayjs(date).format('YYYY-MM-DD')}</div>);
jest.mock('../components/CreateEventForm', () => () => <div>Create Event Form</div>);

describe('App Component', () => {
    beforeEach(() => {
        useFetchUser.mockImplementation(() => { });
    });

    test('renders login view when user is not authenticated', () => {
        useLoginStore.mockReturnValue({ isAuthenticated: false, clearLogin: jest.fn() });
        useUserStore.mockReturnValue({ name: '', email: '' });
        render(<App />);
        expect(screen.getByText('Login with Google')).toBeInTheDocument();
        expect(screen.getByText('Login to view events.')).toBeInTheDocument();
    });

    test('renders authenticated view with user information', () => {
        useLoginStore.mockReturnValue({ isAuthenticated: true, clearLogin: jest.fn() });
        useUserStore.mockReturnValue({ name: 'John Doe', email: 'john.doe@example.com' });
        render(<App />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('triggers clearLogin when logout button is clicked', () => {
        const clearLoginMock = jest.fn();
        useLoginStore.mockReturnValue({ isAuthenticated: true, clearLogin: clearLoginMock });
        useUserStore.mockReturnValue({ name: 'John Doe', email: 'john.doe@example.com' });
        render(<App />);
        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);
        expect(clearLoginMock).toHaveBeenCalledTimes(1);
    });

    test('renders events when user is authenticated', () => {
        useLoginStore.mockReturnValue({ isAuthenticated: true, clearLogin: jest.fn() });
        useUserStore.mockReturnValue({ name: 'John Doe', email: 'john.doe@example.com' });
        render(<App />);
        expect(screen.getByText((content, element) => {
            return content.includes('Events for') && element.tagName.toLowerCase() === 'div';
        })).toBeInTheDocument();
    });


    test('displays "Create Event Form" component', () => {
        useLoginStore.mockReturnValue({ isAuthenticated: true, clearLogin: jest.fn() });
        useUserStore.mockReturnValue({ name: 'John Doe', email: 'john.doe@example.com' });
        render(<App />);
        expect(screen.getByText('Create Event Form')).toBeInTheDocument();
    });


    test('renders Events component with selected date', () => {
        useLoginStore.mockReturnValue({ isAuthenticated: true, clearLogin: jest.fn() });
        useUserStore.mockReturnValue({ name: 'John Doe', email: 'john.doe@example.com' });
        render(<App />);
        expect(screen.getByText(`Events for ${dayjs().format('YYYY-MM-DD')}`)).toBeInTheDocument();
    });

    test('clearLogin is not called when logout button is not clicked', () => {
        const clearLoginMock = jest.fn();
        useLoginStore.mockReturnValue({ isAuthenticated: true, clearLogin: clearLoginMock });
        useUserStore.mockReturnValue({ name: 'John Doe', email: 'john.doe@example.com' });
        render(<App />);
        expect(clearLoginMock).not.toHaveBeenCalled();
    });
});
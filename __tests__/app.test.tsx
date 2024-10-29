import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@/pages/App';
import useLoginStore from "../redux/loginStore";
import useUserStore from "../redux/userStore";
import useFetchUser from "../hooks/useFetchUser";
import dayjs from 'dayjs';

// Mock dependencies
jest.mock("../components/DatePicker", () => ({ setDate }: { setDate: (date: Date) => void; }) => (
    <input
        data-testid="date-picker"
        type="date"
        onChange={(e) => setDate(dayjs(e.target.value).toDate())}
    />
));
jest.mock("../components/Events", () => ({ date }: { date: Date; }) => <div data-testid="events">Events for {date.toDateString()}</div>);
jest.mock("../components/LoginWithGoogle", () => () => <button>Login with Google</button>);
jest.mock("../components/CreateEventForm", () => () => <div data-testid="create-event-form">Create Event Form</div>);
jest.mock("../redux/loginStore", () => jest.fn());
jest.mock("../redux/userStore", () => jest.fn());
jest.mock("../hooks/useFetchUser", () => jest.fn());

describe('App Component', () => {
    beforeEach(() => {
        useFetchUser.mockImplementation(() => { });
    });

    test('renders login button when not authenticated', () => {
        useLoginStore.mockReturnValue({ isAuthenticated: false });
        useUserStore.mockReturnValue({ name: '', email: '' });
        render(<App />);
        expect(screen.getByText('Login with Google')).toBeInTheDocument();
    });

    test('renders user information and logout button when authenticated', () => {
        useLoginStore.mockReturnValue({ isAuthenticated: true, clearLogin: jest.fn() });
        useUserStore.mockReturnValue({ name: 'Himanshu Suratiya', email: 'Himanshu84688@gmail.com' });
        render(<App />);
        expect(screen.getByText('Himanshu Suratiya')).toBeInTheDocument();
        expect(screen.getByText('Himanshu84688@gmail.com')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });

    test('calls clearLogin on logout button click', () => {
        const clearLoginMock = jest.fn();
        useLoginStore.mockReturnValue({ isAuthenticated: true, clearLogin: clearLoginMock });
        useUserStore.mockReturnValue({ name: 'Himanshu Suratiya', email: 'Himanshu84688@gmail.com' });
        render(<App />);
        const logoutButton = screen.getByRole('button', { name: /Logout/i });
        fireEvent.click(logoutButton);
        expect(clearLoginMock).toHaveBeenCalledTimes(1);
    });

    test('renders date picker and create event form', () => {
        useLoginStore.mockReturnValue({ isAuthenticated: true });
        useUserStore.mockReturnValue({ name: 'Himanshu Suratiya', email: 'Himanshu84688@gmail.com' });
        render(<App />);
        expect(screen.getByTestId('date-picker')).toBeInTheDocument();
        expect(screen.getByTestId('create-event-form')).toBeInTheDocument();
    });

    test('displays events based on selected date when authenticated', () => {
        useLoginStore.mockReturnValue({ isAuthenticated: true });
        useUserStore.mockReturnValue({ name: 'Himanshu Suratiya', email: 'Himanshu84688@gmail.com' });
        render(<App />);
        const datePicker = screen.getByTestId('date-picker');
        fireEvent.change(datePicker, { target: { value: '2023-10-10' } });
        expect(screen.getByTestId('events')).toHaveTextContent('Events for Tue Oct 10 2023');
    });

    test('displays "Login to view events" message when not authenticated', () => {
        useLoginStore.mockReturnValue({ isAuthenticated: false });
        useUserStore.mockReturnValue({ name: '', email: '' });
        render(<App />);
        expect(screen.getByText('Login to view events.')).toBeInTheDocument();
    });
});

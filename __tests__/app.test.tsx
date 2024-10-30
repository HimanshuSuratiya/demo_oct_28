import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@/pages/app';
import useLoginStore from '../redux/loginStore';
import useFetchUser from '../hooks/useFetchUser';

jest.mock('../components/DatePicker', () => () => (
  <div>DatePicker Component</div>
));

jest.mock('../components/LoginWithGoogle', () => () => (
  <div>LoginWithGoogle Component</div>
));

jest.mock('../components/Events', () => () => (
  <div>Events Component</div>
));

jest.mock('../redux/loginStore');
jest.mock('../hooks/useFetchUser');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user information and logout button when user is authenticated', () => {
    useLoginStore.mockReturnValue({ isAuthenticated: true, clearLogin: jest.fn() });
    useFetchUser.mockReturnValue({ name: 'Himanshu Suratiya', email: 'himanshu84688@gmail.com' });
    render(<App />);
    expect(screen.getByText('Himanshu Suratiya')).toBeInTheDocument();
    expect(screen.getByText('himanshu84688@gmail.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('calls clearLogin on clicking logout button', () => {
    const mockClearLogin = jest.fn();
    const mockUseLoginStore = jest.fn();

    mockUseLoginStore.mockReturnValueOnce({ isAuthenticated: true, clearLogin: mockClearLogin });
    useLoginStore.mockImplementation(mockUseLoginStore);
    useFetchUser.mockReturnValue({ name: 'Himanshu Suratiya', email: 'himanshu84688@gmail.com' });

    const { rerender } = render(<App />);
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    mockUseLoginStore.mockReturnValueOnce({ isAuthenticated: false, clearLogin: mockClearLogin });
    rerender(<App />);
    expect(mockClearLogin).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Himanshu Suratiya')).not.toBeInTheDocument();
    expect(screen.queryByText('himanshu84688@gmail.com')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  test('displays a prompt to login to view events when user is not authenticated', () => {
    useLoginStore.mockReturnValue({ isAuthenticated: false, clearLogin: jest.fn() });
    useFetchUser.mockReturnValue({ name: '', email: '' });
    render(<App />);
    expect(screen.getByText(/login to view events/i)).toBeInTheDocument();
  });
});

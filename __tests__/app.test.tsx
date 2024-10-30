import {render, screen, fireEvent, renderHook, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/pages/home';
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

jest.mock('../hooks/useFetchUser');

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user information and logout button when user is authenticated', () => {
    const {result} = renderHook(() => useLoginStore());
    if (!result.current.isAuthenticated) {
      act(() => {
        result.current.toggleAuth();
      });
    }
    expect(result.current.isAuthenticated).toBe(true);
    useFetchUser.mockReturnValue({name: 'Himanshu Suratiya', email: 'himanshu84688@gmail.com'});
    render(<Home/>);
    expect(screen.getByText('Himanshu Suratiya')).toBeInTheDocument();
    expect(screen.getByText('himanshu84688@gmail.com')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /logout/i})).toBeInTheDocument();
  });

  test('calls clearLogin on clicking logout button', () => {
    const {result} = renderHook(() => useLoginStore());
    if (!result.current.isAuthenticated) {
      act(() => {
        result.current.toggleAuth();
      });
    }
    expect(result.current.isAuthenticated).toBe(true);
    const {rerender} = render(<Home/>);
    useFetchUser.mockReturnValue({name: 'Himanshu Suratiya', email: 'himanshu84688@gmail.com'});
    rerender(<Home/>);
    expect(screen.queryByText('Himanshu Suratiya')).toBeInTheDocument();
    expect(screen.queryByText('himanshu84688@gmail.com')).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /logout/i})).toBeInTheDocument();
    const logoutButton = screen.getByRole('button', {name: /logout/i});
    fireEvent.click(logoutButton);
    expect(screen.queryByText('Himanshu Suratiya')).not.toBeInTheDocument();
    expect(screen.queryByText('himanshu84688@gmail.com')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /logout/i})).not.toBeInTheDocument();
  });

  test('displays a prompt to login to view events when user is not authenticated', () => {
    const {result} = renderHook(() => useLoginStore());
    if (result.current.isAuthenticated) {
      act(() => {
        result.current.toggleAuth();
      });
    }
    expect(result.current.isAuthenticated).toBe(false);
    useFetchUser.mockReturnValue({name: '', email: ''});
    render(<Home/>);
    expect(screen.getByText(/login to view events/i)).toBeInTheDocument();
  });
});

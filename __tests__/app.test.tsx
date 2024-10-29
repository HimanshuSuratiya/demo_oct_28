import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@/pages/App';
import useLoginStore from '../redux/loginStore';
import useFetchUser from '../hooks/useFetchUser';
import dayjs from 'dayjs';

jest.mock('../components/DatePicker', () => ({setDate}) => (
  <input
    type="date"
    onChange={(e) => setDate(new Date(e.target.value))}
    data-testid="date-picker"
  />
));
jest.mock('../components/LoginWithGoogle', () => () => (
  <button data-testid="login-with-google">Login with Google</button>
));
jest.mock('../components/Events', () => ({date}) => (
  <div data-testid="events">Events for date: {dayjs(date).format('YYYY-MM-DD')}</div>
));
jest.mock('../components/CreateEventForm', () => () => (
  <div data-testid="create-event-form">Create Event Form</div>
));
jest.mock('../redux/loginStore');
jest.mock('../hooks/useFetchUser');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders LoginWithGoogle component when user is not authenticated', () => {
    useLoginStore.mockReturnValue({isAuthenticated: false, clearLogin: jest.fn()});
    useFetchUser.mockReturnValue({name: '', email: ''});

    render(<App/>);

    expect(screen.getByTestId('login-with-google')).toBeInTheDocument();
    expect(screen.queryByTestId('events')).not.toBeInTheDocument();
  });

  test('renders user information and logout button when user is authenticated', () => {
    useLoginStore.mockReturnValue({isAuthenticated: true, clearLogin: jest.fn()});
    useFetchUser.mockReturnValue({name: 'Himanshu Suratiya', email: 'himanshu84688@gmail.com'});

    render(<App/>);

    expect(screen.getByText('Himanshu Suratiya')).toBeInTheDocument();
    expect(screen.getByText('himanshu84688@gmail.com')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /logout/i})).toBeInTheDocument();
  });

  test('calls clearLogin on clicking logout button', () => {
    const mockClearLogin = jest.fn();
    useLoginStore.mockReturnValue({isAuthenticated: true, clearLogin: mockClearLogin});
    useFetchUser.mockReturnValue({name: 'Himanshu Suratiya', email: 'himanshu84688@gmail.com'});

    render(<App/>);
    
    const logoutButton = screen.getByRole('button', {name: /logout/i});
    fireEvent.click(logoutButton);

    expect(mockClearLogin).toHaveBeenCalledTimes(1);
  });

  test('displays date picker and updates events date when a new date is selected', () => {
    useLoginStore.mockReturnValue({isAuthenticated: true, clearLogin: jest.fn()});
    useFetchUser.mockReturnValue({name: 'Himanshu Suratiya', email: 'himanshu84688@gmail.com'});

    render(<App/>);

    const datePicker = screen.getByTestId('date-picker');
    const newDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

    fireEvent.change(datePicker, {target: {value: newDate}});

    expect(screen.getByTestId('events')).toHaveTextContent(`Events for date: ${newDate}`);
  });

  test('renders CreateEventForm component', () => {
    useLoginStore.mockReturnValue({isAuthenticated: false, clearLogin: jest.fn()});
    useFetchUser.mockReturnValue({name: '', email: ''});

    render(<App/>);

    expect(screen.getByTestId('create-event-form')).toBeInTheDocument();
  });

  test('displays a prompt to login to view events when user is not authenticated', () => {
    useLoginStore.mockReturnValue({isAuthenticated: false, clearLogin: jest.fn()});
    useFetchUser.mockReturnValue({name: '', email: ''});

    render(<App/>);

    expect(screen.getByText(/login to view events/i)).toBeInTheDocument();
  });

  test('does not display events section when user is not authenticated', () => {
    useLoginStore.mockReturnValue({isAuthenticated: false, clearLogin: jest.fn()});
    useFetchUser.mockReturnValue({name: '', email: ''});

    render(<App/>);

    expect(screen.queryByTestId('events')).not.toBeInTheDocument();
  });
});

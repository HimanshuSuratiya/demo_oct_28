import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateEventForm from '../components/CreateEventForm';
import axiosInstance from '../api/axiosInstance';

jest.mock('../api/axiosInstance');

describe('CreateEventForm', () => {
    const originalConsoleError = console.error;

    beforeAll(() => {
        console.error = jest.fn();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the form and submits data', async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: {} });

        render(<CreateEventForm />);
        const button = screen.getByRole('button', { name: /create event/i });
        fireEvent.click(button);
        fireEvent.change(screen.getByLabelText(/summary/i), { target: { value: 'Himanshu Test Event Summary' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Himanshu Test Event Description' } });
        fireEvent.change(screen.getByLabelText(/guest email/i), { target: { value: 'Himanshu84688@gmail.com' } });
        const submitButton = screen.getByTestId('create-event-submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axiosInstance.post).toHaveBeenCalledWith(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                expect.objectContaining({
                    summary: 'Himanshu Test Event Summary',
                    description: 'Himanshu Test Event Description',
                    attendees: expect.arrayContaining([
                        expect.objectContaining({ email: 'Himanshu84688@gmail.com' }),
                    ]),
                })
            );
        });
    });

    test('handles API error gracefully', async () => {
        axiosInstance.post.mockRejectedValueOnce(new Error('API Error'));
        render(<CreateEventForm />);
        const button = screen.getByRole('button', { name: /create event/i });
        fireEvent.click(button);
        fireEvent.change(screen.getByLabelText(/summary/i), { target: { value: 'Himanshu Test Event Summary' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Himanshu Test Event Description' } });
        fireEvent.change(screen.getByLabelText(/guest email/i), { target: { value: 'Himanshu84688@gmail.com' } });
        const submitButton = screen.getByTestId('create-event-submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axiosInstance.post).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledWith('Request failed:', expect.any(Error));
        });
    });

    test('displays form elements correctly', () => {
        render(<CreateEventForm />);
        const button = screen.getByRole('button', { name: /create event/i });
        fireEvent.click(button);
        expect(screen.getByLabelText(/summary/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/guest email/i)).toBeInTheDocument();
        expect(screen.getByTestId('create-event-submit')).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import Events from '../components/Events';
import axiosInstance from '../api/axiosInstance';
import dayjs from 'dayjs';

jest.mock('../api/axiosInstance');
jest.mock('@tanstack/react-query');

describe('Events Component', () => {
    const mockDate = new Date('2024-10-30T00:00:00Z');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state', () => {
        useQuery.mockReturnValue({ isPending: true });
        render(<Events date={mockDate} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders error state', () => {
        useQuery.mockReturnValue({ isError: true });
        render(<Events date={mockDate} />);
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });

    test('renders no events message', () => {
        useQuery.mockReturnValue({ data: { data: { items: [] } } });
        render(<Events date={mockDate} />);
        expect(screen.getByText('No events today!')).toBeInTheDocument();
    });

    test('renders events correctly', () => {
        const mockEvents = {
            data: {
                items: [
                    {
                        summary: 'Meeting with Team',
                        start: { dateTime: '2024-10-30T09:00:00Z' },
                        end: { dateTime: '2024-10-30T10:00:00Z' },
                    },
                    {
                        summary: 'Lunch with Client',
                        start: { dateTime: '2024-10-30T12:00:00Z' },
                        end: { dateTime: '2024-10-30T13:00:00Z' },
                    },
                ],
            },
        };

        axiosInstance.get.mockResolvedValue(mockEvents);
        useQuery.mockReturnValue({ data: mockEvents });

        render(<Events date={mockDate} />);

        expect(screen.getByText("Today's Event")).toBeInTheDocument();
        expect(screen.getByText(`${dayjs('2024-10-30T09:00:00Z').format('hh:mm a')} to ${dayjs('2024-10-30T10:00:00Z').format('hh:mm a')}`)).toBeInTheDocument();
        expect(screen.getByText('Meeting with Team')).toBeInTheDocument();
        expect(screen.getByText(`${dayjs('2024-10-30T12:00:00Z').format('hh:mm a')} to ${dayjs('2024-10-30T13:00:00Z').format('hh:mm a')}`)).toBeInTheDocument();
        expect(screen.getByText('Lunch with Client')).toBeInTheDocument();
    });
});

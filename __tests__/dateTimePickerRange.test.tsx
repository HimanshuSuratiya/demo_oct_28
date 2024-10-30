import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DateTimePickerRange from '../components/DateTimePickerRange'

jest.mock('react-datetime-picker', () => {
    return function MockDateTimePicker(props: any) {
        return (
            <input
                type="datetime-local"
                data-testid={props.id}
                id={props.id}
                value={props.value ? props.value.toISOString().slice(0, 16) : ''}
                onChange={(e) => props.onChange(new Date(e.target.value + 'Z'))} // Ensure it treats the input as UTC
            />
        )
    }
})

describe('DateTimePickerRange', () => {
    const mockSetDate = jest.fn()
    const initialDate = {
        startDateAndTime: new Date('2023-05-01T09:00:00Z'),
        endDateAndTime: new Date('2023-05-02T17:00:00Z'),
    }

    beforeEach(() => {
        mockSetDate.mockClear()
    })

    test('renders the component with start and end date pickers', () => {
        render(<DateTimePickerRange date={initialDate} setDate={mockSetDate} />)
        expect(screen.getByLabelText('Start Date and Time')).toBeInTheDocument()
        expect(screen.getByLabelText('End Date and Time')).toBeInTheDocument()
    })

    test('displays the correct initial dates', () => {
        render(<DateTimePickerRange date={initialDate} setDate={mockSetDate} />)
        expect(screen.getByTestId('start-date')).toHaveValue('2023-05-01T09:00')
        expect(screen.getByTestId('end-date')).toHaveValue('2023-05-02T17:00')
    })

    test('calls setDate when start date is changed', () => {
        render(<DateTimePickerRange date={initialDate} setDate={mockSetDate} />);
        fireEvent.change(screen.getByTestId('start-date'), { target: { value: '2023-05-03T10:00' } });

        expect(mockSetDate).toHaveBeenCalledWith(expect.any(Function));
        const setDateCallback = mockSetDate.mock.calls[0][0];
        const result = setDateCallback(initialDate);
        expect(result).toEqual(expect.objectContaining({
            startDateAndTime: new Date('2023-05-03T10:00:00Z'),
        }));
    });

    test('calls setDate when end date is changed', () => {
        render(<DateTimePickerRange date={initialDate} setDate={mockSetDate} />);
        fireEvent.change(screen.getByTestId('end-date'), { target: { value: '2023-05-04T18:00' } });

        expect(mockSetDate).toHaveBeenCalledWith(expect.any(Function));
        const setDateCallback = mockSetDate.mock.calls[0][0];
        const result = setDateCallback(initialDate);
        expect(result).toEqual(expect.objectContaining({
            endDateAndTime: new Date('2023-05-04T18:00:00Z'),
        }));
    });

    test('renders with correct labels', () => {
        render(<DateTimePickerRange date={initialDate} setDate={mockSetDate} />)
        expect(screen.getByText('Start Date and Time')).toBeInTheDocument()
        expect(screen.getByText('End Date and Time')).toBeInTheDocument()
    })
})
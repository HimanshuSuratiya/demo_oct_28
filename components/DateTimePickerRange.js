'use client'

import React from 'react'
import DateTimePicker from 'react-datetime-picker'
import { Label } from '@/components/ui/label'
import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'

export default function DateTimePickerRange({ date, setDate }) {
    return (
        <>
            <div className="py-2 px-2 w-[300px] bg-white shadow-md rounded-lg">
                <div className="my-4">
                    <Label htmlFor="start-date" className="block mb-1 font-semibold text-gray-700">Start Date and Time</Label>
                    <DateTimePicker
                        onChange={(e) => {
                            setDate((prevState) => ({
                                ...prevState,
                                startDateAndTime: e
                            }))
                        }}
                        value={date.startDateAndTime}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        id="start-date"
                    />
                </div>
                <div className="my-4">
                    <Label htmlFor="end-date" className="block mb-1 font-semibold text-gray-700">End Date and Time</Label>
                    <DateTimePicker
                        onChange={(e) => {
                            setDate((prevState) => ({
                                ...prevState,
                                endDateAndTime: e
                            }))
                        }}
                        value={date.endDateAndTime}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        id="end-date"
                    />
                </div>
            </div>
        </>
    )
}
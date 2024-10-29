import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "../lib/utils";
import { Label } from "@/components/ui/label";
import { Form, Formik } from "formik";
import { Input } from "@/components/ui/input";
import axiosInstance from "../api/axiosInstance";
// import DatePicker from "@/components/DatePicker";
import DateTimePickerRange from './DateTimePickerRange';

const CreateEventForm = (props) => {
    const [isOpen, setOpen] = useState(false);
    const [date, setDate] = useState({
        startDateAndTime: new Date(),
        endDateAndTime: new Date(),
    })

    async function createGoogleCalendarEvent(values) {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const event = {
            summary: values.summary,
            location: 'Delhi, India',
            description: values.description,
            start: {
                dateTime: date.startDateAndTime?.toISOString(),
                timeZone: timeZone
            },
            end: {
                dateTime: date.endDateAndTime?.toISOString(),
                timeZone: timeZone
            },
            attendees: [
                { email: 'himanshu.suratiya@scalereal.com' },
                { email: values.meetingWith }
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 10 }
                ]
            }
        };

        try {
            await axiosInstance.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', event);
        } catch (error) {
            console.error('Request failed:', error);
        }
    }

    return <Popover open={isOpen} onOpenChange={() => setOpen(!isOpen)}>
        <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                    "justify-start text-left font-normal",
                    "text-muted-foreground"
                )}
            >
                Create Event
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
            <Formik
                initialValues={{ summary: '', description: '', meetingWith: '' }}
                onSubmit={(values) => {
                    createGoogleCalendarEvent(values)
                    setOpen(false)
                }}
            >
                {({ handleChange, values }) => (
                    <Form className="flex flex-col">
                        <Label className="mb-6">Create Event Form</Label>

                        <Label className="mb-2" htmlFor={'summary'}>Summary</Label>
                        <Input className="mb-4" id="summary" onChange={handleChange} value={values.summary} />

                        <Label className="mb-2" htmlFor={'description'}>Description</Label>
                        <Input className="mb-4" id="description" onChange={handleChange} value={values.description} />

                        <Label className="mb-2" htmlFor={'meetingWith'}>Guest Email</Label>
                        <Input className="mb-4" id="meetingWith" onChange={handleChange} value={values.meetingWith} />

                        <Label className="mb-2">Date of Meeting</Label>
                        {/* <DatePicker setDate={setDate}/> */}

                        <DateTimePickerRange date={date} setDate={setDate} />

                        <Button
                            type="submit"
                            variant={"outline"}
                            className="mt-4"
                            data-testid="create-event-submit"
                        >
                            Create Event
                        </Button>
                    </Form>
                )}
            </Formik>
        </PopoverContent>
    </Popover>
}

export default CreateEventForm;
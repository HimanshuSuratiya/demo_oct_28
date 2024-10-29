import React from 'react';
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

const calendarId = 'primary';
const calendarGetEventsUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

const formatData = (date) => {
    return dayjs(date).format('hh:mm a');
}

const Events = ({ date }) => {
    const timeMin = new Date(date).toISOString();
    const timeMax = new Date(new Date(date).setDate(new Date(date).getDate() + 1)).toISOString();

    const { data, isPending, isError } = useQuery({
        queryKey: ['events', date],
        refetchInterval: 3000,
        queryFn: async () => {
            return axiosInstance.get(calendarGetEventsUrl, {
                params: {
                    maxResults: 100,
                    orderBy: 'startTime',
                    singleEvents: true,
                    timeMin: timeMin,
                    timeMax: timeMax,
                },
            })
        }
    })

    if (isError) {
        return <Label className="w-full text-center mt-12 font-bold text-lg">{'Something went wrong!'}</Label>
    }

    if (isPending) {
        return <Label className="w-full text-center mt-12 font-bold text-lg">{'Loading...'}</Label>
    }

    if (data?.data?.items.length === 0) {
        return <Label className="w-full text-center mt-12 font-bold text-lg">{'No events today!'}</Label>
    }

    return <div className="mt-16 flex flex-col w-full">
        <Label className="mb-8">{`Today's Event`}</Label>
        {data?.data?.items.map((event, index) => (
            <div key={event?.start?.dateTime + event?.summary}
                className="border-b border-gray-400 py-4 justify-between flex flex-row"
                style={{ borderTop: index === 0 ? '1px solid rgb(156, 163, 175)' : 'none' }}>
                <Label className="mb-4">{`${formatData(event?.start?.dateTime)} to ${formatData(event?.end?.dateTime)}`}</Label>
                <Label className="mb-4">{event?.summary}</Label>
            </div>
        ))}
    </div>
}

export default Events;
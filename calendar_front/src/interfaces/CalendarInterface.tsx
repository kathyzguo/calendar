export interface CalendarListed {
    calendar_id: number,
    name: string,
    description: string,
    is_default: boolean
    events: Event[];
}

export interface Event {
    event_id: number,
    calendar_id: number,
    name: string,
    description: string,
    start_time: Date,
    end_time?: Date,
    all_day: boolean,
    recurrence: string,
    recurrence_start?: Date
    recurrence_end?: Date 
}

export interface EventJSON {
    id: number,
    calendar_id: number,
    name: string,
    description: string,
    start_time: string,
    end_time: string,
    all_day: boolean,
    recurrence: string,
    recurrence_start: string
    recurrence_end: string
    created_at: string,
    updated_at: string
}

export interface CalendarCreate {
    calendar_id: number,
    user_id: number,
    name: string,
    description: string,
    is_default: boolean
}

export interface EventCreateS {
    event_id: number,
    calendar_id: number,
    name: string,
    description: string,
    start_date: string,
    start_time: string,
    end_date: string,
    end_time: string,
    all_day: boolean,
    recurrence: string,
    re_date: string,
}
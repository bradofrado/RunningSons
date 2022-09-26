import dayjs from 'dayjs';

export function Copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function date(date) {
    return dayjs.utc(date).format('MM/DD/YYYY')
}

export function toUtc(date) {
    const d = dayjs.utc(date).format();
    console.log(d);
    
    return d;
}
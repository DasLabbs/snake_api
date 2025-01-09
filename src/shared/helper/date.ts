export const getMondayStartOfWeek = (): number => {
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now.setDate(now.getDate() + diff));
    monday.setHours(0, 0, 0, 0);
    return monday.getTime();
};

export const getFriday6pmOfWeek = (): number => {
    const now = new Date();
    const day = now.getDay();
    const diff = day <= 5 ? 5 - day : 5 - day + 7;
    const friday = new Date(now.setDate(now.getDate() + diff));
    friday.setHours(18, 0, 0, 0);
    return friday.getTime();
};

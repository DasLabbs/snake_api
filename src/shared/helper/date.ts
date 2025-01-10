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
    const day = now.getDay(); // Current day of the week (0 = Sunday, 6 = Saturday)
    const hour = now.getHours(); // Current hour

    // Calculate the difference to the last Friday
    const diff = day === 5 && hour >= 18 ? 0 : day === 0 ? 2 : day + 2; // If today is Friday but before 6 PM, go back to last week

    const lastFriday = new Date(now.setDate(now.getDate() - diff));
    // Set time to 6:00 PM
    lastFriday.setHours(18, 0, 0, 0);
    return lastFriday.getTime();
};

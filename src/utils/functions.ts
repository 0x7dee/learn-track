export async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

export const compareUrls = (url: string, currentUrl: string): boolean => {
    url = url
        .replace(/^https?:\/\//, '')
        .replace(/^http?:\/\//, '')
        .replace(/^www?:\/\//, '')
    if ( currentUrl.includes(url) ) return true
    return false
}

export const getDateXDaysAgo = (numOfDays: number, date = new Date()) => {
    const daysAgo = new Date(date.getTime());

    daysAgo.setDate(date.getDate() - numOfDays);

    return daysAgo;
}
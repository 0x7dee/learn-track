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
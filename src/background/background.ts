let url: string = '';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log({msg})
    console.log({sender})
    url = sender.url || ''
    sendResponse('From the background script')
})


/* Timer to capture current time at each url */
chrome.alarms.create('urlTimer', {
    periodInMinutes: 1 / 60
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if ( alarm.name === 'urlTimer' ) {
        
       /* Update current tab */
       let tab = await getCurrentTab();
       chrome.storage.local.set({tab})   

       let lastTab = await chrome.storage.local.get('tab');
       //console.log(lastTab.tab.url)

       /* Get link data and match to current url */
       let getLinkData = await chrome.storage.local.get('links');
       updateLapsedTime(getLinkData.links, lastTab)
    }
})

chrome.storage.local.get('timer', (res) => {
    chrome.storage.local.set({ timer: 'timer' in res ? res.timer : 0 })
})

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

const updateLapsedTime = async (linkData: any, lastTab: any) => {
    let index = 0
    linkData.forEach((link: { urls: any[], title: string }) => {
        link.urls.forEach((url: any) => {
            let timeLeft = linkData[index].timeLapsed <= linkData[index].time

            /* Compare current url to urls specified in link, if there is no time left then ignore */
            if( timeLeft && compareUrls(url, lastTab.tab.url) ) {
                let updatedLinkData = linkData;
                updatedLinkData[index].timeLapsed += 1
                chrome.storage.local.set({'links': updatedLinkData})   
            }
        })
        index += 1
    })
}

const compareUrls = (url1: string, url2: string): boolean => {
    return true;
}
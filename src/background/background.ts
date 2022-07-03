let url: string = '';

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

const resetAllTimeLapsed = async (links: any) => {
    let existingLinks = await chrome.storage.local.get('links')
    if ( existingLinks.links ) {
        let updateTimeLinks = existingLinks.links
        updateTimeLinks.forEach((link: { timeLapsed: number; }) => {
            link.timeLapsed = 0
        })
        await chrome.storage.local.set({ links: updateTimeLinks })
    }
}

const updateLapsedTime = async (linkData: any, lastTab: any) => {
    let index = 0
    if ( !linkData ) return

    let todaysDate = new Date();
    let today = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][todaysDate.getDay()]
    let getCurrentDay = await chrome.storage.local.get('currentDay')
    let currentDay = getCurrentDay.currentDay ? getCurrentDay.currentDay : ''
    
    /* If it's a new day then reset time lapsed for all links */
    if ( today !== currentDay ) resetAllTimeLapsed(linkData)
    await chrome.storage.local.set({ currentDay: today })

    /* Increment timeLapsed */
    linkData.forEach((link: { urls: any[], title: string }) => {
        link.urls.forEach((url: any) => {
            let timeLeft = linkData[index].timeLapsed <= linkData[index].time
            let urlsIsValid = compareUrls(url, lastTab.tab.url)
            let isStudyDay = linkData[index].days.indexOf(today) > -1

            /* Compare current url to urls specified in link, if there is no time left then ignore */
            if( timeLeft && urlsIsValid && isStudyDay ) {
                let updatedLinkData = linkData;
                updatedLinkData[index].timeLapsed += 1
                chrome.storage.local.set({'links': updatedLinkData})   
            }
        })
        index += 1
    })
}

const compareUrls = (url: string, currentUrl: string): boolean => {
    if ( currentUrl.includes(url) ) return true
    return false
}
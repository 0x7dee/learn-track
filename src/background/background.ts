/**
 * links -> array of all links created by the user
 * timer -> counter
 * tab -> current tab the user is on
 * currentDay -> current day
 * dates -> records all dates that the application has been in use, used for showing completion rate
 */

/* LearnTrack time track functionality */
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

       /* Get link data and match to current url */
       let getLinkData = await chrome.storage.local.get('links');
       updateLapsedTime(getLinkData.links, lastTab)

       /* Store the current URL in history */
       // get base domain of last tab
       //let { hostname: string } = new URL(lastTab); -> this works
       // check if it exists in history
       // if it exists then increment the counter value
       // if it does not exist then add it with an incremented value of 1
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
    if ( !linkData ) return

    let todaysDate = new Date();
    let today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][todaysDate.getDay()]
    let getCurrentDay = await chrome.storage.local.get('currentDay')
    let currentDay = getCurrentDay.currentDay ? getCurrentDay.currentDay : ''
    let dates = await chrome.storage.local.get('dates')
    let todayString = todaysDate.toLocaleDateString()

    let updatedDates = dates.dates

    /* If it's a new day then reset time lapsed for all links */
    if ( today !== currentDay ) {        
        await resetAllTimeLapsed(linkData)
    }
    await chrome.storage.local.set({ currentDay: today })

    /* Add date if doesn't exist */
    if ( !updatedDates[todayString] ) {
        updatedDates = { ...updatedDates, [todayString]: {} }
        await chrome.storage.local.set({ dates: updatedDates })
    }

    /* Increment timeLapsed */
    let urlFound = false // we only want one increment per second
    linkData.forEach((link: { urls: any[], title: string }, index: number) => {
        link.urls.forEach( async (url: any) => {
            let timeLeft = linkData[index].timeLapsed <= linkData[index].time
            let urlsIsValid = compareUrls(url, lastTab.tab.url)
            let isStudyDay = linkData[index].days[today]

            /* Add topic if doesn't already exist in todays date */
            if (isStudyDay && updatedDates[todayString] && !updatedDates[todayString][link.title]) {
                updatedDates[todayString] = { ...updatedDates[todayString], [link.title]: false }
                await chrome.storage.local.set({ dates: updatedDates })
            }

            /* Update topic completion for today */
            if (isStudyDay) {
                updatedDates[todayString] = { ...updatedDates[todayString], [link.title]: !timeLeft }
                await chrome.storage.local.set({ dates: updatedDates })
            }

            /* Compare current url to urls specified in link, if there is no time left then ignore */
            if( timeLeft && urlsIsValid && isStudyDay && !urlFound ) {
                let updatedLinkData = linkData;
                updatedLinkData[index].timeLapsed += 1
                chrome.storage.local.set({'links': updatedLinkData})  
                urlFound = true
            }
        })
        urlFound = false
    })
}

const compareUrls = (url: string, currentUrl: string): boolean => {
    url = url
        .replace(/^https?:\/\//, '')
        .replace(/^http?:\/\//, '')
        .replace(/^www?:\/\//, '')
    if ( currentUrl.includes(url) ) return true
    return false
}
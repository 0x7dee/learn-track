/**
 * links -> array of all links created by the user
 * timer -> counter
 * tab -> current tab the user is on
 * currentDay -> current day
 * dates -> records all dates that the application has been in use, used for showing completion rate
 * viewHistory -> store of hostnames user has visited
 */

import { getCurrentTab, compareUrls } from "../utils/functions";

/* LearnTrack time track functionality */
let url: string = '';

chrome.alarms.create('urlTimer', {
    periodInMinutes: 1 / 60
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
    let todaysDate = new Date();
    let todayString = todaysDate.toLocaleDateString()

    if ( alarm.name === 'urlTimer' ) {
        
       /* Update current tab */
       let tab = await getCurrentTab();
       chrome.storage.local.set({tab})   

       let lastTab = await chrome.storage.local.get('tab');

       /* Get link data and match to current url */
       let getLinkData = await chrome.storage.local.get('links');
       updateLapsedTime(getLinkData.links, lastTab)

       /* Update history */
       updateHistory(lastTab, todayString)
     
    }
})

chrome.storage.local.get('timer', (res) => {
    chrome.storage.local.set({ timer: 'timer' in res ? res.timer : 0 })
})

const updateHistory = async (lastTab: any, todayString: string) => {
    // ViewHistory
    if (!lastTab || !lastTab.tab.url) return
    
    let getViewHistory = await chrome.storage.local.get('viewHistory')
    let viewHistory = getViewHistory.viewHistory
    let url: any = new URL(lastTab.tab.url)

    if (["newtab", "extensions"].includes(url.hostname)) return 
    
    // If hostname doesn't exist in history add it
    if (!viewHistory[url.hostname]) {
        viewHistory = {...viewHistory, [url.hostname]: {totalTime: 1, dates: { [todayString]: 1 }}}
    } else if (!viewHistory[url.hostname].dates[todayString]) {
        viewHistory[url.hostname].totalTime += 1
        viewHistory[url.hostname].dates = { ...viewHistory[url.hostname].dates, [todayString]: 1 }
    } else {
        viewHistory[url.hostname].totalTime += 1
        viewHistory[url.hostname].dates[todayString] += 1          
    }

    await chrome.storage.local.set({'viewHistory': viewHistory})
}

const turnOffAllAutotracks = async () => {
    let linkData: any = await chrome.storage.local.get('links')

    if ( linkData.links ) {
      let updateAutotrack = await linkData.links.map((currLink: any) => {
        currLink['autotrack'] = false
        return currLink
      })
      await chrome.storage.local.set({ links: updateAutotrack })
    }
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

// turn off autotrack when chrome is closed
//chrome.windows.onRemoved.addListener(() => turnOffAllAutotracks())

const updateLapsedTime = async (linkData: any, lastTab: any) => {
    if ( !linkData || linkData.includes(null) ) return

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
        await turnOffAllAutotracks()
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
            if(!url) return
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
            if( timeLeft && !urlFound && ( linkData[index].autotrack || (urlsIsValid && isStudyDay) ) ) {
                let updatedLinkData = linkData;
                updatedLinkData[index].timeLapsed += 1
                chrome.storage.local.set({'links': updatedLinkData})  
                urlFound = true
            }
        })
        urlFound = false
    })
}


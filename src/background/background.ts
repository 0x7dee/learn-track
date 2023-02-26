/**
 * links -> array of all links created by the user
 * timer -> counter
 * tab -> current tab the user is on
 * currentDay -> current day
 * dates -> records all dates that the application has been in use, used for showing completion rate
 * viewHistory -> store of hostnames user has visited
 * memberNumber -> members verification code if they are a member
 */

import { getCurrentTab, compareUrls, getDateXDaysAgo } from "../utils/functions";

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

       /* Check if member */
       let { memberNumber } = await chrome.storage.local.get('memberNumber') || null

       /* Get link data and match to current url */
       let getLinkData = await chrome.storage.local.get('links');
       updateLapsedTime(getLinkData.links, lastTab, memberNumber)

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
        viewHistory = {...viewHistory, [url.hostname]: {totalTime: 1, timeThisWeek: 1, dates: { [todayString]: 1 }}}
    } else if (!viewHistory[url.hostname].dates[todayString]) {
        viewHistory[url.hostname].totalTime += 1
        viewHistory[url.hostname].timeThisWeek += 1
        viewHistory[url.hostname].dates = { ...viewHistory[url.hostname].dates, [todayString]: 1 }
    } else {
        viewHistory[url.hostname].totalTime += 1
        viewHistory[url.hostname].timeThisWeek += 1
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

const updateLapsedTime = async (linkData: any, lastTab: any, memberNumber: string) => {
    if ( !linkData || linkData.includes(null) || !memberNumber ) return

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
        await updateTimeThisWeek()
    }
    await chrome.storage.local.set({ currentDay: today })

    /* Add date if doesn't exist */
    if ( !updatedDates[todayString] ) {
        updatedDates = { ...updatedDates, [todayString]: {} }
        await chrome.storage.local.set({ dates: updatedDates })
    }

    /* Increment timeLapsed */
    let urlFound = false // we only want one increment per second
    /* Loop over links and update time */
    linkData.forEach(async (link: { urls: any[], title: string, autotrack: string }, index: number) => {
        let timeLeft = linkData[index].timeLapsed <= linkData[index].time
        let isStudyDay = linkData[index].days[today]

        /* Add task to today value in dates if it is not already there */
        if (isStudyDay && updatedDates[todayString] && !updatedDates[todayString][link.title]) {
            updatedDates[todayString] = { ...updatedDates[todayString], [link.title]: false }
            await chrome.storage.local.set({ dates: updatedDates })
        }

        /* Update topic completion for today */
        if (isStudyDay || linkData[index].autotrack) {
            updatedDates[todayString] = { ...updatedDates[todayString], [link.title]: !timeLeft }
            await chrome.storage.local.set({ dates: updatedDates })
        }

        /* If autotrack is on we don't need to check the URLs */
        if ( linkData[index].autotrack && timeLeft && isStudyDay ) {
            let updatedLinkData = linkData;
            updatedLinkData[index].timeLapsed += 1
            chrome.storage.local.set({'links': updatedLinkData})  
            urlFound = true
        } else {
            /* Loop over each url and if you are on that URL increment the time value */
            link.urls.forEach( async (url: any) => {
                if(!url) return

                let urlsIsValid = compareUrls(url, lastTab.tab.url)

                /* Compare current url to urls specified in link, if there is no time left then ignore */
                if( timeLeft && !urlFound && ( linkData[index].autotrack || (urlsIsValid && isStudyDay) ) ) {
                    let updatedLinkData = linkData;
                    updatedLinkData[index].timeLapsed += 1
                    chrome.storage.local.set({'links': updatedLinkData})  
                    urlFound = true
                }
            })
        }

        urlFound = false
    })
}

const updateTimeThisWeek = async () => {
    let { viewHistory } = await chrome.storage.local.get('viewHistory')

    if (!viewHistory) return
    
    Object.keys(viewHistory).forEach((item: string) => {
        let timeForLast7Days = 0;
        [0,1,2,3,4,5,6].forEach(daysAgo => {
            let day = getDateXDaysAgo(daysAgo)
            let timeOnPastDay = viewHistory[item].dates[day.toLocaleDateString()]
            if (timeOnPastDay) timeForLast7Days += timeOnPastDay
        })
        viewHistory[item]["timeThisWeek"] = timeForLast7Days || 0
    })

    await chrome.storage.local.set({ 'viewHistory': viewHistory })
}



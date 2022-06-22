chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log(msg)
    console.log(sender)
    sendResponse('From the background script')
})


/* Timer to capture current time at each url */
chrome.alarms.create('urlTimer', {
    periodInMinutes: 1 / 60
})

chrome.alarms.onAlarm.addListener((alarm) => {
    if ( alarm.name === 'urlTimer' ) {
        chrome.storage.sync.get('timer', (res) => {
            let timer = res.timer + 1
            chrome.storage.sync.set({ timer })
        })
    }
})

chrome.storage.sync.get('timer', (res) => {
    chrome.storage.sync.set({ timer: 'timer' in res ? res.timer : 0 })
})
chrome.runtime.sendMessage("hello from content script", (res) => {
    console.log(res)
})
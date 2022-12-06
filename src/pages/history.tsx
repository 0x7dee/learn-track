import React, { useState, useEffect } from 'react'


function History() {
    let [viewHistory, setViewHistory]: any = useState({})
    
    let todaysDate = new Date();
    let todayString = todaysDate.toLocaleDateString()
    

    useEffect( () => {

        let secondInterval = setInterval(async () => {
            let getViewHistory = await chrome.storage.local.get('viewHistory')
            setViewHistory(getViewHistory.viewHistory)
        }, 1000)
        return () => clearInterval(secondInterval)
        
    }, [viewHistory])

    const displayHistory = () => {
        if (!viewHistory) return
        return Object.keys(viewHistory).map(item => {
            return <div key={item}>{item}: {viewHistory[item].totalTime}</div>
        })
    }

 return <div className="history">{ displayHistory() }</div>   
}

export default History;
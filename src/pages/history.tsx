import React, { useState, useEffect } from 'react'


function History() {
    let [viewHistory, setViewHistory]: any = useState({})
    
    let todaysDate = new Date();
    let todayString = todaysDate.toLocaleDateString()

    const totalTime = (secondsLeft: number) => {
        /* 7500 sec, 125 mins, 2hr 5mins */
        let hoursLeft = Math.floor(secondsLeft / 60 / 60)
        let minsLeft = Math.floor(secondsLeft / 60) - (hoursLeft * 60)
        
        if (secondsLeft < 60) return `${secondsLeft}sec`
        
        if ( hoursLeft === 0 && minsLeft > 0 ) {
        return `${minsLeft}min`
        } else if ( hoursLeft > 0 && minsLeft === 0 ) {
        return `${hoursLeft}hr`
        }

        return `${hoursLeft}hr ${minsLeft}min`
        
      }
    

    useEffect( () => {

        let secondInterval = setInterval(async () => {
            let getViewHistory = await chrome.storage.local.get('viewHistory')
            setViewHistory(getViewHistory.viewHistory)
        }, 1000)
        return () => clearInterval(secondInterval)
        
    }, [viewHistory])

    const displayHistory = () => {
        if (!viewHistory) return
        return Object.keys(viewHistory)
                .sort((a,b) => (viewHistory[b].totalTime - viewHistory[a].totalTime))
                .map(item => {
                    return <div key={item}>{item}: {totalTime(viewHistory[item].totalTime)}</div>
                })
    }

 return <div className="history">{ displayHistory() }</div>   
}

export default History;
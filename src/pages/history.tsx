import React, { useState, useEffect } from 'react'


function History() {
    let [viewHistory, setViewHistory]: any = useState({})
    let [onlyShowToday, setOnlyShowToday] = useState(true)
    let [timeline, setTimeline] = useState("today")
    
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

    const displayLinkToggle = () => {
        
        return (
        <div className="displayPage__toggle mb-6 py-1 flex flex-row items-center w-full">
            <p onClick={ () => setTimeline("today") } className={`mr-2 cursor-pointer ${ timeline === "today" ? 'text-black' : 'text-slate-400' }`}>Today</p>
            <p onClick={ () => setTimeline("week") } className={`mr-2 cursor-pointer ${ timeline === "week" ? 'text-black' : 'text-slate-400' }`}>This Week</p>
            <p onClick={ () => setTimeline("all") } className={`cursor-pointer ${ timeline === "all" ? 'text-black' : 'text-slate-400' }`}>
                Show all {`(${ viewHistory ? Object.keys(viewHistory).length : '0' })`}
            </p>
        </div>
        )
        
      }
    
    const getDateXDaysAgo = (numOfDays: number, date = new Date()) => {
        const daysAgo = new Date(date.getTime());

        daysAgo.setDate(date.getDate() - numOfDays);

        return daysAgo;
    }

    const displayHistory = () => {
        if (!viewHistory || Object.keys(viewHistory).length === 0) return <div>Loading history...</div>

        let viewHistorySorted = Object.keys(viewHistory).sort((a,b) => (viewHistory[b].totalTime - viewHistory[a].totalTime))
        

        if (timeline === 'today') {
            return Object.keys(viewHistory).filter(a => viewHistory[a].dates[todayString]).sort((a,b) => (viewHistory[b].dates[todayString] - viewHistory[a].dates[todayString]))
            .map(item => {
                if (viewHistory[item].dates[todayString] < 60 || !viewHistory[item].dates[todayString]) return
                return (
                    <div key={item}>
                        <span className='flex flex-row justify-between'>
                            <a href={`https://${item}`} target={"_blank"}>{item}</a>
                            <p>{totalTime(viewHistory[item].dates[todayString])}</p>
                        </span>
                    </div>
                )
            })
        } else if (timeline === 'week') {
            
            return viewHistorySorted
                .map(item => {
                    if (viewHistory[item].totalTime < 60) return

                    let timeForLast7Days = 0
                    
                    let last7days = [0,1,2,3,4,5,6].forEach(daysAgo => {
                        let day = getDateXDaysAgo(daysAgo)
                        let timeOnPastDay = viewHistory[item].dates[day.toLocaleDateString()]
                        if (timeOnPastDay) timeForLast7Days += timeOnPastDay
                    })

                    return (
                        <div key={item}>
                            <span className='flex flex-row justify-between'>
                                <a href={`https://${item}`} target={"_blank"}>{item}</a>
                                <p>{totalTime(timeForLast7Days)}</p>
                            </span>
                        </div>
                    )
                })
        } else {
            return viewHistorySorted
                .map(item => {
                    return (
                        <div key={item}>
                            <span className='flex flex-row justify-between'>
                                <a href={`https://${item}`} target={"_blank"}>{item}</a>
                                <p>{totalTime(viewHistory[item].totalTime)}</p>
                            </span>
                        </div>
                    )
                })
        }

        
    }

 return (
    <div>
        { displayLinkToggle() }
        <div className="h-60 overflow-scroll pr-5">
            { displayHistory() }
        </div>    
    </div>   
 )
}

export default History;
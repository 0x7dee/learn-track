import React, { useState, useEffect } from 'react'


function History() {
    let [viewHistory, setViewHistory]: any = useState({})
    let [onlyShowToday, setOnlyShowToday] = useState(true)
    let [timeline, setTimeline] = useState("today")
    let [filterMinutes, setFilterMinutes] = useState(0)
    
    let todaysDate = new Date();
    let todayString = todaysDate.toLocaleDateString()

    useEffect(() => {
        updateHistory()
    }, [])
    
    useEffect( () => {
        let secondInterval = setInterval(async () => {
            updateHistory()
        }, 1000)
        return () => clearInterval(secondInterval)
        
    }, [viewHistory])

    const updateHistory = async () => {
        let getViewHistory = await chrome.storage.local.get('viewHistory')
        setViewHistory(getViewHistory.viewHistory)
    }

    const totalTime = (secondsLeft: number) => {
        /* 7500 sec, 125 mins, 2hr 5mins */
        let daysLeft = Math.floor(secondsLeft / 60 / 60 / 24)
        let hoursLeft = Math.floor(secondsLeft / 60 / 60) - ( daysLeft * 24 )
        let minsLeft = Math.floor(secondsLeft / 60) - (hoursLeft * 60 ) - ( daysLeft * 24 * 60 )
        
        if (secondsLeft < 60) return `${secondsLeft}sec`

        return `
            ${ daysLeft ? daysLeft + 'd' : '' } 
            ${ hoursLeft ? hoursLeft + 'hr' : daysLeft ? '0hr' : '' } 
            ${ minsLeft ? minsLeft + 'min' : hoursLeft ? '0min' : '' }
            ` 
    }

    const displayLinkToggle = () => {   
        return (
            <div className="displayPage__toggle mb-3 py-1 flex flex-row items-center w-full">
                <p onClick={ () => setTimeline("today") } className={`mr-2 cursor-pointer ${ timeline === "today" ? 'text-black' : 'text-slate-400' }`}>Today</p>
                <p onClick={ () => setTimeline("week") } className={`mr-2 cursor-pointer ${ timeline === "week" ? 'text-black' : 'text-slate-400' }`}>This Week</p>
                <p onClick={ () => setTimeline("all") } className={`cursor-pointer ${ timeline === "all" ? 'text-black' : 'text-slate-400' }`}>
                    All Time {`(${ viewHistory ? Object.keys(viewHistory).length : '0' })`}
                </p>
            </div>
        )
      }
    
    const getDateXDaysAgo = (numOfDays: number, date = new Date()) => {
        const daysAgo = new Date(date.getTime());

        daysAgo.setDate(date.getDate() - numOfDays);

        return daysAgo;
    }

    const removeItemFromHistory = async (item: any) => {
        let removeItem = structuredClone(viewHistory)
        delete removeItem[item]
        await chrome.storage.local.set({ 'viewHistory': removeItem })
    }

    const displayHistory = () => {
        if (!viewHistory || Object.keys(viewHistory).length === 0) return <div>Loading history...</div>

        let viewHistorySorted = Object.keys(viewHistory).sort((a,b) => (viewHistory[b].totalTime - viewHistory[a].totalTime))
        let totalTimeForLastWeek: any = {}

        if (timeline === 'today') {
            return Object.keys(viewHistory).filter(a => viewHistory[a].dates[todayString]).sort((a,b) => (viewHistory[b].dates[todayString] - viewHistory[a].dates[todayString]))
            .map(item => {
                if (viewHistory[item].dates[todayString] < 60 || !viewHistory[item].dates[todayString]) return
                return (
                    <div key={item}>
                        <span className='group flex flex-row justify-between items-center mb-1'>
                            <span className='flex flex-row items-center'>
                                <a href={`https://${item}`} target={"_blank"}>{item}</a>
                                <p onClick={() => removeItemFromHistory(item)} className='text-red-400 ml-2 hidden group-hover:block cursor-pointer'>x</p>
                            </span>
                            <p>{totalTime(viewHistory[item].dates[todayString])}</p>
                        </span>
                    </div>
                )
            })
        } else if (timeline === 'week') {
            
            return Object.keys(viewHistory)
                .sort((a, b) => {

                    let timeForLast7DaysA = 0
                    
                    let last7daysA = [0,1,2,3,4,5,6].forEach(daysAgo => {
                        let day = getDateXDaysAgo(daysAgo)
                        let timeOnPastDay = viewHistory[a].dates[day.toLocaleDateString()]
                        if (timeOnPastDay) timeForLast7DaysA += timeOnPastDay
                    })

                    let timeForLast7DaysB = 0
                    
                    let last7daysB = [0,1,2,3,4,5,6].forEach(daysAgo => {
                        let day = getDateXDaysAgo(daysAgo)
                        let timeOnPastDay = viewHistory[b].dates[day.toLocaleDateString()]
                        if (timeOnPastDay) timeForLast7DaysB += timeOnPastDay
                    })

                    totalTimeForLastWeek = { ...totalTimeForLastWeek, [a]: timeForLast7DaysA }
                    
                    return timeForLast7DaysB - timeForLast7DaysA
                })
                .map(item => {
                    if (viewHistory[item].totalTime < 60 || totalTimeForLastWeek[item] < 60 ) return

                    let timeForLast7Days = 0
                    
                    let last7days = [0,1,2,3,4,5,6].forEach(daysAgo => {
                        let day = getDateXDaysAgo(daysAgo)
                        let timeOnPastDay = viewHistory[item].dates[day.toLocaleDateString()]
                        if (timeOnPastDay) timeForLast7Days += timeOnPastDay
                    })

                    return (
                        <div key={item}>
                            <span className='group flex flex-row justify-between mb-1'>
                                <span className=' flex flex-row items-center'>
                                    <a href={`https://${item}`} target={"_blank"}>{item}</a>
                                <p onClick={() => removeItemFromHistory(item)} className='text-red-400 ml-2 hidden group-hover:block cursor-pointer'>x</p>
                            </span>
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
                            <span className='group flex flex-row justify-between mb-1'>
                                <span className='flex flex-row items-center'>
                                    <a href={`https://${item}`} target={"_blank"}>{item}</a>
                                <p onClick={() => removeItemFromHistory(item)} className='text-red-400 ml-2 hidden group-hover:block cursor-pointer'>x</p>
                            </span>
                                <p>{totalTime(viewHistory[item].totalTime)}</p>
                            </span>
                        </div>
                    )
                })
        }
    }

    const filterHistory = async () => {
        let filterHistory = structuredClone(viewHistory)
        console.log(filterHistory)

        Object.keys(filterHistory).forEach(item => {
            if (filterHistory[item].totalTime < (filterMinutes*60)) {
                console.log(`deleting: ${filterHistory[item]}`)
                delete filterHistory[item]
            }
        })
        await chrome.storage.local.set({ 'viewHistory': filterHistory })
    }

    const displayFilter = () => {
        if ( timeline === 'week' || timeline === 'today' ) return
        return (
            <div className="filterHistory mb-3 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                    <p>Clear items less than: </p>
                    <input className='w-10 mx-2' type="number" name="minutes" value={ filterMinutes.toString() } onChange={ (e) => setFilterMinutes(parseInt(e.target.value)) } />
                    <p>minutes</p>
                </div>
                <button onClick={() => filterHistory()} className='ml-2 text-red-400 border-red-400 border px-4 rounded-md hover:text-neutral-100 hover:bg-red-400 transition ease-in-out duration-300'>Clear</button>
            </div>
        )
    }

 return (
    <div>
        { displayLinkToggle() }    
        <div className="h-72 overflow-scroll pr-5">
            { displayHistory() }
        </div>   
        <div className="absolute bottom-1 z-10">
            { displayFilter() }
        </div> 
        
    </div>   
 )
}

export default History;
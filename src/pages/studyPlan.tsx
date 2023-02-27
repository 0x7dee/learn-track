import React, { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'

const StudyPlan = () => {
  const [links, setLinks] = useState<any[]>([])
  const [topics, setTopics] = useState<any>({})
  const [studyOnDay, setStudyOnDay] = useState<any>({})
  const [longestTime, setLongestTime] = useState<number>(0)
  const [dates, setDates] = useState<any>({})

  useEffect(() => {
    getLinks()
    getDates()
  }, [])

  useEffect(() => {
    setLongestDay()
  }, [studyOnDay])

  useEffect(() => {
    formatStudyDays()
  }, [links])

  const getDates = async () => {
    let getDates = await chrome.storage.local.get('dates')
    setDates(getDates.dates)
  }

  const getLinks = async () => {
    const existingLinks = await chrome.storage.local.get("links");
    setLinks(existingLinks.links)
  }

  const formatStudyDays = () => {
    if (!links || links.includes(null)) return

    let days: any = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    }

    let colors = [
      'bg-red-400', 
      'bg-purple-400', 
      'bg-blue-400', 
      'bg-yellow-400', 
      'bg-pink-400', 
      'bg-lime-400', 
      'bg-teal-400', 
      'bg-sky-400', 
      'bg-orange-400', 
      'bg-indigo-400', 
      'bg-rose-400'
    ]

    let newTopics: any = {}


    links.forEach(link => {
      let { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = link.days
      let { time, hours, mins, title } = link
      let topic = { title, hours, mins }

      if ( !topics[title] ) {
        newTopics[title] = colors[0]
        colors.shift()
      }

      if ( Monday ) days.Monday.push(topic)
      if ( Tuesday ) days.Tuesday.push(topic)
      if ( Wednesday ) days.Wednesday.push(topic)
      if ( Thursday ) days.Thursday.push(topic)
      if ( Friday ) days.Friday.push(topic)
      if ( Saturday ) days.Saturday.push(topic)
      if ( Sunday ) days.Sunday.push(topic) 
    })

    setStudyOnDay(days)
    setTopics(newTopics)
  }

  const displayHistogram = () => {
    if (!topics) return
    return Object.keys(topics).map(topic => {
      return (
        <div key={`${topics[topic]} ${topic}`} className='flex flex-row items-center mr-3'>
          <div className={`${topics[topic]} h-2 w-2 mr-1 rounded-full`}></div>
          <p>{ topic }</p>
        </div>
      )
    })
  }

  const setLongestDay = () => {
    if (!studyOnDay) return

    let highestTime = 0
    let totalTime = 0

    Object.keys(studyOnDay).forEach(day => {
      studyOnDay[day].forEach((data: { hours: number; mins: number }) => {
        if (!data.hours) data.hours = 0
        if (!data.mins) data.mins = 0
        totalTime += ((data.hours * 60 * 60) + (data.mins * 60)) // total time in seconds
      })
      if (totalTime > highestTime) highestTime = totalTime
      totalTime = 0
    })
    console.log(studyOnDay)
    setLongestTime(highestTime)
  }

  const displayDayData = (day: any[]) => {

    /* If there are no tasks on that day display blank line */
    if ( day.length === 0 ) {
      return [0,1,2,3,4,5,6].map((data, index) => {
        return (
          <div 
            key={`${index}`} 
            className={`${index+1 === 7 ? 'rounded-r-full' : ''} ${index === 0 ? 'rounded-l-full' : ''} h-3 bg-slate-100`} 
            style={{ width: `100%` }}
          ></div>
        )
      })
    }

    if (!longestTime || longestTime < 1) return

    /* Display tasks on specific day in GUI */
    let totalTime = 0
    day.forEach(data => totalTime += ((data.hours * 60 * 60) + (data.mins * 60)))

    return day.map((data, index) => {
      let { hours, mins, title } = data

      // time in seconds
      let time = (hours*60*60)+(mins*60)

      // round longestTime up to nearest hour (in mins) then converts to seconds then to percentage value
      // THIS PART IS STILL BUGGY, NEEDS TO BE VALIDATED/TESTED
      let longestTimeMins = Math.floor(longestTime / 60)
      let longestTimeHrs = Math.floor(longestTimeMins / 60)

      let roundsToAnHour = longestTimeMins % 60 === 0
      let roundedUpTime = !roundsToAnHour ? longestTimeHrs + 1 : longestTimeHrs
      let width = (time / ( roundedUpTime * 60 * 60 )) * 100

      return (
        <div 
          key={`${title}${topics[title]}`} 
          className={`${topics[title]} ${index+1 === day.length ? 'rounded-r-full' : ''} ${index === 0 ? 'rounded-l-full' : ''} h-3`} 
          style={{ width: `${width}%` }}></div>
      )
    })
  }

  const displayStudyPlan = () => {
    if (!studyOnDay) return

    let today = new Date()
    let dayOfWeek = today.getDay()
    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


    return Object.keys(studyOnDay).map((day, index) => {
      return (
        <div key={`${index}${day}`} className='grid grid-cols-12'>
          <div className="col-span-3">
            <h1 className={ daysOfWeek[dayOfWeek] === day ? 'text-sky-400 font-bold' : ''}>{ day }</h1>
          </div>
          <div className="flex flex-row col-span-9 rounded-full overflow-hidden items-center">
            { displayDayData(studyOnDay[day]) }
          </div> 
        </div>
      )
    })

  }

  const displayTimeAxis = () => {
    if (!longestTime) return

    let hours = Math.ceil(Math.floor(longestTime / 60) / 60)

    return Array.from(Array(hours+1).keys()).map((key, index) => {
      if ( key === 0 ) return <span key={`timeAxis${key}${index}`}>{ key }</span>
      return <span key={`timeAxis${index}${key}`} className=''>{ `${key}hr` }</span>
    })
    
  }

  function getDateXDaysAgo(numOfDays: number, date = new Date()) {
    const daysAgo = new Date(date.getTime());

    daysAgo.setDate(date.getDate() - numOfDays);

    return daysAgo;
  }

  const displayResultOnHistoricalDay = (date: any) => {
    if (!date) return
    return Object.keys(date).map(key => {
      if (date[key]) {
        return <span key={'historicalResult'+key} className='text-xs text-green-400 inline-block'>{key}</span>
      } else {
        return <span key={'historicalResult'+key} className='text-xs text-red-400 inline-block'>{key}</span>
      }
    })
  }

  const displaySuccessRateForDay = (date: any) => {
    if (!date) return
    let success = 0
    let failure = 0 
    
    Object.keys(date).forEach(key => {
      if (date[key]) {
        success += 1
      } else {
        failure += 1
      }
    })

    return " - " + Math.floor(success / (success + failure) * 100) + "%"

  }

  const displayProgress = () => {

    let weeks = 18
    let today = new Date()
    let dayOfWeek = today.getDay()
    let UIStartDaysAgo = (weeks-1) * 7 + dayOfWeek

    let xIndex = 0
    let yIndex = 0

    return Array.from(Array(weeks*7).keys()).map((key) => {
      if ( xIndex > weeks-1 ) {
        xIndex = 0
        yIndex++
      }

      let weeklyIncrement = xIndex*7

      let daysAgo = UIStartDaysAgo - weeklyIncrement - yIndex
      let currDate = getDateXDaysAgo(daysAgo)
      xIndex++

      let completenessScore = 0

      let numerator = 0
      let denominator = 0


      if (dates && currDate && dates[currDate.toLocaleDateString()]) {
        Object.keys(dates[currDate.toLocaleDateString()]).forEach(topic => {
          denominator++
          if ( dates[currDate.toLocaleDateString()][topic] ) numerator++
        })
        completenessScore = numerator / denominator
      }

      return (
        <div 
          key={`progress${key}`} 
          className={`col-span-1 row-span-1 
          ${ 
            daysAgo < 0 ? 'bg-white' : 
            completenessScore >= 1 ? 'bg-green-600' : 
            completenessScore >= 0.75 ? 'bg-green-500' : 
            completenessScore >= 0.5 ? 'bg-green-400' : 
            completenessScore > 0 ? 'bg-green-200' : 
            'bg-slate-100' 
          } 
          rounded-sm relative group cursor-default`}>
          <div className={`whitespace-nowrap break-keep absolute -top-4 ${ xIndex > 10 ? 'right-5' : 'left-5' } bg-slate-50 rounded-md px-2 py-2 z-10 hidden ${ daysAgo < 0 ? '' : 'group-hover:block' } cursor-default`}>
            <div className="flex flex-col flex-nowrap">
              
              <p className='mb-2'>{ currDate.toLocaleDateString() } { displaySuccessRateForDay(dates[currDate.toLocaleDateString()]) }</p>
             
              <div className='flex flex-col flex-nowrap'>
                { displayResultOnHistoricalDay(dates[currDate.toLocaleDateString()]) }
              </div>
            </div>   
          </div>
        </div>)
    })
  }

  const displayMonths = () => {
    let months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    let recentMonths: string[] = []

    let today = new Date()
    let currMonth = today.getMonth()
    let currDay = today.getDate()

    let startMonth = currMonth - 5 < 0 ? currMonth + 7 : currMonth - 5

    // If we're 1 week into the new month then use that month in the UI
    if ( currDay > 7 ) startMonth = startMonth + 1

    for(let i=0; i < 5; i++) {
      if ( startMonth + i > 12 ) {
        recentMonths.push(months[startMonth+i-12])
      } else {
        recentMonths.push(months[startMonth+i])
      }
    }

    return recentMonths.map((month, index) => {
      return <div key={`months${month}${index}`} className="">{ month }</div>
    })
  }

  return (
    <div className='studyPlan grid grid-cols-12'>
        <div className="grid grid-cols-12 grid-rows-8 progress col-span-12 h-[8.5rem] mb-4">
          <div className="days col-start-0 col-span-1 row-start-0 row-span-8 grid grid-cols-1 grid-rows-8 justify-center content-start text-xs pt-2">
            <p className='row-start-3 row-span-1'>Mon</p>
            <p className='row-start-5 row-span-1'>Wed</p>
            <p className='row-start-7 row-span-1'>Fri</p>
          </div>
          <div className="months col-start-2 col-span-11 row-start-0 row-span-1 px-2 flex flex-row items-start justify-around">
            { displayMonths() }
          </div>
          <div className="progress col-start-2 col-span-11 row-start-2 row-span-7 grid grid-rows-7 grid-cols-18 gap-[2px] pl-2 pt-2 justify-center content-center">
            { displayProgress() }
          </div>
        </div>
        <div className="histogram flex flex-row flex-wrap col-span-12 mb-2">
          { displayHistogram() }
        </div>
        <div className="col-span-12">
          { displayStudyPlan() }
        </div>
        <div className="col-span-3"></div>
        <div className="col-span-9 w-full h-5 flex flex-row justify-between mt-1">
          <div className="flex flex-row justify-between w-full items-end">
            { displayTimeAxis() }
          </div>
        </div>
    </div>
  )
}

export default StudyPlan
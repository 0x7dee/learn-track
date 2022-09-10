import React, { useEffect, useState } from 'react'

const StudyPlan = () => {
  const [links, setLinks] = useState<any[]>([])
  const [topics, setTopics] = useState<any>({})
  const [studyOnDay, setStudyOnDay] = useState<any>({})
  const [longestTime, setLongestTime] = useState<number>(0)

  useEffect(() => {
    getLinks()
  }, [])

  useEffect(() => {
    setLongestDay()
  }, [studyOnDay])

  useEffect(() => {
    formatStudyDays()
  }, [links])

  const getLinks = async () => {
    const existingLinks = await chrome.storage.local.get("links");
    setLinks(existingLinks.links)
  }

  const formatStudyDays = () => {
    if (!links) return

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
        <div key={`${topics[topic]}${topic}`} className='flex flex-row items-center mr-3'>
          <div className={`${topics[topic]} h-2 w-2 mr-1 rounded-full`}></div>
          <p>{ topic }</p>
        </div>
      )
    })
  }

  const setLongestDay = () => {
    if (!studyOnDay) return

    let highestMins = 0
    let totalMins = 0

    Object.keys(studyOnDay).forEach(day => {
      totalMins = 0
      studyOnDay[day].forEach((data: { hours: number; mins: number }) => totalMins += (data.hours * 60 + data.mins))
      if (totalMins > highestMins) highestMins = totalMins
    })
    
    setLongestTime(highestMins)
  }

  const displayDayData = (day: any[]) => {
    if (!longestTime || longestTime < 1) return

    let totalMins = 0
    day.forEach(data => totalMins += (data.hours * 60 + data.mins))

    return day.map((data, index) => {
      let { hours, mins, title } = data
      let time = (hours*60*60)+(mins*60)
      let width = (time / (longestTime*60)) * 100

      return (
        <div 
          key={`${title}${topics[title]}`} 
          className={`${topics[title]} ${index+1 === day.length ? 'rounded-r-full' : ''} ${index === 0 ? 'rounded-l-full' : ''} h-3`} 
          style={{ width: `${width}%` }}></div>
      )
    })
  }

  const displayStudyPlan = () => {
    if (!links || !studyOnDay) return

    return Object.keys(studyOnDay).map(day => {
      return (
        <div key={day} className='grid grid-cols-12'>
          <div className="col-span-3">
            <h1>{ day }</h1>
          </div>
          <div className="flex flex-row col-span-9 rounded-full overflow-hidden items-center">
            { displayDayData(studyOnDay[day]) }
          </div> 
          {/*
          <div className="flex flex-row col-span-3">
            { totalTimeForOneDay(studyOnDay[day]) }
          </div>
          */}
        </div>
      )
    })

  }

  const convertTimeToHoursAndMins = (mins: number) => {
    let hours = Math.floor(mins / 60)
    return mins % 60 > 0 ? hours + 1 : hours
  }

  const displayProgress = () => {
    return Array.from(Array(140).keys()).map((key) => {
      return <div key={key} className='col-span-1 row-span-1 bg-slate-50 rounded-sm'></div>
    })
  }

  const displayMonths = () => {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    return months.map((month) => {
      return <div className="col-start-0 col-span-2">{ month }</div>
    })
  }

  return (
    <div className='studyPlan grid grid-cols-12'>
        <div className="grid grid-cols-12 grid-rows-8 progress col-span-12 h-[8rem] mb-4">
          <div className="days col-start-0 col-span-1 row-start-0 row-span-8 grid grid-cols-1 grid-rows-8 justify-center content-start text-xs">
            <p className='row-start-3 row-span-1'>Mon</p>
            <p className='row-start-5 row-span-1'>Wed</p>
            <p className='row-start-7 row-span-1'>Fri</p>
          </div>
          <div className="months col-start-2 col-span-11 row-start-0 row-span-1 px-2 grid grid-cols-11 grid-rows-1">
            { displayMonths() }
          </div>
          <div className="progress col-start-2 col-span-11 row-start-2 row-span-7 grid grid-rows-7 grid-cols-18 gap-[2px] pl-2 pt-2 justify-center content-center">
            { displayProgress() }
          </div>
        </div>
        <div className="histogram flex flex-row col-span-12 mb-2">
          { displayHistogram() }
        </div>
        <div className="col-span-12">
          { displayStudyPlan() }
        </div>
        <div className="col-span-3"></div>
        <div className="col-span-9 w-full h-5 flex flex-row justify-between mt-1">
          <p>0</p>
          <p>{`${ convertTimeToHoursAndMins(longestTime) }hr`}</p>
        </div>
    </div>
  )
}

export default StudyPlan
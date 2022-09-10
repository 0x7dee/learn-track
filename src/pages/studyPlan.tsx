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

      console.log({day, index})

      return (
        <div key={`${title}${topics[title]}`} className={`${topics[title]} ${index+1 === day.length ? 'rounded-r-full' : ''}`} style={{ width: `${width}%` }}></div>
      )
    })
  }

  const totalTimeForOneDay = (days: any) => {
    if (!days) return 

    let totalHours = 0
    let totalMins = 0

    days.forEach((data: { hours: number; mins: number }) => {
      totalHours += data.hours
      totalMins += data.mins
    })

    let hours: string = totalHours > 0 ? `${totalHours}hr` : ''
    let mins: string = totalMins > 0 ? `${totalMins}min` : ''

    return `${hours} ${mins}`

  }

  const displayStudyPlan = () => {
    if (!links || !studyOnDay) return

    return Object.keys(studyOnDay).map(day => {
      return (
        <div key={day} className='grid grid-cols-12 mt-3'>
          <div className="col-span-3">
            <h1>{ day }</h1>
          </div>
          <div className="flex flex-row col-span-9 rounded-full overflow-hidden">
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

  return (
    <div className='studyPlan grid grid-cols-12'>
        <div className="histogram flex flex-row col-span-12">
          { displayHistogram() }
        </div>
        <div className="col-span-12">
          { displayStudyPlan() }
        </div>
        <div className="col-span-3"></div>
        <div className="col-span-9 w-full h-5 flex flex-row justify-between">
          <p>0</p>
          <p>{`${ convertTimeToHoursAndMins(longestTime) }hr`}</p>
        </div>
    </div>
  )
}

export default StudyPlan
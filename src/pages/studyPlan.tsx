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
    formatStudyDays()
  }, [links])

  const getLinks = async () => {
    const existingLinks = await chrome.storage.local.get("links");
    console.log(existingLinks.links)
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

    let foundLongestTime = 0

    links.forEach(link => {
      let { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = link.days
      let { time, hours, mins, title } = link
      let topic = { title, hours, mins }

      if ( !topics[title] ) {
        newTopics[title] = colors[0]
        colors.shift()
      }

      if ( time > foundLongestTime ) foundLongestTime = time

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
    setLongestTime(foundLongestTime)
  }

  const displayHistogram = () => {
    if (!topics) return
    return Object.keys(topics).map(topic => {
      return (
        <div key={`${topics[topic]}${topic}`} className='flex flex-row items-center mr-3'>
          <div className={`${topics[topic]} h-2 w-2 mr-1`}></div>
          <p>{ topic }</p>
        </div>
      )
    })
  }

  const displayDayData = (day: any[]) => {

    let totalMins = 0
    day.forEach(data => totalMins += (data.hours * 60 + data.mins))

    return day.map(data => {
      let { hours, mins, title } = data
      let time = (hours*60*60)+(mins*60)
      let width = (time / longestTime) * 100

      return (
        <div key={`${title}${topics[title]}`} className={`${topics[title]}`} style={{ width: `${width}%` }}></div>
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
        <div key={day} className='grid grid-cols-10 mt-3'>
          <div className="col-span-3">
            <h1>{ day }</h1>
          </div>
          <div className="flex flex-row col-span-4">
            { displayDayData(studyOnDay[day]) }
          </div> 
          <div className="flex flex-row col-span-3">
            { totalTimeForOneDay(studyOnDay[day]) }
          </div>
        </div>
      )
    })

  }

  return (
    <div className='studyPlan'>
        <button onClick={() => {
          console.log(studyOnDay)
          console.log({topics})
        }}>Study Days</button>
        <div className="histogram flex flex-row">
          { displayHistogram() }
        </div>
        { displayStudyPlan() }
    </div>
  )
}

export default StudyPlan
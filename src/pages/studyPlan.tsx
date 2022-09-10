import React, { useEffect, useState } from 'react'

const StudyPlan = () => {
  const [links, setLinks] = useState<any[]>([])
  const [topics, setTopics] = useState<any>({})
  const [studyOnDay, setStudyOnDay] = useState<any>({})

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
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }

    let colors = [
      'bg-red-400', 
      'bg-orange-400', 
      'bg-blue-400', 
      'bg-yellow-400', 
      'bg-pink-400', 
      'bg-lime-400', 
      'bg-teal-400', 
      'bg-sky-400', 
      'bg-indigo-400', 
      'bg-purple-400', 
      'bg-rose-400'
    ]

    let newTopics: any = {}

    links.forEach(link => {
      let { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = link.days
      let { hours, mins, title } = link
      let topic = { title, hours, mins }

      if ( !topics[title] ) {
        newTopics[title] = colors[0]
        colors.shift()
      }

      if ( Monday ) days.monday.push(topic)
      if ( Tuesday ) days.tuesday.push(topic)
      if ( Wednesday ) days.wednesday.push(topic)
      if ( Thursday ) days.thursday.push(topic)
      if ( Friday ) days.friday.push(topic)
      if ( Saturday ) days.saturday.push(topic)
      if ( Sunday ) days.sunday.push(topic) 
    })

    setStudyOnDay(days)
    setTopics(newTopics)
  }

  const displayHistogram = () => {
    if (!topics) return
    return Object.keys(topics).map(topic => {
      return (
        <div className='flex flex-row items-center mr-3'>
          <div className={`${topics[topic]} h-2 w-2 mr-1`}></div>
          <p>{ topic }</p>
        </div>
      )
    })
  }

  const displayDayData = (day: any[]) => {
    return day.map(data => (
      <>
        <p>{ data.title }</p>
        <p>{ data.hours }</p>
        <p>{ data.mins }</p>
      </>
    ))
  }

  const displayStudyPlan = () => {
    if (!links || !studyOnDay) return

    return Object.keys(studyOnDay).map(day => {
      return (
        <div>
          <h1>{ day }</h1>
          { displayDayData(studyOnDay[day]) }
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
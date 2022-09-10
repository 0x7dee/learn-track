import React, { useEffect, useState } from 'react'

const StudyPlan = () => {
  const [links, setLinks] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
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

    links.forEach(link => {
      let { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = link.days
      let { hours, mins, title } = link
      let topic = { title, hours, mins }

      if ( Monday ) days.monday.push(topic)
      if ( Tuesday ) days.tuesday.push(topic)
      if ( Wednesday ) days.wednesday.push(topic)
      if ( Thursday ) days.thursday.push(topic)
      if ( Friday ) days.friday.push(topic)
      if ( Saturday ) days.saturday.push(topic)
      if ( Sunday ) days.sunday.push(topic) 
    })

    setStudyOnDay(days)
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
        <button onClick={() => console.log(studyOnDay)}>Study Days</button>
        { displayStudyPlan() }
    </div>
  )
}

export default StudyPlan
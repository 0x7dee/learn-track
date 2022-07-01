import React, { useEffect, useState } from 'react'
import '../index.css'

const NewTracker: any = ({ link, editMode }: any) => {
  
  const [title, setTitle] = useState<string>('')
  const [editTitle, setEditTitle] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [urls, setUrls] = useState<string[]>([])
  const [days, setDays] = useState<string[]>([])
  const [time, setTime] = useState<number>(0)
  const [hours, setHours] = useState<any>(0)
  const [mins, setMins] = useState<any>(0)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string>('')

  useEffect(() => {
    if (link && editMode) {
      setTitle(link.title)
      setEditTitle(link.title)
      setUrls(link.urls)
      setDays(link.days)
      setMins(link.mins)
      setHours(link.hours)
    }
  }, [])

  let dayOptions = {
    Mon: 'monday',
    Tues: 'tuesday',
    Wed: 'wednesday',
    Thurs: 'thursday',
    Fri: 'friday',
    Sat: 'saturday',
    Sun: 'sunday'
  }
  
  const updateUrlInput = (input: string) => {
    if (/\s+$/.test(input)) {
        addUrl()
    } else {
        setUrl(input);
    }
  }

  const addUrl  = () => {
      setUrls([url, ...urls]);
      setUrl('');
  }

  const removeUrl = (url: string) => {
    setUrls(urls.filter(x => x !== url))
  }

  const displayUrls = () => {
    return urls.map(url => (
        <div key={url} className="flex flex-row align-items-center mb-1">
            <img className="h-5 w-5 mr-1" src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`} alt="favicon" />
            <p className='mr-3'>{url}</p>
            <div className="text-red-600 cursor-pointer" onClick={() => removeUrl(url)}>x</div>
        </div>
    ))
  }

  const resetState = () => {
    setTitle('')
    setEditTitle('')
    setUrl('')
    setUrls([])
    setDays([])
    setTime(0)
    setHours(0)
    setMins(0)
    setErrors([])
  }

  const createdLinkSuccessful = () => {

    Object.keys(dayOptions).forEach((key, index) => {
      let refreshDay = document.getElementById(dayOptions[key as keyof typeof dayOptions]) as HTMLInputElement
      if ( refreshDay ) {
        refreshDay.checked = false
      }
    })
    setSuccess("New link created successfully!")
  }

  const validateLink = async (link: any, links: any) => {
    let { title, urls, days, time, timeLapsed } = link;
    let errors: string[] = [];

    /* Check if title already exists */
    if (!editMode) {
      await links.map((link: { title: string; }) => {
        if (link.title == title) errors.push("title already exists")
      })
    }
    
    /* Make sure urls exist */
    if ( urls.length < 1 ) errors.push("No urls are set")
    
    /* Check days are selected */
    if ( days.length < 1 ) errors.push("No days are selected")

    /* Check time, timeElapsed exists */
    if ( !time ) errors.push("Time must not be empty")
    if ( time < 1 || timeLapsed !== 0 ) errors.push("Time must be greater than 1")

    if ( errors.length > 0 ) {
      setErrors(errors)
      return false
    }

    return true

  }

  const displayErrors = () => {
    let allErrors = null
    if ( errors ) {
      allErrors = errors.map(error => (
        <p key={error}>{error}</p>
      ))
    }
    return <div id="errors" className="text-red-600">{allErrors}</div>
  }

  const displaySuccess = () => {
    if ( success ) return <div id="success" className="text-green-600">{success}</div>
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let time = (hours * 60 * 60) + (mins * 60)
    let timeLapsed = 0;

    const newLink = {
      title,
      urls,
      days,
      time,
      mins,
      hours,
      timeLapsed
    }

    const existingLinks: any = await chrome.storage.local.get("links");

    /* If array already exists then add the new link */
    if ( existingLinks && Array.isArray(existingLinks.links) ) {
      let linkIsValid = await validateLink(newLink, existingLinks.links)
      if ( !linkIsValid ) return

      if ( existingLinks.links.length > 0 ) {

        if ( editMode ) {
          // find link and get lapsed time
          await existingLinks.links.forEach((link: { title: string, timeLapsed: number }) => {
            if (link.title == editTitle) {
              newLink.timeLapsed = link.timeLapsed
              return
            }
          })        
          // remove old link
          existingLinks.links = await existingLinks.links.filter((link: { title: string }) => link.title !== editTitle)
        } 

        chrome.storage.local.set({"links": [newLink, ...existingLinks.links]})
        createdLinkSuccessful()
        resetState()
      }
    } else {
      chrome.storage.local.set({"links": [newLink]})
      createdLinkSuccessful()
      resetState()
    }
  }

  const addDay = (e: React.ChangeEvent<HTMLInputElement>, day: string) => {
    if ( e.target.checked && !days.includes(day) ) {
      setDays([day, ...days]);
    } else {
      let removeDay = days.filter(d => d != day)
      setDays(removeDay)
    }
  }

  const displayDays = () => {
    return Object.keys(dayOptions).map((key, index) => (
      <div className='flex flex-row flex-wrap align-items-center' key={key}>
        <input 
          className='mr-1 rounded-full'
          name={key} 
          onChange={ (e) => addDay(e, dayOptions[key as keyof typeof dayOptions]) } 
          id={dayOptions[key as keyof typeof dayOptions]} 
          type="checkbox" 
          value={dayOptions[key as keyof typeof dayOptions]} 
          checked={ days.includes(dayOptions[key as keyof typeof dayOptions]) ? true : false } 
        />
        <label htmlFor={dayOptions[key as keyof typeof dayOptions]}>{key}</label>
      </ div>
    )) 
  }

  return (
    <div>
    <form onSubmit={e => submitForm(e)}>

        { /* Title */ }
        <div className="title mb-3">
          <label className='text-base'>Title</label>
          <br />
          <input 
              className='h-8 w-full border-2 border-gray-200 rounded-md pl-2 pr-2'
              placeholder="Enter title" 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        

        { /* URLS */ }
        <div className="urls mb-3">
            <label className='text-base'>URLs</label>
            <br />
            <div className="urls__input mb-2 grid grid-cols-10">
              <input 
                  className='h-8 col-span-9 border-2 border-gray-200 rounded-md pl-2 pr-2 mr-1'
                  placeholder="Add URL" 
                  type="text" 
                  value={url}
                  onChange={(e) => updateUrlInput(e.target.value)} 
              />
              <button onClick={(e) => {
                e.preventDefault()
                addUrl()
              }} className='col-span-1 bg-blue-400 hover:bg-blue-700 text-white text-base w-8 rounded-md border-none flex items-center justify-center'>+</button>
            </div>
            { displayUrls() }
        </div>

        { /* Days of the week */ }
  
        <div className='days mb-3'>
            <label className='text-base'>Days</label>
            <br />
            <div className="flex flex-row align-items-center justify-between">
            { displayDays() }
            </div>
        </div>

        { /* Amount of time */ }
        <div className="time mb-3">
          <label className='text-base'>Time</label>
          <br />
          <div className="time__input flex flex-row items-center">
            <div className="flex flex-col">
            <input 
              className='w-20 p-1 border-2 border-gray-200 rounded-md pl-2 pr-2 mr-1' 
              onChange={(e) => setHours(parseInt(e.target.value))} 
              value={hours} 
              type="number" 
              min={0} 
              max={23} 
              placeholder="hours" 
            />
            <p className='mr-1 ml-1 justify-end'>Hours</p>
            </div>
            <div className="flex flex-col">
              <input 
                className='w-20 p-1 border-2 border-gray-200 rounded-md pl-2 pr-2' 
                onChange={(e) => setMins(parseInt(e.target.value))} 
                value={mins} 
                type="number" 
                min={0} 
                max={59} 
                placeholder="minutes" 
              />
              <p className='ml-1 justify-end'>Minutes</p>
            </div>
            
          </div>   
        </div>
        
        <button className='border-2 text-blue-400 border-blue-400 rounded-md mt-2 text-base py-1 px-2'>{ editMode ? 'Update' : 'Submit' }</button>
    </form>

    { displayErrors() }
    { displaySuccess() }

    </div>  
  )
}

export default NewTracker;
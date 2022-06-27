import React, { useEffect, useState } from 'react'
import '../index.css'
import { FiEdit } from 'react-icons/fi'

const NewTracker: any = ({ link, setOpenNewTracker, setOpenTracker, editMode, setEditMode }: any) => {
  
  const [title, setTitle] = useState<string>('')
  const [editTitle, setEditTitle] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [urls, setUrls] = useState<string[]>([])
  const [days, setDays] = useState<string[]>([])
  const [time, setTime] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [mins, setMins] = useState<number>(0)
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

  let dayOptions = [
    { label: 'Mon', value: 'monday' },
    { label: 'Tues', value: 'tuesday' },
    { label: 'Wed', value: 'wednesday' },
    { label: 'Thurs', value: 'thursday' },
    { label: 'Fri', value: 'friday' },
    { label: 'Sat', value: 'saturday' },
    { label: 'Sun', value: 'sunday' },
  ]

  const addUrl = (input: string) => {
    if (/\s+$/.test(input)) {
        setUrls([url, ...urls]);
        setUrl('');
    } else {
        setUrl(input);
    }
  }

  const removeUrl = (url: string) => {
    setUrls(urls.filter(x => x !== url))
  }

  const displayUrls = () => {
    return urls.map(url => (
        <div key={url} className="flex flex-row align-items-center">
            <img className="h-5 w-5" src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`} alt="favicon" />
            <p>{url}</p>
            <div className="text-red-600" onClick={() => removeUrl(url)}>x</div>
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

    dayOptions.forEach(day => {
      let refreshDay = document.getElementById(day.value) as HTMLInputElement
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

  const deleteLink = async () => {
    
    const existingLinks = await chrome.storage.local.get("links");
    if ( existingLinks.links ) {
      existingLinks.links = existingLinks.links.filter((link: { title: string }) => link.title !== editTitle)
      chrome.storage.local.set({"links": [...existingLinks.links]})
      setSuccess('Deleted link successfully!')
    } else {
      setErrors(['Unable to delete link...'])
    }
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let time = (hours * 60 * 60) + (mins * 60)

    const newLink = {
      title,
      urls,
      days,
      time,
      mins,
      hours,
      timeLapsed: 0
    }

    const existingLinks = await chrome.storage.local.get("links");

    /* If array already exists then add the new link */
    if ( existingLinks && Array.isArray(existingLinks.links) ) {
      let linkIsValid = await validateLink(newLink, existingLinks.links)
      if ( !linkIsValid ) return

      if ( existingLinks.links.length > 0 ) {
        if ( editMode ) {
          existingLinks.links = existingLinks.links.filter(link => link.title !== editTitle)
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
    return dayOptions.map(option => (
      <div key={option.value}>
        <input 
          name={option.label} 
          onChange={ (e) => addDay(e, option.value) } 
          id={option.value} 
          type="checkbox" 
          value={option.value} 
          checked={ days.includes(option.value) ? true : false } 
        />
        <label htmlFor={option.value}>{option.label}</label>
      </ div>
    )) 
  }

  return (
    <div>
    <form onSubmit={e => submitForm(e)}>

        { /* Title */ }
        <label>Title</label>
        <br />
        <input 
            className='h-8 w-1/2'
            placeholder="Enter title" 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
        />

        { /* URLS */ }
        <div className="urls">
            <label>URLs</label>
            <br />
            <input 
                className='h-8 w-1/2'
                placeholder="Enter URL" 
                type="text" 
                value={url}
                onChange={(e) => addUrl(e.target.value)} 
            />
            { displayUrls() }
        </div>

        { /* Days of the week */ }
  
        <div className='days'>
            <label>Days</label>
            <br />
            <div className="flex flex-row items-center justify-between">
            { displayDays() }
            </div>
        </div>

        { /* Amount of time */ }
        <label>Time</label>
        <br />
        <input onChange={(e) => setHours(parseInt(e.target.value))} value={hours} type="number" placeholder="hours" />:
        <input onChange={(e) => setMins(parseInt(e.target.value))} value={mins} type="number" placeholder="minutes" />

        <br />
        <button className='bg-purple-200 mt-2 text-base'>{ editMode ? 'Update' : 'Submit' }</button>
    </form>

    { displayErrors() }
    { displaySuccess() }
    
    { editMode ? (<button className='bg-red-500' onClick={ () => deleteLink() }>Delete</button>) : (<></>) }

    </div>  
  )
}

export default NewTracker;
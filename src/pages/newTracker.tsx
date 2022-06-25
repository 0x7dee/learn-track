import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../index.css'

const NewTracker: any = () => {
  
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [urls, setUrls] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [time, setTime] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [mins, setMins] = useState<number>(0);
  const [errors, setErrors] = useState<string[]>([]);

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

  const showUrls = () => {
    return urls.map(url => (
        <div key={url} className="flex flex-row align-items-center">
            <img className="h-5 w-5" src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`} alt="favicon" />
            <p>{url}</p>
            <div className="text-red-600" onClick={() => removeUrl(url)}>x</div>
        </div>
    ))
  }

  const addDay = (day: string) => {
    setDays([day, ...days]);
  }

  const getData = async () => {
    const data = await chrome.storage.local.get("links"); 
    console.log(data.links);
  }

  const clearData = async () => {
    await chrome.storage.local.set({"links": null});
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let time = (hours * 60 * 60) + (mins * 60)

    const newLink = {
      title,
      urls,
      days,
      time,
      timeLapsed: 0
    }

    const existingLinks = await chrome.storage.local.get("links");

    if ( existingLinks && Array.isArray(existingLinks.links) ) {
      let linkIsValid = await validateLink(newLink, existingLinks.links)
      if ( !linkIsValid ) {
        alert("Link is not valid!")
        return
      }

      // Array is empty
      if ( linkIsValid && existingLinks.links.length > 0 ) {
        chrome.storage.local.set({"links": [newLink, ...existingLinks.links]})
      }
    } else {
      chrome.storage.local.set({"links": [newLink]})
    }
  }

  const validateLink = async (link: any, links: any) => {
    let { title, urls, days, time, timeLapsed } = link;
    let errors: string[] = [];

    /* Check if title already exists */
    await links.map((link: { title: string; }) => {
      if (link.title == title) errors.push("title already exists")
    })
    
    /* Make sure urls exist */
    if ( urls.length < 1 ) errors.push("No urls are set")
    
    /* Check days are selected */
    if ( days.length < 1 ) errors.push("No days are selected")

    /* Check time, timeElapsed exists */
    if ( time < 1 || timeLapsed !== 0 ) errors.push("Time must exist and be greater than 1")

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
        <p>{error}</p>
      ))
    }
    return <div id="errors" className="text-red-600">{allErrors}</div>
  }


  return (
    <div className="w-96 h-96">
    <h1>NewTracker</h1>
    <Link to="/">Home</Link>

    <form onSubmit={e => submitForm(e)}>

        { /* Title */ }
        <label>Title</label>
        <br />
        <input 
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
                placeholder="Enter URL" 
                type="text" 
                value={url}
                onChange={(e) => addUrl(e.target.value)} 
            />
            { showUrls() }
        </div>

        { /* Days of the week */ }
  
        <div className="flex flex-row align-items-center mt-10 mb-10">
            { dayOptions.map(option => (
                <div className="days--day" key={option.value}>
                  <input name={option.label} onClick={ () => addDay(option.value) } id={option.value} type="radio" value={option.value} />
                  <label htmlFor={option.value}>{option.label}</label>
                </ div>
            )) }
        </div>

        { /* Amount of time */ }
        <label>Time</label>
        <br />
        <input onChange={(e) => setHours(parseInt(e.target.value))} type="number" placeholder="hours" />:
        <input onChange={(e) => setMins(parseInt(e.target.value))} type="number" placeholder="minutes" />

        <button>Submit</button>
    </form>

    { displayErrors() }
    
    <button onClick={ () => getData() }>get data</button>
    <button onClick={ () => clearData() }>clear data</button>
    </div>  
  )
}

export default NewTracker;
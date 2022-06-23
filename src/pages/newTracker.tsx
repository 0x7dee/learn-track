import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './newTracker.scss'

const NewTracker: any = () => {
  
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [urls, setUrls] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [time, setTime] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [mins, setMins] = useState<number>(0);

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
        <div key={url} className="displayUrls">
            <img className="displayUrls--icon" src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`} alt="favicon" />
            <p>{url}</p>
            <div className="displayUrls--remove" onClick={() => removeUrl(url)}>x</div>
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
    await chrome.storage.local.set({"links": []});
  }

  const linkAlreadyExists = async (newLinkTitle: string, linkArrayName: string) => {

    let existingLinks = await chrome.storage.local.get(linkArrayName);

    existingLinks.links.forEach((link: { title: string; }) => {
      if ( newLinkTitle === link.title ) {
        return true
      }
    })

    return false
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
      // Array is empty
      if (!existingLinks.links.length) {
        chrome.storage.local.set({"links": [newLink]})
      } else if ( existingLinks.links.length > 0 ) {
        // Check if link already exists
        if ( await linkAlreadyExists(newLink.title, "links") ) {
          console.log("Link already exists...")
        } else {
          chrome.storage.local.set({"links": [newLink, ...existingLinks.links]})
        }
      }
    } else {
      chrome.storage.local.set({"links": [newLink]})
    }

    
  }


  return (
    <>
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
  
        <div className="days">
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
    
    <button onClick={ () => getData() }>get data</button>
    <button onClick={ () => clearData() }>clear data</button>
    </>  
  )
}

export default NewTracker;
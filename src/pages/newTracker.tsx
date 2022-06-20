import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


const NewTracker: any = () => {
  
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [urls, setUrls] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [time, setTime] = useState<number[]>([0,0]);

  let dayOptions = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' },
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
    const data = await chrome.storage.sync.get("links"); 
    console.log(data.links);
  }

  const clearData = async () => {
    await chrome.storage.sync.set({"links": []});
  }

  const linkAlreadyExists = async (newLinkTitle: string, linkArrayName: string) => {

    let existingLinks = await chrome.storage.sync.get(linkArrayName);

    existingLinks.links.forEach((link: { title: string; }) => {
      if ( newLinkTitle === link.title ) {
        return true
      }
    })

    return false
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newLink = {
      title,
      urls,
      days,
      time
    }

    const existingLinks = await chrome.storage.sync.get("links");

    if ( existingLinks && Array.isArray(existingLinks.links) ) {
      // Array is empty
      if (!existingLinks.links.length) {
        chrome.storage.sync.set({"links": [newLink]})
      } else if ( existingLinks.links.length > 0 ) {
        // Check if link already exists
        if ( await linkAlreadyExists(newLink.title, "links") ) {
          console.log("Link already exists...")
        } else {
          chrome.storage.sync.set({"links": [newLink, ...existingLinks.links]})
        }
      }
    }

    
  }


  return (
    <>
    <h1>NewTracker</h1>
    <Link to="/">Home</Link>

    <form onSubmit={e => submitForm(e)}>

        { /* Title */ }
        <label>Title</label>
        <input 
            placeholder="Enter title" 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
        />

        { /* URLS */ }
        <div className="urls">
            <label>URLs</label>
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
        <input onChange={(e) => setTime([parseInt(e.target.value), time[1]])} type="number" placeholder="hours" />:
        <input onChange={(e) => setTime([time[0], parseInt(e.target.value)])} type="number" placeholder="minutes" />

        <button>Submit</button>
    </form>
    
    <button onClick={ () => getData() }>get data</button>
    <button onClick={ () => clearData() }>clear data</button>
    </>  
  )
}

export default NewTracker;
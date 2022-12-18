import React, { useEffect, useState } from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import '../index.css'

const NewTracker: any = ({ link, editMode }: any) => {

  let defaultDays = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  }

  let dayOptions = {
    Mon: 'Monday',
    Tues: 'Tuesday',
    Wed: 'Wednesday',
    Thurs: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday'
  }
  
  const [title, setTitle] = useState<string>('')
  const [editTitle, setEditTitle] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [urls, setUrls] = useState<string[]>([])
  const [days, setDays] = useState<any>(defaultDays)
  const [time, setTime] = useState<number>(0)
  const [hours, setHours] = useState<any>('0')
  const [mins, setMins] = useState<any>('0')
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string>('')

  useEffect(() => {

    if (link && editMode) {
      setTitle(link.title)
      setEditTitle(link.title)
      setUrls(link.urls)
      setDays(link.days)
      setMins(link.mins ? link.mins.toString() : '0')
      setHours(link.hours ? link.hours.toString() : '0')
    }
  }, [])

  const updateUrlInput = (input: string) => {
    {/* spacebar will add url */}
    if (/\s+$/.test(input)) {
        addUrl(url)
    } else {
        setUrl(input);
    }
  }

  const addUrl  = (url: string) => {
      let alreadyExists = urls.includes(url)
      let protocolSet = includesProtocol(url)

      if ( !alreadyExists && protocolSet ) {
        setUrls([url, ...urls]);
        setUrl('');
        setErrors([])
      } else if ( !protocolSet ) {
        setErrors(['Add protocol to URL (i.e. https://)', ...errors])
      } else {
        setErrors(['URL already exists', ...errors])
      }
  }

  const removeUrl = (url: string) => {
    setUrls(urls.filter(x => x !== url))
  }

  const displayUrls = () => {
    return urls.map(url => (
        <div key={url} className="grid grid-cols-10 align-items-center mb-1 w-full">
            <img className="h-5 w-5 cols-span-1" src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`} alt="favicon" />
            <p className='mr-3 col-span-8'>{formatUrl(url)}</p>
            <div className="text-red-600 cursor-pointer cols-span-1" onClick={() => removeUrl(url)}>x</div>
        </div>
    ))
  }

  const resetState = () => {
    setTitle('')
    setEditTitle('')
    setUrl('')
    setUrls([])
    setDays(defaultDays)
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
    setSuccess(editMode ? "Updated link successfully!" : "New link created successfully!")
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

    /* Check title exists */
    if ( title.length < 1 ) errors.push("No title is set")
    
    /* Check urls exist */
    if ( urls.length < 1 ) errors.push("No urls are set")
    
    /* Check days are selected */
    if ( JSON.stringify(days) === JSON.stringify(defaultDays) ) errors.push("No days are selected")

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

    let time = (( hours ? parseInt(hours) : 0 ) * 60 * 60) + (( mins ? parseInt(mins) : 0 ) * 60)
    let timeLapsed = 0;

    const newLink = {
      title,
      urls,
      days,
      time,
      mins: parseInt(mins),
      hours: parseInt(hours),
      timeLapsed
    }

    const existingLinks: any = await chrome.storage.local.get("links");

    /* If array already exists then add the new link */
    if ( existingLinks && Array.isArray(existingLinks.links) && existingLinks.links.length > 0 ) {
      let linkIsValid = await validateLink(newLink, existingLinks.links)
      if ( !linkIsValid ) return

      if ( existingLinks.links.length > 0 ) {
        console.log("I AM HERE")
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
      console.log("Creating new link")
      chrome.storage.local.set({"links": [newLink]})
      createdLinkSuccessful()
      resetState()
    }
  }

  const addDay = (e: React.ChangeEvent<HTMLInputElement>, day: string) => {
    if ( e.target.checked && !days[day] ) {
      setDays({ ...days, [day]: true })
    } else {
      setDays({ ...days, [day]: false })
    }
  }

  const formatUrl = (url: string) => {
    let removeHttps = url.replace(/^https?:\/\//, '')
    let removeHttp = removeHttps.replace(/^http?:\/\//, '')
    return removeHttp
  }

  const includesProtocol = (url: string): boolean => {
    if (/^https?:\/\//.test(url)) return true
    if (/^http?:\/\//.test(url)) return true
    return false
  }

  const displayDays = () => {
    return Object.keys(dayOptions).map((key, index) => (
      <div className='flex flex-row flex-wrap align-items-center' key={key}>
        <input 
          className='mr-1 rounded-full accent-white'
          name={key} 
          onChange={ (e) => addDay(e, dayOptions[key as keyof typeof dayOptions]) } 
          id={dayOptions[key as keyof typeof dayOptions]} 
          type="checkbox" 
          value={dayOptions[key as keyof typeof dayOptions]} 
          checked={ days[dayOptions[key as keyof typeof dayOptions]] ? true : false } 
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
              className='h-8 w-full border border-neutral-200 rounded-md pl-2 pr-2 focus:border-sky-300 focus:outline-none'
              placeholder="Pick a name for your new link..." 
              type="text" 
              maxLength={18}
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        
        { /* URLS */ }
        <div className="urls mb-3">
            <div className="addUrls -mb-4 flex flex-row items-center">
              <label className='text-base mr-2'>Add URLs</label>
              <div className="relative flex flex-row items-center h-full w-16">
                <AiOutlineQuestionCircle className='peer' />
                <div className="absolute w-48 h-36 -bottom-36 left-0 bg-white z-10 hidden peer-hover:block overflow-hidden px-4 py-2 rounded-md border-slate-100 border-2">
                  <p>Enter substrings of the URLs that you would like to match i.e. https://mysite.com will match URLs such as https://mysite.com/about</p>
                </div>
              </div>
            </div>
            <br />
            <div className="urls__input mb-2 grid grid-cols-10">
              <input 
                  className='h-8 col-span-9 border border-neutral-200 rounded-md pl-2 pr-2 mr-1 focus:border-sky-300 focus:outline-none'
                  placeholder="Type a URL then click the plus button..." 
                  type="text" 
                  value={url}
                  onChange={(e) => updateUrlInput(e.target.value)} 
              />
              <button onClick={(e) => {
                e.preventDefault()
                addUrl(url)
              }} className='col-span-1 bg-sky-300 hover:bg-sky-400 text-white text-base w-8 rounded-md border-none flex items-center justify-center transition ease-in-out duration-300'>+</button>
            </div>
            <div className='max-h-24 overscroll-contain overflow-y-auto'>
              { displayUrls() }
            </div>
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
        <div className="time mb-2">
          <label className='text-base'>Time</label>
          <br />
          <div className="time__input flex flex-row items-center">
            <div className="flex flex-col">
            <input 
              className='w-20 p-1 border border-neutral-200 rounded-md pl-2 pr-2 mr-1 focus:border-sky-300 focus:outline-none' 
              onChange={(e) => setHours(e.target.value)} 
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
                className='w-20 p-1 border border-neutral-200 rounded-md pl-2 pr-2 focus:border-sky-300 focus:outline-none' 
                onChange={(e) => {
                  setMins(e.target.value)    
                }} 
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
        
        <button className='rounded-md mt-2 text-sm py-1 px-2 w-full border text-sky-400 border-sky-400 hover:text-neutral-100 hover:bg-sky-400 transition ease-in-out duration-300'>{ editMode ? 'Update' : 'Submit' }</button>
    </form>

    { displayErrors() }
    { displaySuccess() }

    </div>  
  )
}

export default NewTracker;
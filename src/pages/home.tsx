import React, { useEffect, useState } from "react";
import '../index.css';
import NewTracker from "./newTracker";
import Tracker from "./tracker";


function Home() {
  const [existingLinks, setExistingLinks]: any = useState([])
  const [loading, setLoading] = useState(true)
  const [openTracker, setOpenTracker] = useState(false)
  const [openNewTracker, setOpenNewTracker] = useState(false)
  const [link, setLink]: any = useState(null)
  const [editMode, setEditMode] = useState(false)
  
  useEffect(() => {
    const secondInterval = setInterval(async () => {
      updateLinks();
      if (loading) {
        setLoading(false)
      }
    }, 1000)
    return () => clearInterval(secondInterval)
    
  }, [])

  const updateLinks = async () => {
    const existingLinks = await chrome.storage.local.get("links");
    setExistingLinks(existingLinks.links);
  };

  const updateProgressBar = (time: number, timeLapsed: number) => {
    let width = "100%"
    if (timeLapsed <= time) {
      width = Math.ceil((timeLapsed / time) * 100).toString() + "%"
    }
    return width
  }

  const timeLeft = (time: number, timeLapsed: number) => {
    /* 7500 sec, 125 mins, 2hr 5mins */
    let secondsLeft = time - timeLapsed
    let hoursLeft = Math.floor(secondsLeft / 60 / 60)
    let minsLeft = Math.floor(secondsLeft / 60) - (hoursLeft * 60)

    if (timeLapsed < time) {
      if (secondsLeft < 60) return `${secondsLeft}secs`
      
      if ( hoursLeft === 0 && minsLeft > 0 ) {
        return `${minsLeft}mins`
      } else if ( hoursLeft > 0 && minsLeft === 0 ) {
        return `${hoursLeft}hr`
      }

      return `${hoursLeft}hr ${minsLeft}mins`
    } else {
      return "Complete"
    }
  }

  const displayNavigation = () => {
    return (
      <nav className="relative">
        <button 
          className={`${!openNewTracker && !openTracker ? 'underline' : ''} mr-2`}
          onClick={() => { 
            setOpenNewTracker(false) 
            setOpenTracker(false)
            setEditMode(false)
            setLink(null)
          }}>Home</button>
        <button 
          className={`${openNewTracker && !openTracker ? 'underline' : ''} mb-3`}
          onClick={() => { 
            setOpenNewTracker(true) 
            setOpenTracker(false)
            setEditMode(false)
            setLink(null)
          }}>Add New Link</button>
      </nav>
    )
  }

  const displayPage = () => {
    if ( loading ) {
      return <p>Loading...</p>
    }

    if ( openTracker ) {
      return <Tracker 
                link={link} 
                setOpenTracker={setOpenTracker} 
                setOpenNewTracker={setOpenNewTracker} 
                editMode={editMode} 
                setEditMode={setEditMode}
              />
    }

    if ( openNewTracker ) {
      return <NewTracker 
                link={link} 
                setOpenTracker={setOpenTracker} 
                setOpenNewTracker={setOpenNewTracker} 
                editMode={editMode}
                setEditMode={setEditMode}
              />
    }

    if (existingLinks && existingLinks.length > 0) {
      return existingLinks.map(
        (link: {
          urls: any,
          title: string,
          timeLapsed: number,
          time: number,
          mins: number,
          hours: number
        }) => (
            <div 
              onClick={() => {
                setLink(link)
                setOpenNewTracker(false)
                setOpenTracker(true)
              }} className="grid grid-cols-11 items-center mb-5 cursor-pointer" key={link.title}>
              <div className="col-span-3 grid grid-cols-4">
                <img
                  className="h-5 w-5 self-start col-span-1"
                  src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.urls[0]}`}
                  alt="favicon"
                />
                <h1 className="self-center col-span-3">{link.title}</h1>
              </div>
              <div className={`col-span-5 w-full h-3/4 border-2 ${ link.time > link.timeLapsed ? ('border-slate-200') : ('border-none') } rounded-full overflow-hidden`}>
                <div 
                  id={`${link.title}-progress`} 
                  className={`h-full transition linear delay-500 ${ link.time > link.timeLapsed ? ('bg-blue-400') : ('bg-green-400') }`}
                  style={{ width: updateProgressBar(link.time, link.timeLapsed) }}
                />
              </div>
              <div className="time col-span-3 justify-self-end items-center">
                <p>{ timeLeft(link.time, link.timeLapsed) }</p>
              </div>
            </div>
        )
      );
      
    } else {
      return <p>No links available...</p>;
    }
  };

  return (
    <div className="w-96 h-[32rem]">
      <div className="header bg-slate-100 p-5 pr-8 pl-8">
        <h1 className="text-3xl font-sans mb-1">Time Tracker</h1>
        { displayNavigation() }
      </div>
      <div className="displayPage p-5 pr-8 pl-8">
        { displayPage() }
      </div>
    </div>
  );
}

export default Home;

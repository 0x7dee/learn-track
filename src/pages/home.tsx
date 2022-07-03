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
  const [onlyShowToday, setOnlyShowToday] = useState(true)
  
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
          className={`${openNewTracker && !openTracker ? 'underline' : ''} mb-3 mr-2`}
          onClick={() => { 
            setOpenNewTracker(true) 
            setOpenTracker(false)
            setEditMode(false)
            setLink(null)
          }}>Add New</button>
      </nav>
    )
  }

  const displayLinkToggle = () => {
    if (!openTracker && !openNewTracker) {
      return (
        <div className="displayPage__toggle mb-6 flex flex-row">
          <p onClick={ () => setOnlyShowToday(true) } className={`mr-2 cursor-pointer ${ onlyShowToday ? 'underline' : '' }`}>Today</p>
          <p onClick={ () => setOnlyShowToday(false) } className={`cursor-pointer ${ !onlyShowToday ? 'underline' : '' }`}>Show all {`(${ existingLinks ? existingLinks.length : '0' })`}</p>
        </div>
      )
    }
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
                setEditMode={setEditMode}
              />
    }

    if ( openNewTracker ) {
      return <NewTracker 
                link={link} 
                editMode={editMode}
              />
    }

    if (existingLinks && existingLinks.length > 0) {
      let todaysDate = new Date();
      let today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][todaysDate.getDay()]
      let anyLinksForToday = existingLinks.reduce((prev: number, link: any) => prev + (link.days[today] === true ? 1 : 0), 0)

      if (onlyShowToday && anyLinksForToday === 0) {
        return <p>No links for today...</p>
      }

      return existingLinks.map(
        (link: {
          urls: any,
          title: string,
          timeLapsed: number,
          time: number,
          mins: number,
          hours: number,
          days: any
        }, index: number) => {
            
            {/* Filter out days */}
            if ( onlyShowToday && !link.days[today] ) return

            return (
            <div 
              key={`${link.title}-${index}-homepage`}
              onClick={() => {
                setLink(link)
                setOpenNewTracker(false)
                setOpenTracker(true)
              }} className="grid grid-cols-12 content-center mb-5 cursor-pointer" >
                <div className="col-span-4 grid grid-cols-4 self-center content-center">
                  <img
                    className="h-5 w-5 justify-self-start self-center col-span-1"
                    src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.urls[0]}`}
                    alt="favicon"
                  />
                  <h1 className="self-center col-span-3">{link.title}</h1>
                </div>
                <div className={`flex flex-row items-center self-center col-span-5 w-full h-4 border-2 ${ link.time > link.timeLapsed ? ('border-slate-200') : ('border-none') } rounded-full overflow-hidden`}>
                  <div 
                    id={`${link.title}-progress`} 
                    className={`h-full transition linear delay-500 ${ link.time > link.timeLapsed ? ('bg-blue-400') : ('bg-green-400') }`}
                    style={{ width: updateProgressBar(link.time, link.timeLapsed) }}
                  />
                </div>
                <div className="time col-span-3 justify-self-end items-center self-center">
                  <p>{ timeLeft(link.time, link.timeLapsed) }</p>
                </div>
            </div>
            )
        }
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
        { displayLinkToggle() }
        <div id="page">
          { displayPage() }
        </div> 
      </div>
    </div>
  );
}

export default Home;

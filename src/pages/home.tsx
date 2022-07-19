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
      <nav className="relative flex flex-row items-center mt-2">
        <button 
          className={`${!openNewTracker && !openTracker ? 'text-black' : 'text-slate-400'} mr-2`}
          onClick={() => { 
            setOpenNewTracker(false) 
            setOpenTracker(false)
            setEditMode(false)
            setLink(null)
          }}>Home</button>
          <button 
          className={`${'text-slate-400'} mr-2`}
          onClick={() => chrome.runtime.openOptionsPage()}>Dashboard</button>
          <button 
          className={`${'text-slate-400'} mr-2`}
          onClick={() => {}}>Learn</button>
          <button 
          className={`${'text-slate-400'} mr-2`}
          onClick={() => {}}>About</button>
      </nav>
    )
  }

  const displayLinkToggle = () => {
    if (!openTracker && !openNewTracker) {
      return (
        <div className="displayPage__toggle mb-6 flex flex-row items-center w-full">
          <p onClick={ () => setOnlyShowToday(true) } className={`mr-2 cursor-pointer ${ onlyShowToday ? 'text-black' : 'text-slate-400' }`}>Today</p>
          <p onClick={ () => setOnlyShowToday(false) } className={`cursor-pointer ${ !onlyShowToday ? 'text-black' : 'text-slate-400' }`}>Show all {`(${ existingLinks ? existingLinks.length : '0' })`}</p>
           <button 
            className='ml-auto rounded-md text-xs py-1 px-0 w-16 border text-sky-400 border-sky-400 hover:text-neutral-100 hover:bg-sky-400 transition ease-in-out duration-300'
            onClick={() => { 
              setOpenNewTracker(true) 
              setOpenTracker(false)
              setEditMode(false)
              setLink(null)
            }}
            >New</button>
        </div>
      )
    }
  }

  const shortenTitle = (title: string) => {
    if ( title.length > 10 ) {
      return title.slice(0, 8) + '...'
    }
    return title
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
                link={link || {}} 
                editMode={editMode || false}
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
                  <h1 className="self-center col-span-3">{shortenTitle(link.title)}</h1>
                </div>
                <div className={`flex flex-row items-center self-center col-span-5 w-full h-3 border ${ link.time > link.timeLapsed ? ('border-neutral-200') : ('border-none') } rounded-full overflow-hidden`}>
                  <div 
                    id={`${link.title}-progress`} 
                    className={`h-full transition linear delay-500 ${ link.time > link.timeLapsed ? ('bg-sky-200') : ('bg-lime-300') }`}
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
    <div className="w-96 min-h-[34rem] max-h-[42rem] relative">
      <div className="header bg-neutral-50 pt-6 pb-6 pr-8 pl-8 border-dashed border-slate-300 border-b-2">
        <a href="https://vproductive.co" rel='noopener' target='_blank' className="hover:text-blue-300">
          <h1 className="text-3xl font-serif mb-1"><span className="text-blue-300">v</span>Productive.co</h1>
        </a>
        { displayNavigation() }
      </div>
      <div className="displayPage pt-5 pb-12 pr-8 pl-8 font-sans">
        { displayLinkToggle() }
        <div id="page">
          { displayPage() }
        </div> 
      </div>
      <div id="advertisement" className="w-full h-10 flex flex-row items-center absolute bottom-0 pr-8 pl-8 border-dashed border-slate-300 border-t-2">
        <p>Want to 10x your online productivity? Check <a rel="noopener" className="text-blue-400" href="https://www.google.com" target='_blank'>this</a> out</p>
      </div>
    </div>
  );
}

export default Home;

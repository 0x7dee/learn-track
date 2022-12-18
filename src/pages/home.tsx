import React, { useEffect, useState } from "react";
import '../index.css';
import NewTracker from "./newTracker";
import Tracker from "./tracker";
import ProPlan from "./proPlan";
import Settings from "./settings";
import StudyPlan from "./studyPlan";
import History from "./history";


function Home() {
  const [existingLinks, setExistingLinks]: any = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')
  const [link, setSelectedLink]: any = useState({})
  const [editMode, setEditMode] = useState(false)
  const [onlyShowToday, setOnlyShowToday] = useState(true)
  const [isMember, setIsMember] = useState(true)
  
  useEffect( () => {

    let secondInterval = setInterval(async () => {
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
      if (secondsLeft < 60) return `${secondsLeft}sec`
      
      if ( hoursLeft === 0 && minsLeft > 0 ) {
        return `${minsLeft}min`
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
          className={`${ currentPage === 'home' ? 'text-black' : 'text-slate-400'} mr-2 hover:underline-offset-2 hover:underline`}
          onClick={() => {
            setCurrentPage("home")
            setEditMode(false)
            setSelectedLink({})
          }}>Home</button>
          <button 
            className={`${ currentPage === 'studyPlan' ? 'text-black' : 'text-slate-400'} mr-2 hover:underline-offset-2 hover:underline`}
            onClick={() => setCurrentPage('studyPlan')}
            >Study Plan</button>
          <button 
            className={`${ currentPage === 'history' ? 'text-black' : 'text-slate-400'} mr-2 hover:underline-offset-2 hover:underline`}
            onClick={() => setCurrentPage('history')}
            >History</button>
          <button 
            className={`${ currentPage === 'settings' ? 'text-black' : 'text-slate-400'} mr-2 hover:underline-offset-2 hover:underline`}
            onClick={() => setCurrentPage('settings')}
            >Settings</button>
      </nav>
    )
  }

  const displayLinkToggle = () => {
    if ( currentPage === 'home' && isMember ) {
      return (
        <div className="displayPage__toggle mb-6 flex flex-row items-center w-full">
          <p onClick={ () => setOnlyShowToday(true) } className={`mr-2 cursor-pointer ${ onlyShowToday ? 'text-black' : 'text-slate-400' }`}>Today</p>
          <p onClick={ () => setOnlyShowToday(false) } className={`cursor-pointer ${ !onlyShowToday ? 'text-black' : 'text-slate-400' }`}>Show all {`(${ existingLinks ? existingLinks.length : '0' })`}</p>
           <button 
            className='ml-auto rounded-md text-xs py-1 px-0 w-16 border text-sky-400 border-sky-400 hover:text-neutral-100 hover:bg-sky-400 transition ease-in-out duration-300'
            onClick={() => setCurrentPage("newTracker")}
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

  const getLinks = async () => {
    let links = await chrome.storage.local.get('links')
    console.log(links)
  }

  const getDates = async () => {
    let dates = await chrome.storage.local.get('dates')
    console.log(dates)
  }
  
  const getViewHistory = async () => {
    let viewHistory = await chrome.storage.local.get('viewHistory')
    console.log(viewHistory)
  }

  const clearViewHistory = async () => {
    await chrome.storage.local.set({'viewHistory': {}})
  }

  const setDummyData = async () => {
    
    let getDates = await chrome.storage.local.get('dates')
    getDates.dates['08/09/2022'] = { "a": true } 
    getDates.dates['09/09/2022'] = { "a": false, "b": true }
    getDates.dates['11/09/2022'] = { "a": false, "b": false, "c": true }

    await chrome.storage.local.set({ dates: getDates.dates })
  } 

  const clearDates = async () => {
    await chrome.storage.local.set({dates: {}})
  }

  const clearLinks = async () => {
    await chrome.storage.local.set({links: []})
  }

  const displayPage = () => {
    
    if (!isMember) return <ProPlan />
    
    if ( loading ) {
      return <p>Loading...</p>
    }

    if ( currentPage === 'studyPlan' ) return <StudyPlan />

    if (currentPage === 'history' ) return <History />

    if ( currentPage === 'settings' ) return <Settings />

    if ( currentPage === 'proPlan' ) return <ProPlan />
    
    if ( currentPage === 'tracker' ) {
      return <Tracker 
                link={link} 
                setCurrentPage={setCurrentPage} 
                setEditMode={setEditMode}
              />
    }

    if ( currentPage === 'newTracker' ) {
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
                setSelectedLink(link)
                setCurrentPage('tracker')
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
                    className={`h-full transition linear delay-500 ${ link.time > link.timeLapsed ? ('bg-amber-300') : ('bg-green-300') }`}
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
      return (
        <div>
          <h1>No links available...</h1>
        </div>
      );
    }
  };

  return (
    <div className="w-96 min-h-[34rem] max-h-[42rem] relative rounded-md overflow-hidden">
      <div className="header pt-6 pb-6 pr-8 pl-8 border-dashed border-slate-300 border-b-2">
        <a className="text-2xl font-serif" href="https://learntrack.co" rel='noopener' target='_blank'>
          LearnTrack.co
        </a> 
        { displayNavigation() }
      </div>
      <div className="displayPage pt-5 pb-12 pr-8 pl-8 font-sans">
        { displayLinkToggle() }
        <div id="page">
          { displayPage() }
        </div> 
      </div>
      
      <button onClick={() => getLinks()}>Get Links</button><br />
      <button onClick={() => clearLinks()}>Clear Links</button><br />
      {/* 
      <button onClick={() => getViewHistory()}>Get History</button><br />
      <button onClick={() => clearViewHistory()}>Clear History</button><br />
      
      <button onClick={() => getDates()}>Get Dates</button>
       
      <button onClick={() => setDummyData()}>Set Dummy Data</button>
      <button onClick={() => deleteData()}>Delete Data</button>
      */}
    </div>
  );
}

export default Home;

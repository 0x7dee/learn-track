import React, { useEffect, useState } from "react";
import '../index.css';
import NewTracker from "./newTracker";
import Tracker from "./tracker";
import ProPlan from "./proPlan";
import Settings from "./settings";
import StudyPlan from "./studyPlan";
import History from "./history";
import { compareUrls, getCurrentTab } from "../utils/functions";
import Privacy from "./privacy";


function Home() {
  const [existingLinks, setExistingLinks]: any = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')
  const [link, setSelectedLink]: any = useState({})
  const [editMode, setEditMode] = useState(false)
  const [onlyShowToday, setOnlyShowToday] = useState(true)
  const [isMember, setIsMember] = useState(true)
  const [currTab, setCurrTab] = useState('')

  useEffect(() => {
    setCurrentTab()
    updateLinks();

    if (loading) {
      setLoading(false)
    }
  }, [])
  
  useEffect( () => {
    
    let secondInterval = setInterval(async () => {
      updateLinks();

      if (loading) {
        setLoading(false)
      }
    }, 1000)
    return () => clearInterval(secondInterval)
    
  }, [existingLinks])

  const setCurrentTab = async () => {
    let tab: any = await getCurrentTab()
    setCurrTab(tab.url)
  }

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

      return `${hoursLeft}hr ${minsLeft}min`
    } else {
      return "Complete"
    }
  }

  const displayNavigation = () => {
    return (
      <nav className="relative flex flex-row items-center justify-between mt-2">
        <button 
          className={`${ currentPage === 'home' ? 'text-black' : 'text-slate-400'} mr-2 hover:text-black`}
          onClick={() => {
            setCurrentPage("home")
            setEditMode(false)
            setSelectedLink({})
          }}>home</button>
          <button 
            className={`${ currentPage === 'studyPlan' ? 'text-black' : 'text-slate-400'} mr-2 hover:text-black`}
            onClick={() => setCurrentPage('studyPlan')}
            >study plan</button>
          <button 
            className={`${ currentPage === 'history' ? 'text-black' : 'text-slate-400'} mr-2 hover:text-black`}
            onClick={() => setCurrentPage('history')}
            >time tracker</button>
          <button 
            className={`${ currentPage === 'privacy' ? 'text-black' : 'text-slate-400'} mr-2 hover:text-black`}
            onClick={() => setCurrentPage('privacy')}
            >privacy</button>
          <button 
            className={`${ currentPage === 'settings' ? 'text-black' : 'text-slate-400'} mr-2 hover:text-black`}
            onClick={() => setCurrentPage('settings')}
            >settings</button>
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
      return title.slice(0, 10) + '...'
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

    if ( currentPage === 'privacy' ) return <Privacy />

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
          days: any,
          autotrack: any
        }, index: number) => {
            
            {/* Filter out days */}
            if ( onlyShowToday && !link.days[today] ) return

            //console.log(link)
            let { urls, days, autotrack } = link
            let isToday = days[today]
            let urlsContainCurrUrl = false

            
            urls.forEach((url: string) => {
              if ( compareUrls(url, currTab) ) urlsContainCurrUrl = true
            });
            

            return (
            <div 
              key={`${link.title}-${index}-homepage`}
              onClick={() => {
                setSelectedLink(link)
                setCurrentPage('tracker')
              }} className="grid grid-cols-12 content-center mb-5 cursor-pointer" >
                <div className="col-span-5 grid grid-cols-6 self-center content-center">
                  <img
                    className="h-5 w-5 justify-self-start self-center col-span-1"
                    src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.urls[0]}`}
                    alt="favicon"
                  />
                  <div className="col-span-5 flex items-center w-full h-full">
                    <h1 className="self-center ml-2">{shortenTitle(link.title)}</h1>
                    <span className={`${ (urlsContainCurrUrl || autotrack) && isToday && (link.time > link.timeLapsed) ? 'bg-green-400' : 'hidden' } w-1 h-1 ml-2 rounded-full`}></span>
                  </div>
                </div>
                <div className={`col-span-4 flex flex-row items-center self-center w-full h-3 border ${ link.time > link.timeLapsed ? ('border-neutral-200') : ('border-none') } rounded-full overflow-hidden`}>
                  <div 
                    id={`${link.title}-progress`} 
                    className={`h-full transition linear delay-500 ${ link.time > link.timeLapsed ? ('bg-amber-300') : ('bg-green-300') }`}
                    style={{ width: updateProgressBar(link.time, link.timeLapsed) }}
                  />
                </div>     
                <div className="col-span-3 justify-self-end items-center self-center">
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

  const displayProBanner = () => {
    return (
      <div className="fixed z-10 bottom-0 flex flex-row items-center py-2 pr-8 pl-8 w-full border-dashed border-slate-300 border-t-2">
        <p className="flex flex-row items-center">
          <span className="text-lg mr-1">🎉</span> 
          <a href='https://google.com' target={'_blank'} className="text-sky-400 cursor-pointer font-bold mr-1 hover:underline hover:underline-offset-2 hover:decoration-text-sky-400">Join today</a> 
          <p>and 10x your productivity for only $3/m!</p>
        </p>
      </div>
    )
  }

  return (
    <div className="w-96 min-h-[34rem] max-h-[42rem] relative rounded-md overflow-hidden">
      { displayProBanner() } 

      <div className="header pt-6 pb-6 pr-8 pl-8 border-dashed border-slate-300 border-b-2">
        <div className="flex flex-row items-center text-2xl">
          <a className="font-serif mr-4" href="https://learntrack.co" rel='noopener' target='_blank'>
            LearnTrack 
          </a> 
          <div className="flex flex-row items-center justify-between w-full">
            <p className="">📚</p> 
            <p className="">🤓</p> 
            <p className="">🧠</p>
            <p className="">🤑</p>
            <p className="">✍</p>
          </div>
        </div>
        
        { displayNavigation() }
      </div>
      <div className="displayPage pt-5 pb-12 pr-8 pl-8 font-sans">
        { displayLinkToggle() }
        <div id="page">
          { displayPage() }
        </div>
      </div>
      
      
      {/* 
      <button onClick={() => getViewHistory()}>Get History</button><br />
      <button onClick={() => getLinks()}>Get Links</button><br />
      <button onClick={() => clearLinks()}>Clear Links</button><br />
      
      <button onClick={() => clearViewHistory()}>Clear History</button><br />
      
      <button onClick={() => getDates()}>Get Dates</button>
       
      <button onClick={() => setDummyData()}>Set Dummy Data</button>
      <button onClick={() => deleteData()}>Delete Data</button>
      */}
    </div>
  );
}

export default Home;

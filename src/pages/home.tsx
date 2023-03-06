import React, { useEffect, useState } from "react";
import '../index.css';
import NewTracker from "./newTracker";
import Tracker from "./tracker";
import ProPlan from "./proPlan";
import Settings from "./settings";
import StudyPlan from "./studyPlan";
import History from "./history";
import { compareUrls, getCurrentTab } from "../utils/functions";
import { MdOutlineOpenInNew } from 'react-icons/md'



function Home() {
  const [existingLinks, setExistingLinks]: any = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')
  const [link, setSelectedLink]: any = useState({})
  const [editMode, setEditMode] = useState(false)
  const [onlyShowToday, setOnlyShowToday] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [currTab, setCurrTab] = useState('')

  useEffect(() => {
    setCurrentTab()
    updateLinks()
    checkIfMember()

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

  const checkIfMember = async () => {
    let number = await chrome.storage.local.get('memberNumber')
    if (number.memberNumber) setIsMember(true)
  }

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

  const timeLeft = (time: number, timeLapsed: number, title: string) => {
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
      toggleAutotrackOff(title)
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
            className={`${ currentPage === 'settings' ? 'text-black' : 'text-slate-400'} mr-2 hover:text-black`}
            onClick={() => setCurrentPage('settings')}
            >settings</button>
          <a 
            href="https://learntrack.co#contact"
            target={"_blank"}
            className='text-slate-400 flex flex-rows items-center'
            onClick={() => {}}
            >
              <span className="mr-[2px]">help</span> <MdOutlineOpenInNew className="h-3 w-3" /></a>
          
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
            className='ml-auto rounded-md text-xs py-1 px-0 w-24 border text-sky-400 border-sky-400 hover:text-neutral-100 hover:bg-sky-400 transition ease-in-out duration-300'
            onClick={() => setCurrentPage("newTracker")}
            >New Task</button>
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

  const toggleAutotrackOff = async (title: any) => {

    let linkData: any = await chrome.storage.local.get('links')

    if ( linkData.links && title ) {
      let updateAutotrack = await linkData.links.map((currLink: any) => {
        if ( title === currLink.title ) currLink['autotrack'] = false
        return currLink
      })
      await chrome.storage.local.set({ links: updateAutotrack })
    }
  }

  const displayPage = () => {
    
    if (!isMember && !['settings'].includes(currentPage)) return <ProPlan />
    
    if ( loading ) {
      return <p>Loading...</p>
    }

    if ( currentPage === 'studyPlan' ) return <StudyPlan />

    if (currentPage === 'history' ) return <History />

    if ( currentPage === 'settings' ) return <Settings isMember={isMember} setIsMember={setIsMember} />

    if ( currentPage === 'proPlan' ) return <ProPlan />
    
    if ( currentPage === 'tracker' ) return <Tracker link={link} setCurrentPage={setCurrentPage} setEditMode={setEditMode} />

    if ( currentPage === 'newTracker' ) return <NewTracker link={link} editMode={editMode} />

    if (existingLinks && existingLinks.length > 0) {
      if (!existingLinks || existingLinks.includes(null) ) return
      let todaysDate = new Date();
      let today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][todaysDate.getDay()]
      let anyLinksForToday = existingLinks.reduce((prev: number, link: any) => prev + (link.days[today] === true ? 1 : 0), 0)

      if (onlyShowToday && anyLinksForToday === 0) {
        return <p>No tasks for today...</p>
      }
 
      return existingLinks
      .sort((a: any, b: any) => { 
        let itemA = a.title.toUpperCase()
        let itemB =  b.title.toUpperCase()
        if (itemA < itemB) return -1
        if (itemA > itemB) return 1
        return 0
      })
      .map(
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
                    className="h-4 w-4 justify-self-start self-center col-span-1"
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
                  <p>{ timeLeft(link.time, link.timeLapsed, link.title) }</p>
                </div>
            </div>
            )
        }
      );
      
    } else {
      return (
        <div>
          <h1>Add a task to get started...</h1>
        </div>
      );
    }
  };

  return (
    <div className="w-96 min-h-[32rem] max-h-[42rem] relative rounded-md overflow-hidden">

      <div className="header pt-6 pb-6 pr-8 pl-8 border-dashed border-slate-300 border-b-2">
        <div className="flex flex-row items-center text-2xl">
          <a className="font-serif font-normal tracking-wide mr-4" href="https://learntrack.co" rel='noopener' target='_blank'>
            LearnTrack 
          </a> 
        </div>
        
        { displayNavigation() }
      </div>
      <div className="displayPage pt-5 pb-12 pr-8 pl-8 font-sans">
        { displayLinkToggle() }
        <div id="page">
          { displayPage() }
        </div>
      </div>
    </div>
  );
}

export default Home;

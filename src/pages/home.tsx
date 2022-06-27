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

  const calculateTime = (time: number, timeLapsed: number) => {
    let width = "100%"
    if (timeLapsed <= time) {
      width = Math.ceil((timeLapsed / time) * 100).toString() + "%"
    }
    return width
  }

  const clearData = async () => {
    await chrome.storage.local.set({"links": null});
  }

  const displayNavigation = () => {
    return (
      <nav>
        <button 
          className='bg-yellow-500'
          onClick={() => { 
            setOpenNewTracker(false) 
            setOpenTracker(false)
            setEditMode(false)
            setLink(null)
          }}>Home</button>
        <button 
          className="bg-orange-500 mb-3" 
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
          time: number
        }) => (
          
            <div 
              onClick={() => {
                setLink(link)
                setOpenNewTracker(false)
                setOpenTracker(true)
              }} className="grid grid-cols-5 align-items-center mb-5 cursor-pointer" key={link.title}>
              <div className="col-span-1 flex flex-row justify-items-start align-items-center">
                <img
                  className="h-5 w-5"
                  src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.urls[0]}`}
                  alt="favicon"
                />
                <h1 className="justify-self-center">{link.title}</h1>
              </div>
              <div className={`col-span-4 w-full h-full border-2 border-black`}>
                <div 
                  id={`${link.title}-progress`} 
                  className={`h-full bg-orange-400`}
                  style={{ width: calculateTime(link.time, link.timeLapsed) }}
                />
              </div>
            </div>
        
        )
      );
    } else {
      return <p>No links available...</p>;
    }
  };

  return (
    <div className="w-96 h-96 p-5">
      <h1 className="text-3xl font-sans">Time Tracker</h1>
      { displayNavigation() }
      { displayPage() }
      <button className="absolute bottom-1" onClick={ () => clearData() }>Clear all</button>
    </div>
  );
}

export default Home;

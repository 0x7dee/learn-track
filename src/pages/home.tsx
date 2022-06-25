import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../index.css';


function Home() {
  let [existingLinks, setExistingLinks]: any = useState([]);
  let [loading, setLoading] = useState(true)

  
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

  const displayLinks = () => {
    if (loading) {
      return <p>Loading...</p>
    }
    if (existingLinks && existingLinks.length > 0) {
      return existingLinks.map(
        (link: {
          urls: any,
          title: string,
          timeLapsed: number,
          time: number
        }) => (
          <div className="grid grid-cols-5 align-items-center mb-5" key={link.title}>
            <div className="col-span-1 flex flex-row justify-items-start align-items-center">
              <img
                className="h-5 w-5"
                src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.urls[0]}`}
                alt="favicon"
              />
              <p className="justify-self-center">{link.title}</p>
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
    <div className="w-96 h-96">
      <h1>Time Tracker</h1>
      <nav>
        <Link to="/new">New</Link>
      </nav>
      {displayLinks()}
      <p id="time"></p>
    </div>
  );
}

export default Home;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/progressBar";
import './home.scss'

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
    console.log(`width: ${width}`)
    return width
  }

  const displayLinks = () => {
    if (loading) {
      return <p>Loading...</p>
    }
    if (existingLinks) {
      return existingLinks.map(
        (link: {
          urls: any,
          title: string,
          timeLapsed: number,
          time: number
        }) => (
          <div className="homepage__link" key={link.title}>
            <div className="homepage__link__details">
              <img
                className="homepage__link__details--icon"
                src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.urls[0]}`}
                alt="favicon"
              />
              <p className="homepage__link__details--title">{link.title}</p>
            </div>
            <div className="progressBar" style={{ width: "100%", height: "100%", border: "1px solid black" }}>
              <div 
                id={`${link.title}-progress`} 
                className="progressBar--progress" 
                style={{ width: calculateTime(link.time, link.timeLapsed), height: "100%", backgroundColor: "red" }}
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
    <div className="App">
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

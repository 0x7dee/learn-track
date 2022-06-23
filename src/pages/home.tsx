import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/progressBar";
import './home.scss'

function Home() {
  let [existingLinks, setExistingLinks]: any = useState([]);

  useEffect(() => {
    const secondInterval = setInterval(async () => {
      getLinks();
    }, 1000)
    return () => clearInterval(secondInterval)
  }, [])

  const getLinks = async () => {
    const existingLinks = await chrome.storage.local.get("links");
    setExistingLinks(existingLinks.links);
  };

  const displayLinks = () => {
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
            <ProgressBar 
              title={link.title} 
              time={link.time} 
              timeLapsed={link.timeLapsed} 
            />
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

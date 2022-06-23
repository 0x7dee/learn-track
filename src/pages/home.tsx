import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/progressBar";
import './home.scss'

function Home() {
  let [existingLinks, setExistingLinks]: any = useState([]);

  useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          /**
           * Sends a single message to the content script(s) in the specified tab,
           * with an optional callback to run when a response is sent back.
           *
           * The runtime.onMessage event is fired in each content script running
           * in the specified tab for the current extension.
           */
          /*
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        { type: 'GET_DOM' } as DOMMessage,
        (response: DOMMessageResponse) => {

        });
        */
        }
      );
  });

  useEffect(() => {
    getLinks();
  }, [existingLinks]);

  useEffect(() => {
    const secondInterval = setInterval(() => {
      /*
      chrome.storage.sync.get('timer', (res) => {
        const time: HTMLElement | null = document.getElementById('time')
        if (time) {
          time.textContent = res.timer
        }
      })
      */
      updateLinkProgress()
    }, 1000)
    return () => clearInterval(secondInterval)
  }, [])

  const updateLinkProgress = () => {

  }

  const displayUrl = () => {
    let url: any = chrome.storage.sync.get('url');
    
  }

  const getLinks = async () => {
    const existingLinks = await chrome.storage.sync.get("links");
    setExistingLinks(existingLinks.links);
  };

  const displayLinks = () => {
    if (existingLinks) {
      return existingLinks.map(
        (link: {
          urls: any;
          title: string
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
            <ProgressBar />
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

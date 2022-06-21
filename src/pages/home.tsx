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

  const getLinks = async () => {
    const existingLinks = await chrome.storage.sync.get("links");
    setExistingLinks(existingLinks.links);
  };

  const displayLinks = () => {
    if (existingLinks) {
      return existingLinks.map(
        (link: {
          urls: any;
          title:
            | boolean
            | React.ReactFragment
            | React.ReactPortal
            | null
            | undefined;
        }) => (
          <div className="homepage__link">
            <img
              className="homepage__link--icon"
              src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.urls[0]}`}
              alt="favicon"
            />
            <p>{link.title}</p>
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
    </div>
  );
}

export default Home;

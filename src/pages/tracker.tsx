import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

const Tracker = ({ link, setOpenDetail }: any) => {

  useEffect(() => {
    console.log({link})
  }, [])

  const displayDays = () => {
    if ( link.days ) {
        return link.days.map((day: string) => (
            <p key={day}>{day}</p>
        ))
    }
  }

  const displayUrls = () => {
    if ( link.urls ) {
        return link.urls.map((url: string) => (
            <p key={url}>{url}</p>
        ))
    }
  }

  return (
    <div className="w-full h-full ">
        <img
            className="h-8 w-8"
            src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.urls[0]}`}
            alt="favicon"
        />
        <h1>{link.title}</h1>
        <div>
            { displayDays() }
        </div>
        <div>
            { displayUrls() }
        </div>
        <p className="cursor-pointer" onClick={() => setOpenDetail(false)}>Close</p>
    </div>
    
  )
}

export default Tracker;
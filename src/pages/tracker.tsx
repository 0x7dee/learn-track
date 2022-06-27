import React, { useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'


const Tracker = ({ link, setOpenTracker, setOpenNewTracker, editMode, setEditMode }: any) => {

  const displayDays = () => {
    if ( link.days ) {
        return link.days.map((day: string) => (
            <p key={day}>{day}</p>
        ))
    }
  }

  const displayUrls = () => {
    if ( link.urls ) {
        return link.urls.map((url: string) => {
          return (
            <div key={url} className="url flex flex-row align-items-center mb-1">
              <img className="h-5 w-5 mr-2" src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`} alt="favicon" />
              <p>{url}</p>
            </div>
          )   
    })
    }
  }

  const displayTitle = () => {
    return <h1 className='text-lg'>{link.title}</h1>
  }

  const displayTime = () => {
    if (link.hours === 0) return <p>{`${link.mins}mins per day`}</p>
    if (link.mins === 0) return <p>{`${link.hours}hr per day`}</p>
    return <p>{`${link.hours}hr ${link.mins}mins per day`}</p>
  }

  const editBtn = () => {
    return <FiEdit onClick={() => {
      setOpenNewTracker(true)
      setOpenTracker(false)
      setEditMode(true)
    }} className="absolute top-1 right-1 cursor-pointer z-10" />
  }

  return (
    <div className="tracker w-full h-full relative">
        { editBtn() }
        <div className="tracker__title relative grid grid-cols-2 items-center mb-3">
          { displayTitle() }
          { displayTime() }
        </div>

        <div className="tracker__urls relative mb-3">
            { displayUrls() }
        </div>

        <div className="grid relative">
            { displayDays() }
        </div>

        
    </div>
    
  )
}

export default Tracker;
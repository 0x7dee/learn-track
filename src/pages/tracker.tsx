import React, { useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'


const Tracker = ({ link, setOpenTracker, setOpenNewTracker, editMode, setEditMode }: any) => {
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string>('')

  const displayDays = () => {
    if ( link.days ) {
        return link.days.map((day: string, index: number, row: string | any[]) => {
            if ( index + 1 === row.length ) {
              return (
                <>
                  <p className='mx-1' key={day}>{day}</p>
                </>
              )
            } else {
              return (
                <>
                  <p className='mx-1' key={day}>{day}</p>
                  <p>&#x2022;</p>
                </>
              )
            }
            
        })
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

  const displayErrors = () => {
    let allErrors = null
    if ( errors ) {
      allErrors = errors.map(error => (
        <p key={error}>{error}</p>
      ))
    }
    return <div id="errors" className="text-red-600">{allErrors}</div>
  }

  const displaySuccess = () => {
    if ( success ) return <div id="success" className="text-green-600">{success}</div>
  }

  const displayTitle = () => {
    return <h1 className='text-lg'>{link.title}</h1>
  }

  const displayTime = () => {
    if (!link.hours || link.hours === 0) return <p>{`${link.mins} mins per day`}</p>
    if (!link.mins || link.mins === 0) return <p>{`${link.hours} hr per day`}</p>
    return <p>{`${link.hours}hr ${link.mins} mins per day`}</p>
  }

  const deleteLink = async () => {
    
    const existingLinks = await chrome.storage.local.get("links");
    if ( existingLinks.links ) {
      if ( existingLinks.links.length === 1 ) {
        chrome.storage.local.set({"links": null})
      } else {
        existingLinks.links = existingLinks.links.filter((l: { title: string }) => l.title !== link.title)
        chrome.storage.local.set({"links": [...existingLinks.links]})
      }
      setSuccess('Deleted link successfully!')
    } else {
      setErrors(['Unable to delete link...'])
    }
  }

  return (
    <div className="tracker w-full h-full relative">
        
        <div className="tracker__title relative grid grid-cols-2 items-center mb-6">
          { displayTitle() }
          { displayTime() }
        </div>

        <div className="tracker__main-details">
          <div className="tracker__urls relative mb-6">
              { displayUrls() }
          </div>

          <div className="flex flex-row flex-wrap relative">
              { displayDays() }
          </div>
        </div>
        
        <div className="edit-delete fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-row items-center">
        <button 
            className='w-28 border-2 text-green-400 border-green-400 rounded-md mt-2 text-base py-1 px-2 mb-5 mr-2' 
            onClick={ () => {
              setOpenNewTracker(true)
              setOpenTracker(false)
              setEditMode(true)
            } }
          >Edit</button>
          <button 
            className='w-28 border-2 text-red-400 border-red-400 rounded-md mt-2 text-base py-1 px-2 mb-5' 
            onClick={ () => deleteLink() }
          >Delete</button>
        </div>
        
        { displaySuccess() }
        { displayErrors() }
    </div>
    
  )
}

export default Tracker;
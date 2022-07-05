import React, { useState } from 'react'


const Tracker = ({ link, setOpenTracker, setOpenNewTracker, setEditMode }: any) => {
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string>('')

  const formatUrl = (url: string) => {
    let removeHttps = url.replace(/^https?:\/\//, '')
    let removeHttp = removeHttps.replace(/^http?:\/\//, '')
    return removeHttp
  }

  const displayDays = () => {
    if ( link.days ) {
        let totalTrues = Object.values(link.days).reduce((a: number, day) => a + (day === true ? 1 : 0), 0)
        let numberOfTrues = 0

        let orderedDays = {
          Monday: link.days['Monday'],
          Tuesday: link.days['Tuesday'],
          Wednesday: link.days['Wednesday'],
          Thursday: link.days['Thursday'],
          Friday: link.days['Friday'],
          Saturday: link.days['Saturday'],
          Sunday: link.days['Sunday'],
        }

        return Object.keys(orderedDays).map((day: string) => {
          
          if ( link.days[day] ) {
            numberOfTrues += 1

            if ( numberOfTrues === totalTrues) {
              return <p className='mx-1' key={`${day}-${numberOfTrues}`}>{day}</p>
            } else {
              return (
                <div className='flex flex-row' key={`${day}-${numberOfTrues}-with-dot`}>
                  <p className='mx-1' >{day}</p>
                  <p>&#x2022;</p>
                </div>
              )
            }
          } 
        })
    }
  }

  const displayUrls = () => {
    if ( link.urls ) {
        return link.urls.map((url: string, index: number) => {
          return (
            <div key={`${url}-${index}`} className="url flex flex-row align-items-center mb-1">
              <img className="h-5 w-5 mr-2" src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`} alt="favicon" />           
              <a href={`${url}`} target='_blank' className='flex flex-row items-center'><p className='mr-2'>{ url }</p></a>
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
    if (!link.hours || link.hours === 0) return <p className='justify-self-end'>{`${link.mins} mins per day`}</p>
    if (!link.mins || link.mins === 0) return <p className='justify-self-end'>{`${link.hours} hr per day`}</p>
    return <p className='justify-self-end'>{`${link.hours}hr ${link.mins} mins per day`}</p>
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
        
        <div className="edit-delete fixed bottom-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-row items-center">
        <button 
            className='w-28 border text-emerald-400 border-emerald-400 rounded-md mt-2 text-sm py-1 px-2 mb-5 mr-2 hover:text-neutral-100 hover:bg-emerald-400 transition ease-in-out duration-300' 
            onClick={ () => {
              setOpenNewTracker(true)
              setOpenTracker(false)
              setEditMode(true)
            } }
          >Edit</button>
          <button 
            className='w-28 border text-rose-400 border-rose-400 rounded-md mt-2 text-sm py-1 px-2 mb-5 hover:text-neutral-100 hover:bg-rose-400 transition ease-in-out duration-300' 
            onClick={ () => deleteLink() }
          >Delete</button>
        </div>
        
        { displaySuccess() }
        { displayErrors() }
    </div>
    
  )
}

export default Tracker;
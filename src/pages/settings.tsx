import React, { useEffect, useState } from 'react'

const Settings = () => {
  let [showDeletePopup, setShowDeletePopup] = useState(false)

  const clearData = async () => {
    await chrome.storage.local.set({"links": null});
  }

  return (
    <div>
        <h1 className='text-base mb-6'>Settings</h1>
        { showDeletePopup ? (
              <div className="rounded">
                <p className='text-sm mb-4'>Are you sure? Once deleted, your data cannot be recovered.</p>
                <div className="flex flex-row">
                  <button 
                    className='mr-1 rounded-md text-xs py-1 px-0 w-full border text-red-400 border-red-400 hover:text-neutral-100 hover:bg-red-400 transition ease-in-out duration-300' 
                      onClick={ () => {
                        clearData() 
                        setShowDeletePopup(false)
                      }}>Yes, I'm sure</button>
                  <button className='rounded-md text-xs py-1 px-0 w-full border text-sky-400 border-sky-400 hover:text-neutral-100 hover:bg-sky-400 transition ease-in-out duration-300' onClick={ () => setShowDeletePopup(false) }>Cancel</button>
                </div> 
              </div>
          ) : (
            <>
              <button className='rounded-md text-xs py-1 px-0 w-full border text-red-400 border-red-400 hover:text-neutral-100 hover:bg-red-400 transition ease-in-out duration-300' onClick={() => setShowDeletePopup(true)}>Clear all data</button>
            </>
          ) }
    </div>
  )
}

export default Settings
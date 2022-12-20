import React, { useEffect, useState } from 'react'

const Settings = () => {
  let [showDeletePopup, setShowDeletePopup] = useState(false)
  let [data, setData] = useState('')

  useEffect(() => {
    exportData()
  }, [])

  const clearData = async () => {
    await chrome.storage.local.set({ links: null });
    await chrome.storage.local.set({ dates: {} })
  }

  const exportData = async () => {
    let { links } = await chrome.storage.local.get('links')
    let { dates } = await chrome.storage.local.get('dates')
    let { viewHistory } = await chrome.storage.local.get('viewHistory')

    setData(JSON.stringify({ links, dates, viewHistory }))
  }

  return (
    <div>
        <h1 className='text-base mb-6'>Settings</h1>
        <input className='rounded-md text-xs py-2 px-2 mb-6 w-full border border-gray-400 transition ease-in-out duration-300' placeholder='Enter your member number' />
        <button 
          className='rounded-md text-xs py-1 px-0 mb-3 w-full border text-blue-400 border-blue-400 hover:text-neutral-100 hover:bg-blue-400 transition ease-in-out duration-300' 
          onClick={() => {}}
        >Import Data</button>
        
        <a 
          className='w-full h-full'
          href={`data:text/json;charset=utf-8,${ encodeURIComponent( data ) }`}
          download='timeturtledata.json'>
            <button
              className='rounded-md text-xs py-1 px-0 mb-3 w-full border text-blue-400 border-blue-400 hover:text-neutral-100 hover:bg-blue-400 transition ease-in-out duration-300' 
            >Export Data</button>
        </a>

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
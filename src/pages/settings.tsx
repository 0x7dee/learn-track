import React, { useEffect, useState } from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs'

const Settings = () => {
  let [showDeletePopup, setShowDeletePopup] = useState(false)
  let [data, setData] = useState('')
  let [importedData, setImportedData] = useState('')
  let [importFile, setImportFile]: any = useState('')
  let [memberNumber, setMemberNumber]: any = useState(null)

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

  const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    console.log(e.target.files[0])
    setImportFile(e.target.files[0])
  }

  return (
    <div>
        <div className='mb-3 flex flex-row items-center'>
        <h1 className='mr-2 text-sm'>My Account</h1>
          <div className="relative flex flex-row items-center h-full w-16">
                <AiOutlineQuestionCircle className='peer' />
                <div className="absolute w-48 -bottom-20 -left-3/4 bg-white z-10 hidden peer-hover:block overflow-hidden px-4 py-2 rounded-md border-slate-100 border-2">
                  <p>Enter your account number and select verify account to become a pro member</p>
                </div>
            </div>
        </div>
        <form className='mb-3' onSubmit={() => {}}>
          <input 
            className='rounded-md text-xs py-2 px-2 mb-3 w-full border border-gray-400 transition ease-in-out duration-300' 
            placeholder='Enter your member number' 
            onChange={ (e) => setMemberNumber(e.target.value) }
          />
          <button 
            className='rounded-md text-xs py-2 px-0 w-full border text-blue-400 border-blue-400 hover:text-neutral-100 hover:bg-blue-400 transition ease-in-out duration-300'>
            Verify Account 
          </button>  
        </form>
        
        <div className='mb-3 flex flex-row items-center'>
        <h1 className='mr-2 text-sm'>My Data</h1>
          <div className="relative flex flex-row items-center h-full w-16">
                <AiOutlineQuestionCircle className='peer' />
                <div className="absolute w-48 -bottom-24 -left-3/4 bg-white z-10 hidden peer-hover:block overflow-hidden px-4 py-2 rounded-md border-slate-100 border-2">
                  <p><span className='text-red-400'>Caution: importing data will override your existing application data, this cannot be overridden.</span></p>
                </div>
            </div>
        </div>
        <button className='rounded-md text-xs py-2 px-0 mb-3 w-full border text-blue-400 border-blue-400 hover:text-neutral-100 hover:bg-blue-400 transition ease-in-out duration-300'>
          <label 
            htmlFor="file-upload" 
            className='block w-full h-full cursor-pointer'
          >
            Import Data  
          </label>
        </button>    
        <input className='hidden' id="file-upload" type="file" onChange={(e) => importData(e)}/>
        
        <a 
          className='w-full h-full'
          href={`data:text/json;charset=utf-8,${ encodeURIComponent( data ) }`}
          download='learntrackdata.json'>
            <button
              className='rounded-md text-xs py-2 px-0 mb-3 w-full border text-blue-400 border-blue-400 hover:text-neutral-100 hover:bg-blue-400 transition ease-in-out duration-300' 
            >Export Data</button>
        </a>

        { showDeletePopup ? (
              <div className="rounded">
                <p className='text-sm mb-4'>Are you sure? Once deleted, your data cannot be recovered.</p>
                <div className="flex flex-row">
                  <button 
                    className='mr-1 rounded-md text-xs py-2 px-0 w-full border text-red-400 border-red-400 hover:text-neutral-100 hover:bg-red-400 transition ease-in-out duration-300' 
                      onClick={ () => {
                        clearData() 
                        setShowDeletePopup(false)
                      }}>Yes, I'm sure</button>
                  <button className='rounded-md text-xs py-2 px-0 w-full border text-sky-400 border-sky-400 hover:text-neutral-100 hover:bg-sky-400 transition ease-in-out duration-300' onClick={ () => setShowDeletePopup(false) }>Cancel</button>
                </div> 
              </div>
          ) : (
            <>
              <button className='rounded-md text-xs py-2 px-0 w-full border text-red-400 border-red-400 hover:text-neutral-100 hover:bg-red-400 transition ease-in-out duration-300' onClick={() => setShowDeletePopup(true)}>Clear All Data</button>
            </>
          ) }
          
    </div>
  )
}

export default Settings
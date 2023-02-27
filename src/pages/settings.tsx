import React, { useEffect, useState } from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs'

const Settings = ({ isMember, setIsMember }: any) => {
  let [showDeletePopup, setShowDeletePopup] = useState(false)
  let [data, setData] = useState('')
  let [importedData, setImportedData] = useState('')
  let [importFile, setImportFile]: any = useState('')
  let [memberNumber, setMemberNumber]: any = useState('')
  let [subscriptionId, setSubscriptionId]: any = useState('')

  useEffect(() => {
    exportData()
    getMemberNumber()
  }, [])

  const clearData = async () => {
    await chrome.storage.local.set({ links: null });
    await chrome.storage.local.set({ dates: {} })
    await chrome.storage.local.set({ viewHistory: {} })
  }

  async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const validateMemberNumber = async (number: string) => {
    setMemberNumber(number)
    
    let result = await postData('https://api.gumroad.com/v2/licenses/verify', { product_id: 'HcIl1HHJ_XBLD9_kRDS-tw==', license_key: number })
    if ( result.success ) {
      await chrome.storage.local.set({ memberNumber: number })
      await chrome.storage.local.set({ subscriptionId: result.purchase.subscription_id })
    } else {
      await chrome.storage.local.set({ memberNumber: '' })
    }
    setIsMember(result.success)
    setSubscriptionId(result.purchase.subscription_id)
  }

  const getMemberNumber = async () => {
    let number = await chrome.storage.local.get('memberNumber')
    let subId = await chrome.storage.local.get('subscriptionId')
    if (number.memberNumber) {
      validateMemberNumber(number.memberNumber)
      setSubscriptionId(subId)
    } else {
      validateMemberNumber('')
    }
  }

  const exportData = async () => {
    if (!isMember) return

    let { links } = await chrome.storage.local.get('links')
    let { dates } = await chrome.storage.local.get('dates')
    let { viewHistory } = await chrome.storage.local.get('viewHistory')
    let { memberNumber } = await chrome.storage.local.get('memberNumber')

    setData(JSON.stringify({ links, dates, viewHistory, memberNumber }))
  }

  async function parseJsonFile(file: any) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = (event: any) => resolve(JSON.parse(event.target.result))
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
    })
  }

  const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMember || !e.target.files) return
    
    let parsedFile: any = await parseJsonFile(e.target.files[0])
    console.log(parsedFile)

    if (parsedFile.dates) await chrome.storage.local.set({ 'dates': parsedFile.dates })
    if (parsedFile.links) await chrome.storage.local.set({ 'links': parsedFile.links })
    if (parsedFile.viewHistory) await chrome.storage.local.set({ 'viewHistory': parsedFile.viewHistory })
    
  }

  return (
    <div>
        <div className='mb-3 flex flex-row items-center'>
        <h1 className='mr-2 text-sm'>License Key</h1>
          <div className="relative flex flex-row items-center h-full w-16">
                <AiOutlineQuestionCircle className='peer' />
                <div className="absolute w-48 top-3 -left-3/4 bg-white z-10 hidden peer-hover:block overflow-hidden px-4 py-2 rounded-md border-slate-100 border-2">
                  <p>Enter the license key you received by email from Gumroad during sign up. If you can't find your member number click the Manage Account link below to access your Gumroad account.</p>
                </div>
            </div>
        </div>
        <form className='mb-3 flex flex-col' onSubmit={() => {}}>
          <input 
            className={
              `rounded-md text-xs py-2 px-2 w-full border transition ease-in-out duration-300 
              ${ memberNumber === '' ? 'border-gray-400' : isMember ? 'border-green-400' : 'border-red-400' }`
            }
            placeholder='Enter your member number' 
            onChange={ (e) => validateMemberNumber(e.target.value) }
            value={ memberNumber }
          />
          <a className='text-blue-400 text-xs self-end' href={ subscriptionId ? `https://app.gumroad.com/subscriptions/${subscriptionId}/manage` : "https://6951802471539.gumroad.com/l/oznwki" } target={'_blank'}>Manage Account</a>
          {/*
          <button 
            className='rounded-md mt-3 text-xs py-2 px-0 w-full border text-blue-400 border-blue-400 hover:text-neutral-100 hover:bg-blue-400 transition ease-in-out duration-300'>
            Verify Account 
          </button>  
          */}
        </form>
        
        <div className='mb-3 flex flex-row items-center'>
        <h1 className='mr-2 text-sm'>My Data</h1>
          <div className="relative flex flex-row items-center h-full w-16">
                <AiOutlineQuestionCircle className='peer' />
                <div className="absolute w-48 top-3 -left-3/4 bg-white z-10 hidden peer-hover:block overflow-hidden px-4 py-2 rounded-md border-slate-100 border-2">
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
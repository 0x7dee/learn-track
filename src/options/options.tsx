import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import '../index.css'
import options from '../bundles/bundles'


const Options = () => {
  let [showDeletePopup, setShowDeletePopup] = useState(false)
  let [openedTab, setOpenedTab] = useState('dashboard')

  const clearData = async () => {
    await chrome.storage.local.set({"links": null});
  }

  const showData = async () => {
    let links = await chrome.storage.local.get('links')
    console.log(links)
  }

  const displayBundles = () => {
    if ( options ) {
      return Object.keys(options).map(key => (
        <div key={ key } className='w-full h-40 px-5 py-5 bg-slate-200 mb-2 rounded'>
          <h2 className='text-xl'>{ options[key as keyof typeof options].title }</h2>
          <h4 className='text-lg'>{ options[key as keyof typeof options].description }</h4>
          <p>{ options[key as keyof typeof options].urls.length } items included</p>
        </div>
      ))
    }
  }

  const displayPage = () => {
    if ( openedTab === 'dashboard' ) {
      return (
        <div className="bundles relative w-full">
          <h1 className='text-3xl'>Curated learning bundles</h1>
          <p>Curated learning resources to help you achieve you goals faster!!</p>
          <p className='absolute top-1 right-0'>$3.99 each</p>
          <input placeholder='Search...' type="text" className='w-full h-10 my-10 py-6 px-4 border-2 border-slate-200 rounded outline-none focus:border-blue-400' />
          <div className="bundle-list">
           { displayBundles() }
          </div>
        </div>
      )
    } else if ( openedTab === 'settings' ) {
      return (
        <div>
          
          { showDeletePopup ? (
            <div className="rounded">
              <p className='text-lg mb-4'>Are you sure? Once deleted, your data cannot be recovered.</p>
              <div className="flex flex-row">
                <button className='text-red-400 border-2 border-red-400 px-4 py-2 mr-2 rounded' onClick={ () => clearData() }>Yes, I'm sure</button>
                <button className='text-blue-400 border-2 border-blue-400 px-4 py-2 rounded' onClick={ () => setShowDeletePopup(false) }>Cancel</button>
              </div>  
            </div>
          ) : (
            <>
            <button className='border-2 border-red-400 text-red-400 px-4 py-2 rounded' onClick={() => setShowDeletePopup(true)}>Clear all data</button>
            </>
          ) }
        </div>
      )
    } else if ( openedTab === 'about' ) {
      return <p>About</p>
    } else if ( openedTab === 'learn' ) {
      return <p>Learn</p>
    }
  }

  return (
    <div className='h-full m-auto max-w-2xl relative py-10'>
        <div className="w-full flex flex-row items-center justify-between mb-20">
          <h1 onClick={ () => setOpenedTab('dashboard') } className={`text-2xl cursor-pointer ${ openedTab === 'dashboard' ? 'text-blue-400' : '' }`}>Dashboard</h1>
          <h1 onClick={ () => setOpenedTab('settings') } className={`text-2xl cursor-pointer ${ openedTab === 'settings' ? 'text-blue-400' : '' }`}>Settings</h1>
          <h1 onClick={ () => setOpenedTab('about') } className={`text-2xl cursor-pointer ${ openedTab === 'about' ? 'text-blue-400' : '' }`}>About</h1>
          <h1 onClick={ () => setOpenedTab('learn') } className={`text-2xl cursor-pointer ${ openedTab === 'learn' ? 'text-blue-400' : '' }`}>Learn</h1>
        </div>
        { displayPage() }
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<Options />, root)
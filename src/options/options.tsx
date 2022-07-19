import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import '../index.css'



const Options = () => {
  let [showDeletePopup, setShowDeletePopup] = useState(false)

  const clearData = async () => {
    await chrome.storage.local.set({"links": null});
  }

  const showData = async () => {
    let links = await chrome.storage.local.get('links')
    console.log(links)
  }

  const displayPopup = () => {
  if ( showDeletePopup ) {
    return (
        <div className="w-2/5 h-40 absolute top-12 left-1/2 transform -translate-x-1/2 bg-slate-300">
          <p>Are you sure?</p>
          <button onClick={ () => {} }>Yes I'm sure</button>
          <button onClick={ () => setShowDeletePopup(false) }>Cancel</button>
        </div>
    )
  }
  }

  return (
    <div className='h-full m-auto max-w-2xl relative py-10'>
        <div className="w-full flex flex-row items-center justify-between mb-20">
          <h1 onClick={ () => showData() } className='text-4xl'>Dashboard</h1>
          <button className='' onClick={() => setShowDeletePopup(true)}>Clear all data</button>
        </div>
        <div className="bundles relative w-full">
          <h1 className='text-3xl'>Curated learning bundles</h1>
          <p>Curated learning resources to help you achieve you goals faster!!</p>
          <p className='absolute top-1 right-0'>$3.99 each</p>
        </div>

        { displayPopup() }
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<Options />, root)
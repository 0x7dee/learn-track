import React from 'react'
import ReactDOM from 'react-dom'

const clearData = async () => {
     await chrome.storage.local.set({"links": null});
}

const Options = () => {
  return (
    <div className='options'>
        <button onClick={() => clearData()}>Clear all data</button>
    </div>
  )
}


const test = <p>Test</p>

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<Options />, root)
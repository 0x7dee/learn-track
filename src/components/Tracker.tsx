import React from 'react'

const Tracker = () => {

  chrome.storage.sync.set({ test: "test" });
  return (
    <div>Tracker</div>
  )
}

export default Tracker;
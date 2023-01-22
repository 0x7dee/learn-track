import React, { useState, useEffect } from 'react'


function Help() {

 let [selectedItem, setSelectedItem] = useState('')

 const toggleSelection = (item: string) => {
   if ( selectedItem === item ) {
      setSelectedItem('')
   } else {
      setSelectedItem(item)
   }
 }

 return (
    <div className='h-[80%] overflow-scroll'>
      <div className="flex flex-col">
         <h1 onClick={() => toggleSelection('data-collection')} className='text-sm mb-2 cursor-pointer'>Do we collect your data?</h1>
         <p className={`${ selectedItem === 'data-collection' ? 'block' : 'hidden'} mb-2 text-sm`}>
            We at LearnTrack do not collect your data under any circumstance. All data is kept within your local browser.
         </p>
      </div>
      <div className="flex flex-col">
         <h1 onClick={() => toggleSelection('broken-timer')} className='text-sm mb-2 cursor-pointer'>The timer isn't working</h1>
         <p className={`${ selectedItem === 'broken-timer' ? 'block' : 'hidden'} mb-2 text-sm`}>
            In cases where the timer is not working correctly, we suggest typing in chrome://extensions in your browser URL. Go to the LearnTrack extension and click the refresh button in the bottom right hand corner. 
         </p>
      </div>
      <div className="flex flex-col">
         <h1 onClick={() => toggleSelection('bug')} className='text-sm mb-2 cursor-pointer'>How can I report a bug</h1>
         <p className={`${ selectedItem === 'bug' ? 'block' : 'hidden'} mb-2 text-sm`}>
            If you have discovered a bug in the software please let us know at hello@learntrack.co and we will resolve the matter asap. 
         </p>
      </div>
    </div>   
 )
}

export default Help;
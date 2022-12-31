import React, { useState, useEffect } from 'react'


function Privacy() {



 return (
    <div>
       <h1 className='mb-3 text-sm'>Privacy</h1>
       <p className='mb-3'>We at LearnTrack care deeply about the privacy of our customers. We <span className='font-bold'>do not</span> store, record or distribute your data in any
       way, shape or form.</p>
       <p className='mb-3'>All data used by this plugin is stored locally in your browser, none of your data leaves your browser at any point in time.</p>
       <p className='mb-3'>In the settings tab you can export or delete your data at any time.</p>
       <p className="mb-3">The small monthly fee covers our costs and allows us to continue to develop the plugin without the need to profit off our users personal information.</p>
    </div>   
 )
}

export default Privacy;
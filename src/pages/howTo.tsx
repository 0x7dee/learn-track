import React, { useEffect, useState } from 'react'

const HowTo = () => {

  return (
    <div>
        <h1 className='text-base mb-4'>How it works</h1>
        <h2 className='text-sm mb-1'>Title</h2>
        <p className='mb-2 text-slate-600'>This is the title of your link.</p>
        <h2 className='text-sm mb-1'>URLs</h2>
        <p className='mb-2 text-slate-600'>These URLs are substrings of URLs that you want to match for. For example, https://google.com will match https://google.com/about, https://google.com/someroute, etc.</p>
        <h2 className='text-sm mb-1'>Days</h2>
        <p className='mb-2 text-slate-600'>Selecting the days of the week that want the URLs to be tracked.</p>
        <h2 className='text-sm mb-1'>Time</h2>
        <p className='mb-1 text-slate-600'>The amount of time the URL should be tracked each day.</p>
    </div>
  )
}

export default HowTo
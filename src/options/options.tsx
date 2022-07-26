import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import '../index.css'
import options from '../bundles/bundles'


const Options = () => {
  let [showDeletePopup, setShowDeletePopup] = useState(false)

  const clearData = async () => {
    await chrome.storage.local.set({"links": null});
  }

  return (
    <div className='m-auto max-w-2xl w-[26rem] sm:w-[32rem] md:w-[38rem] lg:w-[42rem] relative'>
        <div className="w-[26rem] sm:w-[32rem] md:w-[38rem] lg:w-[42rem] h-20 flex flex-row items-center justify-between border-b-2 fixed top-0 left-1/2 -translate-x-1/2 z-10 bg-white">
          <a href='#welcome' className={`text-2xl`}>Welcome</a>     
          <a href='#howitworks' className={`text-2xl`}>How It Works</a>     
          <a href='#faq' className={`text-2xl`}>FAQ</a> 
          <a href='#settings' className={`text-2xl`}>Settings</a>     
        </div>

        <div className="" id="welcome">
          <h2 className='text-3xl mb-8 pt-40'>Welcome to LearnTrack</h2>
          <p className='text-lg mb-4'>Habit system was originally a personal project designed to help me systematize my time spent online and avoid distractions.</p>
          <p className='text-lg mb-4'>The app has dramatically improved my productivity so I thought I would share it with others in the hopes that it will also help you in your journey. Habit system lives in your browser, 
            no data is collected or shared outside your browser. 
          </p>
          <p className='text-lg'>The product is completely free to use.</p>
        </div>

        <div className='' id='howitworks'>
          <div className="purpose">
            <h2 className='text-3xl mb-8 pt-40'>How it Works</h2>
            <p className='text-lg mb-4'>The main purpose of LearnTrack is to create what we call links, links are collections of urls under a common heading such as "Learning Programming".</p>
            <p className='text-lg mb-4'>Whenever you go to one of the urls listed in the link, the app will keep track of how long you have visited that website. This will then allow you to know how long you are spending on each topic.</p>
            <p className='text-lg mb-4'>To create a link click the "new" button on the homepage, this will take you to a form page where you are able to create a new link.</p>
            <p className='text-lg mb-4'>Be sure to add each url to the link by entering the url string and clicking the blue plus button.</p>
            <p className='text-lg'>You can select the days in which this link will be valid as well as the amount of time you are committing each day.</p>
          </div>
        </div>

        <div className='' id="faq">  
          <h2 className='text-3xl mb-8 pt-40'>FAQ</h2>
          <p className='text-lg mb-4'>The main purpose of LearnTrack is to create what we call links, links are collections of urls under a common heading such as "Learning Programming".</p>
          <p className='text-lg mb-4'>Whenever you go to one of the urls listed in the link, the app will keep track of how long you have visited that website. This will then allow you to know how long you are spending on each topic.</p>
          <p className='text-lg mb-4'>To create a link click the "new" button on the homepage, this will take you to a form page where you are able to create a new link.</p>
          <p className='text-lg mb-4'>Be sure to add each url to the link by entering the url string and clicking the blue plus button.</p>
          <p className='text-lg'>You can select the days in which this link will be valid as well as the amount of time you are committing each day.</p>
        </div>

        <div className='mb-[50rem]' id='settings'>
          <h2 className='text-3xl mb-8 pt-40'>Settings</h2>
          { showDeletePopup ? (
            <div className="rounded">
              <p className='text-lg mb-4'>Are you sure? Once deleted, your data cannot be recovered.</p>
              <div className="flex flex-row">
                <button 
                  className='text-red-400 border-2 border-red-400 px-4 py-2 mr-2 rounded' 
                    onClick={ () => {
                      clearData() 
                      setShowDeletePopup(false)
                    }}>Yes, I'm sure</button>
                <button className='text-blue-400 border-2 border-blue-400 px-4 py-2 rounded' onClick={ () => setShowDeletePopup(false) }>Cancel</button>
              </div>  
            </div>
          ) : (
            <>
            <button className='border-2 border-red-400 text-red-400 px-4 py-2 rounded' onClick={() => setShowDeletePopup(true)}>Clear all data</button>
            </>
          ) }
        </div>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<Options />, root)
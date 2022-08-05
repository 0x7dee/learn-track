import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import '../index.css'
import options from '../bundles/bundles'


const Options = () => {
  let [showDeletePopup, setShowDeletePopup] = useState(false)
  let [credential, setCredential] = useState('')

  const clearData = async () => {
    await chrome.storage.local.set({"links": null});
  }

  const upgradeToPro = (e: any) => {
    e.preventDefault()
  }

  return (
    <div className='m-auto max-w-2xl w-[26rem] sm:w-[32rem] md:w-[38rem] lg:w-[42rem] relative'>
        <div className="w-[26rem] sm:w-[32rem] md:w-[38rem] lg:w-[42rem] h-20 flex flex-row items-center justify-between border-b-2 fixed top-0 left-1/2 -translate-x-1/2 z-10 bg-white">
          <a href='#welcome' className={`text-2xl`}>Welcome</a>     
          <a href='#howitworks' className={`text-2xl`}>How It Works</a>     
          <a href='#faq' className={`text-2xl`}>FAQ</a> 
          <a href='#settings' className={`text-2xl`}>Settings</a>     
        </div>

        <div className='text-lg' id="welcome">
          <h2 className='text-3xl mb-8 pt-40'>Welcome to LearnTrack</h2>
          <p className='text-lg mb-4'>Habit system was originally a personal project designed to help me systematize my time spent online and avoid distractions.</p>
          <p className='text-lg mb-4'>The app has dramatically improved my productivity so I thought I would share it with others in the hopes that it will also help you in your journey. Habit system lives in your browser, 
            no data is collected or shared outside your browser. 
          </p>
          <p className='text-lg'>The product is completely free to use.</p>
          <p>Upgrade to <a href="#settings" className='text-sky-400'>Pro</a> today!!!</p>
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

          <div className='w-full mb-8'>
            <h2 className='text-xl mb-8'>Upgrade to the Pro Plan</h2>
            <form onSubmit={e => upgradeToPro(e)}>
              <input 
                className='w-full py-4 px-8 mb-4 border-slate-200 border-2 rounded-md' 
                type="text" 
                placeholder='Enter your credential...' 
                onChange={ e => setCredential(e.target.value) }
              />
              <button className='text-lg rounded-md py-2 px-8 border text-sky-400 border-sky-400 hover:text-neutral-100 hover:bg-sky-400 transition ease-in-out duration-300'>Submit</button>
            </form>
          </div>

          <div>
            <h2 className='text-xl mb-8'>Data</h2>
            { showDeletePopup ? (
              <div className="rounded">
                <p className='text-lg mb-4'>Are you sure? Once deleted, your data cannot be recovered.</p>
                <div className="flex flex-row">
                  <button 
                    className='text-lg rounded-md py-2 px-8 mr-4 border text-red-400 border-red-400 hover:text-neutral-100 hover:bg-red-400 transition ease-in-out duration-300' 
                      onClick={ () => {
                        clearData() 
                        setShowDeletePopup(false)
                      }}>Yes, I'm sure</button>
                  <button className='text-lg rounded-md py-2 px-8 border text-sky-400 border-sky-400 hover:text-neutral-100 hover:bg-sky-400 transition ease-in-out duration-300' onClick={ () => setShowDeletePopup(false) }>Cancel</button>
                </div>  
              </div>
          ) : (
            <>
              <button className='text-lg rounded-md py-2 px-8 border text-red-400 border-red-400 hover:text-neutral-100 hover:bg-red-400 transition ease-in-out duration-300' onClick={() => setShowDeletePopup(true)}>Clear all data</button>
            </>
          ) }
          </div>
            
          
        </div>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<Options />, root)
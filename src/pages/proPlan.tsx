import React, { useEffect, useState } from 'react'

const ProPlan = () => {


  return (
    <div className='flex flex-col items-center'>
        <h1 className='text-base mb-1'>Join today and get</h1>
        <div className="text-xl flex flex-row items-center justify-center">
          <p>🎉</p>
          <h2 className='text-blue-400 text-xl mb-1 mx-3'>One Month Free!</h2>
          <p>🎉</p>
        </div>
        <h2 className='text-sm mb-6'>then only $3/m</h2>
        <a 
          href="https://learntrack.gumroad.com/l/oznrag" 
          target={'_blank'} 
          className='flex items-center justify-center rounded-md text-xs py-2 px-0 mb-6 w-full border text-blue-400 border-blue-400 hover:text-neutral-100 hover:bg-blue-400 transition ease-in-out duration-300'>
          <p className='text-base'>Get Started</p>
        </a> 
        <p className='text-sm mb-3'>If you don't like the product you can cancel anytime during your trial period with no additional charge</p>
        <div className='text-sm'>After joining you will receive a member number via email which you can enter in the <span className='text-blue-400'>settings tab</span> in the top right hand corner of the screen to activate your account</div>
    </div>
  )
}

export default ProPlan
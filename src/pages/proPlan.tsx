import React, { useEffect, useState } from 'react'

const ProPlan = () => {
    let [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {

    }, [])

    const joinPro = () => {

    }

    const isLoggedIn = () => {
        if ( loggedIn ) return <div>Youre already a paid member!</div>
        if ( !loggedIn ) return <div>Click 'Manage Account' below to join pro!!</div>
        return <div>Loading status...</div>
    }

  return (
    <div>
        <>
        <h1 className=''>Pro Plan</h1>
        { isLoggedIn() }
        <button 
            className='ml-auto rounded-md text-xs py-1 px-0 w-full border text-sky-400 border-sky-400 hover:text-neutral-100 hover:bg-sky-400 transition ease-in-out duration-300'
            onClick={() => {}}
            >Manage Account</button>
        </>
    </div>
  )
}

export default ProPlan
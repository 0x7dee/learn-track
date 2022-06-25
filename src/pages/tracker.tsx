import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

const Tracker = ({ link, setOpenDetail }: any) => {

  useEffect(() => {
    console.log({link})
  }, [])

  return (
    <div className="w-full h-full ">
        <div>Tracker</div>
        <p className="cursor-pointer" onClick={() => setOpenDetail(false)}>Close</p>
    </div>
    
  )
}

export default Tracker;
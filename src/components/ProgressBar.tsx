import React, { useEffect } from 'react'
import './progressBar.scss'

const ProgressBar = ({ title, time }: any) => {
  
  useEffect(() => {
   
    console.log(`time progressBar.tsx: ${time}`)
    let progressBar = document.getElementById(`${title}-progress`)
    if (progressBar) {
      progressBar.style.width = `${time}%`
    }
  
  }, [time])
  

  return (
    <div className="progressBar">
      <div id={`${title}-progress`} className="progressBar--progress"></div>
    </div>
  )
}

export default ProgressBar;
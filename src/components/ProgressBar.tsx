import React, { useEffect } from 'react'
import './progressBar.scss'

const ProgressBar = ({ title, time, timeLapsed }: any) => {

  useEffect(() => {
    const secondInterval = setInterval(async () => {
      let progressBar = document.getElementById(`${title}-progress`)
      if (progressBar && timeLapsed && time && (timeLapsed <= time)) {
        progressBar.style.width = `${Math.ceil((timeLapsed / time) * 100)}%`
      } else if ( progressBar && timeLapsed && time && timeLapsed >= time ) {
        progressBar.style.width = `100%`
      }
    }, 1000)
    return () => clearInterval(secondInterval)
  }, [])

  return (
    <div className="progressBar">
      <div id={`${title}-progress`} className="progressBar--progress"></div>
    </div>
  )
}

export default ProgressBar;
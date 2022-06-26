import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi'


const Tracker = ({ link, setOpenDetail }: any) => {
  const [editTitle, setEditTitle] = useState<boolean>(false)
  const [editDays, setEditDays] = useState<boolean>(false)
  const [editUrls, setEditUrls] = useState<boolean>(false)


  useEffect(() => {
    console.log({link})
  }, [])

  const displayDays = () => {
    if ( link.days ) {
        return link.days.map((day: string) => (
            <p key={day}>{day}</p>
        ))
    }
  }

  const displayUrls = () => {
    if ( link.urls ) {
        return link.urls.map((url: string) => (
            <p key={url}>{url}</p>
        ))
    }
  }

  const editBtn = (field: string) => {
    return <FiEdit onClick={() => editField(field)} className="absolute top-0 right-0 cursor-pointer" />
  }

  const editField = (field: string) => {
    switch(field) {
      case 'title':
        setEditTitle(!editTitle)
        break
      case 'days':
        setEditDays(!editDays)
        break
      case 'urls':
        setEditUrls(!editUrls)
        break
      default:
        return
    } 
  }

  const displayEditField = (field: string) => {
    switch(field) {
      case 'title':
        if ( editTitle ) return <input type="text" placeholder="Update title" />
        break
      case 'days':
        if ( editDays ) return <input type="text" placeholder="Update days" />
        break
      case 'urls':
        if ( editUrls ) return <input type="text" placeholder="Update urls" />
        break
      default:
        return
    } 
    
  }

  return (
    <div className="tracker w-full h-full ">
        <img
            className="h-8 w-8"
            src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.urls[0]}`}
            alt="favicon"
        />
        <div className="tracker__title relative">
          <h1>{link.title}</h1>
          { editBtn('title') }
          { displayEditField('title') }
        </div>
        
        <div className="grid relative">
            { displayDays() }
            { editBtn('days') }
            { displayEditField('days') }
        </div>

        <div className="tracker__urls relative">
            { displayUrls() }
            { editBtn('urls') }
            { displayEditField('urls') }
        </div>
        <p className="cursor-pointer" onClick={() => setOpenDetail(false)}>Close</p>
    </div>
    
  )
}

export default Tracker;
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi'


const Tracker = ({ link, setOpenDetail, setOpenCreateLink }: any) => {
  const [editTitle, setEditTitle] = useState<boolean>(false)
  const [editDays, setEditDays] = useState<boolean>(false)
  const [editUrls, setEditUrls] = useState<boolean>(false)
  const [submitBtn, setSubmitBtn] = useState<boolean>(false)

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

  const editFields = () => {
        setEditTitle(!editTitle)
        setEditDays(!editDays)
        setEditUrls(!editUrls)
        setSubmitBtn(!submitBtn)
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
      case 'submit':
        if ( submitBtn ) return <button className='bg-blue-500'>Update Link</button>
      default:
        return
    } 
    
  }

  const editBtn = () => {
    return <FiEdit onClick={() => {
      editFields()
    }} className="absolute top-1 right-1 cursor-pointer" />
  }

  return (
    <div className="tracker w-full h-full relative">
        { editBtn() }
        <img
            className="h-8 w-8"
            src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.urls[0]}`}
            alt="favicon"
        />
        <div className="tracker__title relative">
          <h1>{link.title}</h1>
          { displayEditField('title') }
        </div>
        
        <div className="grid relative">
            { displayDays() }
            { displayEditField('days') }
        </div>

        <div className="tracker__urls relative">
            { displayUrls() }
            { displayEditField('urls') }
        </div>

        { displayEditField('submit') }
        <p className="cursor-pointer" onClick={() => setOpenDetail(false)}>Close</p>
    </div>
    
  )
}

export default Tracker;
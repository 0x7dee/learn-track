import React from 'react'
import ReactDOM from 'react-dom'
import './popup.scss'

const test = <img src="icon.png" alt="icon" />

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(test, root)

chrome.runtime.onInstalled.addListener(() => {
    console.log("installed");
})
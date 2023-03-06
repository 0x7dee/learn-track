import React from 'react';
import ReactDOM from 'react-dom';
import Home from '../pages/home';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const root = document.createElement('div')
document.body.appendChild(root)


ReactDOM.render(<React.StrictMode>
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>
  </React.StrictMode>, root)

chrome.runtime.onInstalled.addListener(() => {
    console.log("installed");
})
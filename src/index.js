import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { FrameContextProvider } from './context/FrameContext'

ReactDOM.render(
    <React.StrictMode>
        <FrameContextProvider>
            <App />
        </FrameContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
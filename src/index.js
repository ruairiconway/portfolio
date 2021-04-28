import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { FrameContextProvider } from './contexts/FrameContext'
import { ColorContextProvider } from './contexts/ColorContext'

ReactDOM.render(
    <React.StrictMode>
        <ColorContextProvider>
        <FrameContextProvider>
            <App />
        </FrameContextProvider>
        </ColorContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
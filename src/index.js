import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { FrameContextProvider } from './contexts/FrameContext'

ReactDOM.render(
    <React.StrictMode>
        <FrameContextProvider>
            <App />
        </FrameContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
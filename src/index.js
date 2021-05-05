import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import { FrameContextProvider } from './contexts/FrameContext'
import { PortfolioContextProvider } from './contexts/PortfolioContext'

ReactDOM.render(
    <React.StrictMode>
        <PortfolioContextProvider>
            <App />
        </PortfolioContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
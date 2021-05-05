import React, { useState, createContext } from 'react'
import { portfolioData } from '../assets/portfolioData'
const PortfolioContext = createContext()

function PortfolioContextProvider({ children, ...props }) {

    const [ portfolioActive, setPortfolioActive ] = useState(false)
    const [ portfolioIndex, setPortfolioIndex ] = useState(1)

    return (
        <PortfolioContext.Provider
            value={{
                portfolioData,
                portfolioActive,
                setPortfolioActive,
                portfolioIndex,
                setPortfolioIndex,
            }}
        >
            {children}
        </PortfolioContext.Provider>
    )

}

export { PortfolioContextProvider, PortfolioContext }
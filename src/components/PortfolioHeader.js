import React from 'react'
import { CloseIcon, ExternalLinkIcon, ArrowLeftIcon, ArrowRightIcon } from '../assets/icons'

export default function PortfolioHeader({ id, url, dataLength, setPortfolioActive, portfolioIndex, setPortfolioIndex, children }) {

    function handleIndex(direction) {
        if (direction === 'left') {
            if (portfolioIndex === 1) {
                setPortfolioIndex(dataLength)
            } else {
                setPortfolioIndex(prevIndex => prevIndex - 1)
            }
        } else if (direction === 'right') {
            if (portfolioIndex === dataLength) {
                setPortfolioIndex(1)
            } else {
                setPortfolioIndex(prevIndex => prevIndex + 1)
            }
        }
    }

    return (
        <div>
            <button onClick={() => setPortfolioActive(false)}>
                <CloseIcon />
            </button>
            <button >
                <a href={url} target="_blank" rel="noreferrer">
                    <ExternalLinkIcon />
                </a>
            </button>
            <h4>{children}</h4>
            <div>
                <button onClick={() => handleIndex('left')}>
                    <ArrowLeftIcon />
                </button>
                <p>0{id}</p>
                <button onClick={() => handleIndex('right')}>
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
    )
}
import React, { useContext } from 'react'
import { PortfolioContext } from '../contexts/PortfolioContext'

export default function ProjectCard({value, ...props}) {

    const { setPortfolioActive, setPortfolioIndex } = useContext(PortfolioContext)

    var divStyle = {
        height: '100px',
        width: '150px',
        backgroundImage: `url(${value.image})`,
        backgroundPosition: 'center',
    }

    return (
        <div>
            <button onClick={() => {
                setPortfolioActive(true)
                setPortfolioIndex(value.id)
            }} style={divStyle}>
                <h4>{value.name}</h4>
            </button>
            <p>{value.caption}</p>
        </div>
    )
}
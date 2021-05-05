import React, { useContext } from 'react'
import { PortfolioContext } from '../contexts/PortfolioContext'
import styled from 'styled-components'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioLinks from '../components/PortfolioLinks'
import PortfolioInfo from '../components/PortfolioInfo'

const PortfolioWrapper = styled.div`
    ${({ portfolioActive }) => !portfolioActive && 'display: none;'}
    position: fixed;
    right: 3rem;
    top: 3rem;
    height: calc(100% - 6rem);
    width: calc(50% - 6rem);
    border: 10px solid var(--ranColor);
    background: #FFF;
    transition: 0.5s;
    overflow: hidden;
`

const PortfolioContent = styled.div`
    overflow: auto !important;
    height: calc(100% - 3rem + 1px);
    width: 100%;
`

const PortfolioImage = styled.img`
    display: block;
    width: 100%;
    object-fit: cover;
`

const PortfolioDetails = styled.div`
    padding: 1rem;

    > * {
        margin: 0 0 1.5rem 0;
    }

    > div:first-child {
        margin: 0 0 0.75rem;
    }

    > div:last-child {
        margin: 0;
    }
`

export default function PortfolioContainer() {

    const { 
        portfolioData,
        portfolioActive,
        setPortfolioActive,
        portfolioIndex,
        setPortfolioIndex,
    } = useContext(PortfolioContext)
    const dataLength = portfolioData.length
    const { id, name, image, image_alt, url, github, desc, highlights, todos, skills } = portfolioData[portfolioIndex - 1]

    return (
        <PortfolioWrapper portfolioActive={portfolioActive} >
            <PortfolioHeader
                id={id}
                url={url}
                dataLength={dataLength}
                setPortfolioActive={setPortfolioActive}
                portfolioIndex={portfolioIndex}
                setPortfolioIndex={setPortfolioIndex}
            >
                {name}
            </PortfolioHeader>
            <PortfolioContent>
                <PortfolioImage src={image} alt={image_alt} />
                <PortfolioDetails>
                    <PortfolioLinks
                        url={url}
                        github={github}
                    />
                    <div>
                        <p>{desc}</p>
                    </div>
                    <PortfolioInfo
                        highlights={highlights}
                        todos={todos}
                        skills={skills}
                    />
                </PortfolioDetails>
            </PortfolioContent>
        </PortfolioWrapper>
    )
}
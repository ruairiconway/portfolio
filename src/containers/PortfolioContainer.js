import React, { useContext } from 'react'
import { PortfolioContext } from '../contexts/PortfolioContext'
import styled from 'styled-components'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioLinks from '../components/PortfolioLinks'
import PortfolioInfo from '../components/PortfolioInfo'

const PortfolioWrapper = styled.div`
    position: fixed;
    right: ${({ portfolioActive }) => portfolioActive ? '3rem' : 'calc(-50% + 6rem)'};
    top: 3rem;
    width: calc(50% - 6rem);
    height: calc(100% - 6rem);
    border: 5px solid var(--ranColor);
    background: #FFF;
    transition: 0.5s;
    overflow: hidden;
    z-index: 1;

    @media all and (max-width: 1025px) {
        right: ${({ portfolioActive }) => portfolioActive ? '4rem' : 'calc(-50% + 8rem)'};
        top: 3rem;
        width: calc(100% - 8rem);
        height: calc(100% - 6rem);
    }

    @media all and (max-width: 550px) {
        right: ${({ portfolioActive }) => portfolioActive ? '0' : '-100%'};
        top: 0;
        height: 100%;
        width: 100%;
    }
`

const PortfolioContent = styled.div`
    overflow: auto !important;
    height: calc(100% - 40px);
    width: 100%;
`

const PortfolioImage = styled.img`
    display: block;
    width: 100%;
    object-fit: cover;
`

const PortfolioDetails = styled.div`
    padding: 0 2rem;

    h4 {
        font-family: 'work-sans', sans-serif;
        margin: 0 0 1.5rem 0;
    }

    p {
        margin: 2rem 0;
    }

    ul {
        margin: 0 0 2rem 0;
    }

    @media all and (max-width: 550px) {
        padding: 0 1.5rem;
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
                <PortfolioLinks
                    url={url}
                    github={github}
                />
                <PortfolioDetails>
                    <h4>{name}</h4>
                    <p>{desc}</p>
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
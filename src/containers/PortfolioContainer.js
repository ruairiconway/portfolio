import React, { useContext } from 'react'
import { PortfolioContext } from '../contexts/PortfolioContext'
import styled from 'styled-components'
import PortfolioHeader from '../components/PortfolioHeader'

const PortfolioWrapper = styled.div`
    ${({ portfolioActive }) => !portfolioActive && 'display: none;'}
    position: fixed;
    right: 0;
    top: 0;
    height: 100%;
    width: 50%;
    background: red;
    overflow: auto;
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
    const { id, name, url } = portfolioData[portfolioIndex - 1]

    return (
        <PortfolioWrapper portfolioActive={portfolioActive} >
            <PortfolioHeader
                id={id}
                url={url}
                dataLength={dataLength}
                setPortfolioActive={setPortfolioActive}
                portfolioIndex={portfolioIndex}
                setPortfolioIndex={setPortfolioIndex}
            >{name}</PortfolioHeader>
        </PortfolioWrapper>
    )
}
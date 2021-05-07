import React, { useContext } from 'react'
import styled from 'styled-components'
import { PortfolioContext } from '../contexts/PortfolioContext'

const Card = styled.div`
    
`

const PortfolioBtn = styled.button`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 200px;
    padding: 0;
    border: none;
    background-image: url(${({ value }) => value.image});
    background-position: center;
    transition: 0.2s;
    cursor: pointer; 

    h4 {
        max-width: 75%;
        padding: 0.5rem 1rem;
        text-align: right;
        color: var(--ranColor);
        background: #FFF;
        transition: 0.2s;
    }

    &:hover, &:focus {
        box-shadow: 5px 5px 0px 0px var(--ranColor);

        h4 {
            color: #FFF;
            background: var(--ranColor);
        }
    }

    ${({ value, portfolioActive, portfolioIndex }) => {
        if (portfolioActive && portfolioIndex === value.id) {
            return `
                box-shadow: 5px 5px 0px 0px var(--ranColor);

                h4 {
                    color: #FFF;
                    background: var(--ranColor);
                }
            `
        }
    }}

    &:active {
        box-shadow: 3px 3px 0px 0px var(--ranColor);

        h4 {
            color: #000;
            background: var(--ranColor);
        }
    }
`

export default function ProjectCard({value, ...props}) {

    const { portfolioActive, setPortfolioActive, portfolioIndex, setPortfolioIndex } = useContext(PortfolioContext)

    return (
        <Card>
            <PortfolioBtn
                value={value}
                portfolioActive={portfolioActive}
                portfolioIndex={portfolioIndex}
                onClick={() => {
                setPortfolioActive(true)
                setPortfolioIndex(value.id)
                }}
            >
                <h4>{value.name}</h4>
            </PortfolioBtn>
            <p>{value.caption}</p>
        </Card>
    )
}
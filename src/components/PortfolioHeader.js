import React from 'react'
import styled from 'styled-components'
import { CloseIcon, ExternalLinkIcon, ArrowLeftIcon, ArrowRightIcon } from '../assets/icons'

const HeaderWrapper = styled.div`
    display: grid;
    grid: 37px / 10% 10% 1fr 110px;
    border: solid var(--ranColor);
    border-width: 0 0 10px 0;
    transition: 0.5s;

    h4 {
        align-self: center;
        margin: 0 0 0 1rem;
    }
`

const CloseBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid var(--ranColor);
    border-width: 0 10px 0 0;
    background: #FF3B30;
    transition: 0.5s;
    cursor: pointer;

    &:hover,
    &:focus {
        svg path {
            fill: #FFF;
        }
    }

    &:active {
        svg path {
            fill: #000;
        }
    }
`

const ExternalA = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid var(--ranColor);
    border-width: 0 10px 0 0;
    transition: 0.5s;
    background: #28CD41;

    &:hover,
    &:focus {
        svg path {
            fill: #FFF;
        }
    }

    &:active {
        svg path {
            fill: #000;
        }
    }
`

const Title = styled.h4`
    color: var(--ranColor);
    text-transform: uppercase;
    transition: 0.5s;
`

const HeaderNav = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 37px;
        background: none;
        border: none;
        cursor: pointer;
        transition: 0.5s;

        &:hover {
            background: var(--ranColor);
            svg path {
                fill: #FFF;
            }
        }

        &:active {
            svg path {
                fill: #000;
            }
        }

    }

    p {
        text-align: center;
    }

`

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
        <HeaderWrapper>
            <CloseBtn onClick={() => setPortfolioActive(false)}>
                <CloseIcon />
            </CloseBtn>
            <ExternalA href={url} target="_blank" rel="noreferrer">
                <ExternalLinkIcon />
            </ExternalA>
            <Title>{children}</Title>
            <HeaderNav>
                <button onClick={() => handleIndex('left')}>
                    <ArrowLeftIcon />
                </button>
                <p>0{id}</p>
                <button onClick={() => handleIndex('right')}>
                    <ArrowRightIcon />
                </button>
            </HeaderNav>
        </HeaderWrapper>
    )
}
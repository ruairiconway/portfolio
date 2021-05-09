import React from 'react'
import styled from 'styled-components'
import { CloseIcon, ExternalLinkIcon, ArrowLeftIcon, ArrowRightIcon } from '../assets/icons'

const HeaderWrapper = styled.div`
    display: grid;
    grid: 35px / 40px 40px 1fr 125px;
    grid-template-areas:
        "close external name nav";
    border: solid var(--ranColor);
    border-width: 0 0 5px 0;
    transition: 0.5s;

    h4 {
        font-size: 1rem;
        align-self: center;
        margin: 0 1rem;
    }
`

const CloseBtn = styled.button`
    grid-area: close;
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid var(--ranColor);
    border-width: 0 5px 0 0;
    background: #FF3B30;
    transition: 0.5s;
    cursor: pointer;
    margin: 0;

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
    grid-area: external;
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid var(--ranColor);
    border-width: 0 5px 0 0;
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
    text-transform: capitalize;
    transition: 0.5s;
    grid-area: name;

    @media all and (max-width: 550px) {
        display: none;
    }
`

const HeaderNav = styled.div`
    grid-area: nav;
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

        &:hover, &:focus {
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

        @media all and (max-width: 550px) {
            &:hover, &:focus {
                background: #FFF;
                svg path {
                    fill: var(--ranColor);
                }
            }
            &:active {
                background: var(--ranColor);
                svg path {
                    fill: #000;
                }
            }
        }

    }

    p {
        text-align: center;
        font-family: 'Spectral', serif;
        font-weight: 400;
        font-size: 1rem;
        line-height: 1;
        color: lightgrey;
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

    // const maxLength = 19
    // let name = ''
    // if (children.length > maxLength) {
    //     name = `${children.substring(0, maxLength)}...`
    // } else {
    //     name = children
    // }

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
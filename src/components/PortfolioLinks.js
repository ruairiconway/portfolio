import React from 'react'
import styled from 'styled-components'
import { LinkIcon, GitHubIcon } from '../assets/icons'

const Wrapper = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    margin: 1rem 2rem 2rem;
`

const Link = styled.button`
    width: fit-content;
    height: fit-content;
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    background: none;
    border: none;
    border-radius: 0;
    cursor: pointer;
    transition: 0.5s;

    div {
        ${({ type }) => {
            if (type === 'visit') {
                return `margin: 0 0 0 0.25rem;`
            } else if (type === 'github') {
                return `margin: 0 0.25rem 0 0;`
            } 
        }}
    }

    &:hover,
    &:focus {
        div {
            background: var(--ranColor);
        }
        svg path {
            fill: #FFF;
        }
        p {
            color: #000;
        }
    }

    &:active {
        background: var(--ranColor);
        svg path {
            fill: #000;
        }
        p {
            color: #FFF;
        }
    }

    p {
        line-height: 1;
    }
`

const Icon = styled.div`
    display: flex;
    align-items: center;
    padding: 0.5rem;
    transition: 0.5s;
`

const Label = styled.p`
    margin: 0 0.5rem;
    color: lightgrey;
    line-height: 0;
    transition: 0.5s;

    @media all and (max-width: 550px) {
        display: none;
    }
`

export default function PortfolioLinks({ url, github, ...props }) {
    return (
        <Wrapper>
            <Link type='visit'>
                <Label>Visit</Label>
                <Icon>
                    <LinkIcon />
                </Icon>
            </Link>
            <Link type='github'>
                <Icon>
                    <GitHubIcon />
                </Icon>
                <Label>GitHub</Label>
            </Link>
        </Wrapper>
    )
}
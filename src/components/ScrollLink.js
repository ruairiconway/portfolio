import React from 'react'
import styled from 'styled-components'
import { ArrowDownIcon } from '../artwork/icons'
import TextLink from './TextLink'

const ScrollWrapper = styled.div`
    display: grid;
    grid-template: repeat(3, 1fr) / repeat(3, 1fr);
    grid-template-areas:
        "arrow-1 . ."
        ". scroll arrow-3"
        ". arrow-2 .";
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    transition: 0.5s;

    svg path {
        fill: var(--ranColor);
        transition: 0.5s;
    }

    @media all and (max-width: 550px) {
        grid-template: auto / repeat(3, 1fr);
        grid-template-areas:
            ". scroll ."; 
    }
`

const ScrollItem = styled.div`
    grid-area: ${({ type }) => type};
    transition: 0.25s;
    ${({ type }) => type === 'scroll' ? null : `&:hover { transform: translateY(3px); }`}

    @media all and (max-width: 500px) {
        ${({ type }) => type.includes('arrow') && 'display: none;'}
    }
`

export default function ScrollLink() {

    return (
        <ScrollWrapper>
            <ScrollItem type='scroll'>
                <TextLink to='#'>Scroll</TextLink>
            </ScrollItem>
            <ScrollItem type='arrow-1'>
                <ArrowDownIcon />
            </ScrollItem>
            <ScrollItem type='arrow-2'>
                <ArrowDownIcon />
            </ScrollItem>
            <ScrollItem type='arrow-3'>
                <ArrowDownIcon />
            </ScrollItem>
        </ScrollWrapper>
    )
}
import React, { useContext } from 'react'
import styled from 'styled-components'
import { ColorContext } from '../contexts/ColorContext'
import { ArrowDownIcon } from '../artwork/icons'
import TextLink from './TextLink'

const ScrollWrapper = styled.div`
    display: grid;
    grid-template: repeat(3, 1fr) / repeat(3, 1fr);
    grid-template-areas:
        "t-left t-center t-right"
        "m-left scroll m-right"
        "b-left b-center b-right"
    ;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    transition: 0.5s;

    svg path {
        fill: ${({ ranColor }) => ranColor};
        transition: 0.5s;
    }
`

const ScrollItem = styled.div`
    grid-area: ${({ area }) => area};
    transition: 0.25s;

    ${({ area }) => area === 'scroll' ? null : `&:hover { transform: translateY(3px); }`}
`

export default function ScrollLink() {

    const { ranColor } = useContext(ColorContext)

    return (
        <ScrollWrapper ranColor={ranColor}>
            <ScrollItem area='scroll'>
                <TextLink to='#'>Scroll</TextLink>
            </ScrollItem>
            <ScrollItem area='t-left'>
                <ArrowDownIcon />
            </ScrollItem>
            <ScrollItem area='b-center'>
                <ArrowDownIcon />
            </ScrollItem>
            <ScrollItem area='m-right'>
                <ArrowDownIcon />
            </ScrollItem>
        </ScrollWrapper>
    )
}
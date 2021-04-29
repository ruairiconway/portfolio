import React, { useContext } from 'react'
import styled from 'styled-components'
import { ColorContext } from '../contexts/ColorContext'

const Hero = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    height: 100vh;

    @media all and (max-width: 1025px) {
        display: none;
    }
`

const HeadlineWrapper = styled.div`
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    align-items: flex-end;
    height: 100%;
    padding: 2rem;
    color: ${({ ranColor }) => ranColor};
    transition: 0.5s;
`

const Headline = styled.h2`
    
`

export default function HeroContainer() {

    const { ranColor } = useContext(ColorContext)

    return (
        <Hero>
            <HeadlineWrapper ranColor={ranColor}>
                <Headline>RUA</Headline>
                <Headline>IR&Iacute;</Headline>
                <Headline>CON</Headline>
                <Headline>WAY</Headline>
            </HeadlineWrapper>
        </Hero>
    )
}
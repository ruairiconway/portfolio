import React from 'react'
import styled from 'styled-components'

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
    height: 100%;
    padding: 2rem;
`

const Headline = styled.h2`
    color: blue;
`

export default function HeroContainer() {
    return (
        <Hero>
            <HeadlineWrapper>
                <Headline>RUA</Headline>
                <Headline>IR&Iacute;</Headline>
                <Headline>CON</Headline>
                <Headline>WAY</Headline>
            </HeadlineWrapper>
        </Hero>
    )
}
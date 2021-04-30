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

export const HeadlineWrapper = styled.div`
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    align-items: flex-end;
    height: 100%;
    padding: 2rem;
    color: var(--ranColor);
    text-align: right;
    transition: 0.5s;
`

export default function HeroContainer() {
    return (
        <Hero>
            <HeadlineWrapper>
                <h2>RUA</h2>
                <h2>IR&Iacute;</h2>
                <h2>CON</h2>
                <h2>WAY</h2>
            </HeadlineWrapper>
        </Hero>
    )
}
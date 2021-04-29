import React from 'react'
import styled from 'styled-components'
import PageCount from '../components/PageCount'
import SocialBar from '../components/SocialBar'
import ScrollLink from '../components/ScrollLink'
import TextLink from '../components/TextLink'

const LandingWrapper = styled.div`
    position: relative;
    display: grid;
    grid: repeat(5, 1fr) / repeat(2, 1fr) repeat(2, auto);
    grid-template-areas:
        "count . . ."
        ". . social social"
        "name name . ."
        ". lead lead lead"
        ". scroll scroll ."
    ;
    height: 100%;
    width: 100%;

    @media all and (max-width: 550px) {
        grid-template-areas:
            "count . . ."
            ". . . social"
            "name name name name"
            "lead lead lead lead"
            "scroll scroll scroll scroll"
        ; 
    } 
`

const LandingItem = styled.div`
    grid-area: ${({ type }) => type};
    ${({ type }) => type === 'lead' && `
        justify-self: end;
        text-align: right;
        p {
            margin: 1rem 0;
        }
        @media all and (max-width: 1025px) {
            justify-self: center;
        }
    `}
    ${({ type }) => type === 'name' && `
        justify-self: center;
        @media all and (max-width: 550px) {
            justify-self: start;
            align-self: center;
        }
    `}
`

const LandingAside = styled.p`
        position: absolute;
        left: 0;
        bottom: 0;
        transform: rotate(-90deg) translateY(50%);
        transform-origin: left;
        font-family: 'Spectral', serif;
        font-weight: 400;
        color: lightgrey;
        @media all and (max-width: 550px) {
            display: none;
        }
`

export default function LandingPage() {
    return (
        <LandingWrapper>
            <LandingItem type='count'>
                <PageCount>01</PageCount>
            </LandingItem>
            <LandingItem type='social'>
                <SocialBar labelled stacked />
            </LandingItem>
            <LandingItem type='name'>
                <p>My name is <TextLink to='#'>Ruair&iacute; Conway</TextLink>.</p>
            </LandingItem>
            <LandingItem type='lead'>
                <p>I'm a frontend web developer<br/>based in Brooklyn, NY.</p>
                <p>Need something built?</p>
            </LandingItem>
            <LandingItem type='scroll'>
                <ScrollLink />
            </LandingItem>
            <LandingAside>Click anywhere to change colour</LandingAside>
        </LandingWrapper>
    )
}

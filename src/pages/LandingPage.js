import React from 'react'
import styled from 'styled-components'
import PageCount from '../components/PageCount'
import SocialBar from '../components/SocialBar'
import ScrollLink from '../components/ScrollLink'
import TextLink from '../components/TextLink'
import { HeadlineWrapper } from '../containers/HeroContainer'

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
        grid: repeat(2, 1fr) auto auto auto / repeat(2, auto) repeat(2, auto);
        grid-template-areas:
            "count headline headline headline"
            ". headline headline headline"
            "name name name name"
            "lead lead lead lead"
            "scroll scroll scroll scroll"
        ; 
    } 
`

const LandingItem = styled.div`
    grid-area: ${({ type }) => type};

    ${({ type }) => type === 'social' && `
        @media all and (max-width: 550px) {
            display: none;
        }
    `}

    ${({ type }) => type === 'headline' && `
        @media all and (max-width: 550px) {
            transform: translateX(1.25rem);

            div {
                padding: 2rem 0;
            }

            h2 {
                font-size: 4rem;
            }
        }
    `}

    ${({ type }) => type === 'name' && `
        justify-self: center;

        @media all and (max-width: 550px) {
            font-family: spectral, serif;
            justify-self: start;
            align-self: center;
        }
    `}
    
    ${({ type }) => type === 'lead' && `
        justify-self: end;
        text-align: right;

        p {
            margin: 1rem 0;
        }

        @media all and (max-width: 1025px) {
            justify-self: center;
        }

        @media all and (max-width: 550px) {
            justify-self: end;
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
            // display: none;
            bottom: 40%;
        }
`

export default function LandingPage() {
    return (
        <LandingWrapper>
            <LandingItem type='count'>
                <PageCount>01</PageCount>
            </LandingItem>
            <LandingItem type='headline'>
                <HeadlineWrapper>
                    <h2>RUA</h2>
                    <h2>IR&Iacute;</h2>
                    <h2>CON</h2>
                    <h2>WAY</h2>
                </HeadlineWrapper>
            </LandingItem>
            <LandingItem type='social'>
                <SocialBar labelled stacked />
            </LandingItem>
            <LandingItem type='name'>
                <p>My name is <TextLink to='#'>Ruair&iacute; Conway</TextLink>.</p>
            </LandingItem>
            <LandingItem type='lead'>
                <p>I'm a frontend developer<br/>based in Brooklyn, NY.</p>
                <p>Need a website?</p>
            </LandingItem>
            <LandingItem type='scroll'>
                <ScrollLink />
            </LandingItem>
            <LandingAside>Click anywhere to change colour</LandingAside>
        </LandingWrapper>
    )
}

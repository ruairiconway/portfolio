import React from 'react'
import styled from 'styled-components'
import PageCount from '../components/PageCount'
import LandingPage from '../pages/LandingPage'

const LandingSection = styled.section`
    position: relative;
    width: 50%;
    height: 100vh;
    padding: 2rem;

    @media all and (max-width: 1025px) {
        width: 100%;
    }
`

const ContentSection = styled.section`
    position: relative;
    width: 50%;
    padding: 2rem;

    @media all and (max-width: 1025px) {
        width: 100%;
    }
`

export default function ContentContainer() {
    return (
        <>
            <LandingSection>
                <LandingPage />
            </LandingSection>
            <ContentSection>
                <PageCount>02</PageCount>
                <h3>Work</h3>
            </ContentSection>
            <ContentSection>
                <PageCount>03</PageCount>
                <h3>About</h3>
            </ContentSection>
            <ContentSection>
                <PageCount>04</PageCount>
                <h3>Contact</h3>
            </ContentSection>
        </>
    )
}
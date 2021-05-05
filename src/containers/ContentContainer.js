import React from 'react'
import styled from 'styled-components'
import LandingPage from '../pages/LandingPage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import Footer from '../components/Footer'
import Workpage from '../pages/WorkPage'

const ContentSection = styled.section`
    position: relative;
    width: 50%;
    ${({ landing }) => landing && 'height: 100vh;'}
    padding: 2rem;

    @media all and (max-width: 1025px) {
        width: 100%;
        padding: 1.5rem;
    }
`

export default function ContentContainer() {
    return (
        <>
            <ContentSection landing>
                <LandingPage />
            </ContentSection>
            <ContentSection id="work">
                <Workpage />
            </ContentSection>
            <ContentSection id="about">
                <AboutPage />
            </ContentSection>
            <ContentSection id="contact">
                <ContactPage />
            </ContentSection>
            <ContentSection>
                <Footer />
            </ContentSection>
        </>
    )
}
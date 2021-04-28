import React from 'react'
import styled from 'styled-components'

const LandingSection = styled.section`
    width: 50%;
    height: 100vh;

    @media all and (max-width: 500px) {
        width: 100%;
    }
`

const ContentSection = styled.section`
    width: 50%;

    @media all and (max-width: 500px) {
        width: 100%;
    }
`

export default function ContentContainer() {
    return (
        <>
            <LandingSection>

            </LandingSection>
            <ContentSection>
                <h3>Work</h3>
            </ContentSection>
            <ContentSection>
                <h3>About</h3>
            </ContentSection>
            <ContentSection>
                <h3>Contact</h3>
            </ContentSection>
        </>
    )
}
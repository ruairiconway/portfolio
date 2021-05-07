import React from 'react'
import styled from 'styled-components'
import ContactForm from '../components/ContactForm'
import PageCount from '../components/PageCount'

const Title = styled.h3`
    margin: 2rem 0 3rem 0;
    color: var(--ranColor);
    transition: 0.5s;
`

export default function ContactPage() {
    return (
        <>
            <PageCount>04</PageCount>
            <Title>Contact</Title>
            <p>I’m always looking for new opportunities.<br/>Whether it’s freelance or full-time, give me a shout!</p>
            <ContactForm />
        </>
    )
}
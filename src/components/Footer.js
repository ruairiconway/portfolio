import React from 'react'
import styled from 'styled-components'
import SocialBar from './SocialBar'

const Wrapper = styled.div`
    padding: 0 3rem;
`

const Copyright = styled.p`
    text-align: center;
    color: lightgrey;
    font-size: 0.5rem;
`

export default function Footer() {
    return (
        <Wrapper>
            <SocialBar labelled />
            <Copyright>Ruairí Conway &copy; {new Date().getFullYear()}</Copyright>
        </Wrapper>
    )
}
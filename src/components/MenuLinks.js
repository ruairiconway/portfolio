import React from 'react'
import styled from 'styled-components'

const LinksWrapper = styled.div`

`
const Link = styled.a`
    display: block;
    margin: 2rem 0;
    text-align: right;

    :first-child {
        margin-top: 0;
    }

    :last-child {
        margin-bottom: 0;
    }
`

export default function MenuLinks() {
    return (
        <LinksWrapper>
            <Link href='#'>Work</Link>
            <Link href='#'>About</Link>
            <Link href='#'>Contact</Link>
        </LinksWrapper>
    )
}
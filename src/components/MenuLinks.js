import React from 'react'
import styled from 'styled-components'
import TextLink from './TextLink'

const LinksWrapper = styled.div`

`
const Link = styled.div`
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
            <Link><TextLink to='#work'>Work</TextLink></Link>
            <Link><TextLink to='#about'>About</TextLink></Link>
            <Link><TextLink to='#contact'>Contact</TextLink></Link>
        </LinksWrapper>
    )
}
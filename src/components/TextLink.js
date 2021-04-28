import React from 'react'
import styled from 'styled-components'

const Link = styled.a`
    position: relative;
    font-style: italic;
    text-decoration: none;
    color: blue;
    padding: 2px;

    &:after {
        position: absolute;
        content: '';
        left: 0;
        bottom: 0;
        height: 2px;
        width: 100%;
        background: blue;
        transition: 0.2s;
        z-index: -1;
    }

    &:hover, &:focus {
        &:after {
            bottom: 40%;
            height: 5px;
        }
    }

    &:active {
        color: white;
        &:after {
            height: 100%;
            bottom: 0;
        }
    }
`

export default function TextLink({ to, children }) {
    return (
        <Link href={to}>{children}</Link>
    )
}
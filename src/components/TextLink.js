import React from 'react'
import styled from 'styled-components'

const Link = styled.a`
    position: relative;
    font-style: italic;
    text-decoration: none;
    color: var(--ranColor);
    padding: 0 4px;
    transition: 0.5s;
    cursor: pointer;

    &:after {
        position: absolute;
        content: '';
        left: 0;
        bottom: 0;
        height: 2px;
        width: 100%;
        background: var(--ranColor);
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
    return <Link href={to}>{children}</Link>
}
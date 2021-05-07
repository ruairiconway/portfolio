import React from 'react'
import styled from 'styled-components'

const Border = styled.div`
    pointer-events: none;
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border: var(--ranColor) 5px solid;
    background: none;
    transition: 0.5s;

    @media all and (max-width: 1025px) {
        width: 100%;
    }
`

export default function Frame() {
    return (
        <Border />
    )
}
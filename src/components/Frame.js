import React, { useContext } from 'react'
import styled from 'styled-components'
import { FrameContext } from '../context/FrameContext'

const Border = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: ${({ frameScrolled }) => frameScrolled ? '50%' : '100%'};
    height: 100%;
    border: blue 5px solid;
    background: none;
    transition: 1s;

    @media all and (max-width:500px) {
        width: 100%;
    }
`

export default function Frame() {

    const { frameScrolled } = useContext(FrameContext)

    return (
        <Border frameScrolled={frameScrolled} />
    )
}
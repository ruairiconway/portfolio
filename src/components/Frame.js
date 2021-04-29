import React, { useContext } from 'react'
import styled from 'styled-components'
import { FrameContext } from '../contexts/FrameContext'
import { ColorContext } from '../contexts/ColorContext'

const Border = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: ${({ frameScrolled }) => frameScrolled ? '50%' : '100%'};
    height: 100%;
    border: ${({ ranColor }) => ranColor} 10px solid;
    background: none;
    transition: 0.5s;
    z-index: -1;

    @media all and (max-width: 1025px) {
        width: 100%;
    }
`

export default function Frame() {

    const { frameScrolled } = useContext(FrameContext)
    const { ranColor } = useContext(ColorContext)

    return (
        <Border frameScrolled={frameScrolled} ranColor={ranColor} />
    )
}
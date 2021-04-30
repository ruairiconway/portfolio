import React, { useState } from 'react'
import styled from 'styled-components'
import { MenuIcon } from '../artwork/icons'
import Menu from '../components/Menu'

const MenuBtnOpen = styled.button`
    position: fixed;
    top: 0;
    right: 50%;
    margin: 1.75rem;
    padding: 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    transition: 0.5s;
    z-index: 1;

    @media all and (max-width: 1025px) {
        right: 0;
    }

    @media all and (max-width: 550px) {
        margin: 1.5rem;
    }

    svg path {
        fill: var(--ranColor);
        transition: 0.5s;
    }

    &:hover,
    &:focus {
        background: var(--ranColor);
        svg path {
            fill: #FFF;
        }
    }

    &:active {
        svg path {
            fill: #000;
        }
    }
`

export default function MenuContainer() {

    const [ menuActive, setMenuActive ] = useState(false)

    return (
        <>
            <MenuBtnOpen onClick={() => setMenuActive(!menuActive)}>
                <MenuIcon />
            </MenuBtnOpen>
            <Menu menuActive={menuActive} setMenuActive={setMenuActive} />
        </>
    )
}
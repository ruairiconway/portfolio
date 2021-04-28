import React, { useState } from 'react'
import styled from 'styled-components'
import { MenuIcon } from '../artwork/icons'
import Menu from '../components/Menu'

const MenuBtnOpen = styled.button`
    position: fixed;
    top: 0;
    right: 50%;
    margin: 2rem;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    @media all and (max-width: 500px) {
        right: 2rem;
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
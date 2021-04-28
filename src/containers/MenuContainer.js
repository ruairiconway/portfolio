import React, { useState } from 'react'
import styled from 'styled-components'
import { MenuIcon } from '../artwork/icons'
import Menu from '../components/Menu'

const MenuBtnOpen = styled.button`
    position: fixed;
    margin: 0;
    padding: 0;
    top: calc(2em + 5px);
    right: calc(50% + 2rem);
    display: flex;
    justify-content: center;
    align-items: center;
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
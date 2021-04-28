import React, { useState } from 'react'
import styled from 'styled-components'
import { MenuIcon } from '../icons/icons'
import Menu from '../components/Menu'

const MenuBtnOpen = styled.button`
    position: fixed;
    margin: 0;
    padding: 0;
    right: 50%;
    height: 25px;
    width: 25px;
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
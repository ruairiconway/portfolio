import React from 'react'
import styled from 'styled-components'

const MenuWrapper = styled.div`
    position: fixed;
    right: 50%;
    transform: translateX(${props => props.menuActive ? '0' : '100%' });
    transition: 1s ease-in-out;
`

export default function Menu({ menuActive, setMenuActive }) {
    return(
        <MenuWrapper menuActive={menuActive}>this is the menu
            <button onClick={() => setMenuActive(!menuActive)}>close menu</button>
        </MenuWrapper>
    )
}
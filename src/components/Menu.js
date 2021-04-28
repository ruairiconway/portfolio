import React from 'react'
import styled from 'styled-components'
import { CloseIcon } from '../artwork/icons'
import SocialBar from './SocialBar'
import MenuLinks from './MenuLinks'

const MenuWrapper = styled.div`
    position: fixed;
    right: 50%;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
    padding: calc(2rem - 5px) 2rem;
    min-width: 250px;
    background: white;
    border: solid blue;
    border-width: 5px 0 5px 5px;
    transform: translateX(${({ menuActive }) => menuActive ? '0' : '100%' });
    visibility: ${({ menuActive}) => menuActive ? 'visibile' : 'hidden' };
    transition: 1s;
`

const MenuBtnClose = styled.button`
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function Menu({ menuActive, setMenuActive }) {
    return(
        <MenuWrapper menuActive={menuActive}>
            <MenuBtnClose onClick={() => setMenuActive(!menuActive)}>
                <CloseIcon />
            </MenuBtnClose>
            <SocialBar />
            <MenuLinks />
        </MenuWrapper>
    )
}
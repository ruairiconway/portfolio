import React from 'react'
import styled from 'styled-components'
import { CloseIcon } from '../assets/icons'
import SocialBar from './SocialBar'
import MenuLinks from './MenuLinks'

const MenuWrapper = styled.div`
    position: fixed;
    right: calc(50% - 10px);
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
    padding: 2rem;
    min-width: 250px;
    background: white;
    border: var(--ranColor) solid;
    border-width: 0 10px 10px 10px;
    transform: translateY(${({ menuActive }) => menuActive ? '0' : '-100%' });
    visibility: ${({ menuActive}) => menuActive ? 'visibile' : 'hidden' };
    transition: 0.5s;
    z-index: 2;

    @media all and (max-width: 1025px) {
        right: 0;
        border-width: 0px 0px 10px 10px;
    }

    a {
        font-size: 2rem;
    }
`

const MenuBtnClose = styled.button`
    padding: 0.5rem;
    background: none;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.5s;

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

export default function Menu({ menuActive, setMenuActive }) {
    return(
        <MenuWrapper 
            menuActive={menuActive}
        >
            <MenuBtnClose onClick={() => setMenuActive(!menuActive)}>
                <CloseIcon />
            </MenuBtnClose>
            <SocialBar />
            <MenuLinks />
        </MenuWrapper>
    )
}
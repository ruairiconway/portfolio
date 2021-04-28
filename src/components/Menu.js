import React, { useContext } from 'react'
import styled from 'styled-components'
import { FrameContext } from '../context/FrameContext'
import { CloseIcon } from '../artwork/icons'
import SocialBar from './SocialBar'
import MenuLinks from './MenuLinks'

const MenuWrapper = styled.div`
    position: fixed;
    right: calc(50% - 5px);
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
    padding: 2rem;
    min-width: 250px;
    background: white;
    border: solid blue;
    border-width: ${({ frameScrolled }) => frameScrolled ? '5px 0 5px 5px' : '0 5px 5px 5px' };
    transform: translateY(${({ menuActive }) => menuActive ? '0' : '-100%' });
    // visibility: ${({ menuActive}) => menuActive ? 'visibile' : 'hidden' };
    transition: 0.5s;

    @media all and (max-width: 500px) {
        right: 0;
    }
`

const MenuBtnClose = styled.button`
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function Menu({ menuActive, setMenuActive }) {

    const { frameScrolled } = useContext(FrameContext)

    return(
        <MenuWrapper 
            menuActive={menuActive}
            frameScrolled={frameScrolled}
        >
            <MenuBtnClose onClick={() => setMenuActive(!menuActive)}>
                <CloseIcon />
            </MenuBtnClose>
            <SocialBar />
            <MenuLinks />
        </MenuWrapper>
    )
}
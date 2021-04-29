import React, { useContext } from 'react'
import styled from 'styled-components'
import { FrameContext } from '../contexts/FrameContext'
import { ColorContext } from '../contexts/ColorContext'
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
    border: solid ${({ ranColor }) => ranColor};
    border-width: ${({ frameScrolled }) => frameScrolled ? '5px 0 5px 5px' : '0 5px 5px 5px' };
    transform: translateY(${({ menuActive }) => menuActive ? '0' : '-100%' });
    visibility: ${({ menuActive}) => menuActive ? 'visibile' : 'hidden' };
    transition: 0.5s;
    z-index: 2;

    @media all and (max-width: 500px) {
        right: 0;
        border-width: 0px 0px 5px 5px;
    }

    a {
        font-size: 2rem;
    }
`

const MenuBtnClose = styled.button`
    padding: 0.25rem;
    background: none;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.5s;

    svg path {
        fill: ${({ ranColor }) => ranColor};
        transition: 0.5s;
    }

    &:hover,
    &:focus {
        background: ${({ ranColor }) => ranColor};
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

    const { frameScrolled } = useContext(FrameContext)
    const { ranColor } = useContext(ColorContext)

    return(
        <MenuWrapper 
            menuActive={menuActive}
            frameScrolled={frameScrolled}
            ranColor={ranColor}
        >
            <MenuBtnClose onClick={() => setMenuActive(!menuActive)} ranColor={ranColor}>
                <CloseIcon />
            </MenuBtnClose>
            <SocialBar />
            <MenuLinks />
        </MenuWrapper>
    )
}
import React, { useContext } from 'react'
import styled from 'styled-components'
import { ColorContext } from '../contexts/ColorContext'
import { EmailIcon, LinkedInIcon, GitHubIcon } from '../artwork/icons'

const SocialWrapper = styled.div`
    ${({ stacked }) => stacked ? 
        `display: grid;
        grid: repeat(2, 1fr) / repeat(2, 1fr);
        grid-template-areas:
            "email linkedin"
            ". github"
        ;
        gap: 1em;`
        :
        `display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;`
    }
    width: 100%;
    margin: 2rem 0;
`

const SocialBtn = styled.button`
    grid-area: ${({ type }) => type};
    width: fit-content;
    height: fit-content;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: ${({ type }) => type === 'email' ? 'flex-end' : 'flex-start' };
    ${({ type }) => type === 'email' && 'justify-self: end;'}
    align-items: center;
    background: none;
    border: none;
    border-radius: 0;
    cursor: pointer;
    transition: 0.5s;

    svg path {
        fill: ${({ ranColor }) => ranColor};
        transition: 0.5s;
    }

    div {
        ${({ labelled, type }) => {
            if (labelled && type === 'email') {
                return `margin: 0 0 0 0.25rem;`
            } else if (labelled && type !== 'email') {
                return `margin: 0 0.25rem 0 0;`
            } else if (!labelled) {
                return ``
            }
        }}
    }

    &:hover,
    &:focus {
        div {
            background: ${({ ranColor }) => ranColor};
        }
        svg path {
            fill: #FFF;
        }
        p {
            color: #000;
        }
    }

    &:active {
        background: ${({ ranColor }) => ranColor};
        svg path {
            fill: #000;
        }
        p {
            color: #FFF;
        }
    }
`

const Icon = styled.div`
    display: flex;
    align-items: center;
    padding: 0.25rem;
    transition: 0.5s;
`

const SocialLabel = styled.p`
    margin: 0 0.5rem;
    color: lightgrey;
    line-height: 0;
    transition: 0.5s;
`

export default function SocialBar({ labelled = false, stacked = false }) {

    const { ranColor } = useContext(ColorContext)

    return(
        <SocialWrapper stacked={stacked}>
            <SocialBtn type='email' ranColor={ranColor} labelled={labelled}>
                {labelled && <SocialLabel>Email</SocialLabel>}
                <Icon>
                    <EmailIcon />
                </Icon>
            </SocialBtn>
            <SocialBtn type='linkedin' ranColor={ranColor} labelled={labelled}>
                <Icon>
                    <LinkedInIcon />
                </Icon>
                {labelled && <SocialLabel>LinkedIn</SocialLabel>}
            </SocialBtn>
            <SocialBtn type='github' ranColor={ranColor} labelled={labelled}>
                <Icon>
                    <GitHubIcon />
                </Icon>
                {labelled && <SocialLabel>GitHub</SocialLabel>}
            </SocialBtn>
        </SocialWrapper>
    )
}
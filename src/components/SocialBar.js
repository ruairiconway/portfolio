import React from 'react'
import styled from 'styled-components'
import { EmailIcon, LinkedInIcon, GitHubIcon } from '../assets/icons'

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

    @media all and (max-width: 550px) {
        margin: ${({ stacked }) => stacked ? `0` : `2rem 0` };
    }
`

const SocialBtn = styled.a`
    grid-area: ${({ dest }) => dest};
    width: fit-content;
    height: fit-content;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: ${({ dest }) => dest === 'email' ? 'flex-end' : 'flex-start' };
    ${({ dest }) => dest === 'email' && 'justify-self: end;'}
    align-items: center;
    background: none;
    border: none;
    border-radius: 0;
    cursor: pointer;
    transition: 0.5s;

    div {
        ${({ labelled, dest }) => {
            if (labelled && dest === 'email') {
                return `margin: 0 0 0 0.25rem;`
            } else if (labelled && dest !== 'email') {
                return `margin: 0 0.25rem 0 0;`
            } else if (!labelled) {
                return ``
            }
        }}
    }

    &:hover,
    &:focus {
        div {
            background: var(--ranColor);
        }
        svg path {
            fill: #FFF;
        }
        p {
            color: #000;
        }
    }

    &:active {
        background: var(--ranColor);
        svg path {
            fill: #000;
        }
        p {
            color: #FFF;
        }
    }

    @media all and (max-width: 550px) {
        div {
            margin: 0;
        }
    }
`

const Icon = styled.div`
    display: flex;
    align-items: center;
    padding: 0.5rem;
    transition: 0.5s;
`

const SocialLabel = styled.p`
    margin: 0 0.5rem;
    color: lightgrey;
    line-height: 0;
    transition: 0.5s;

    @media all and (max-width: 550px) {
        display: none;
    }
`

export default function SocialBar({ labelled = false, stacked = false }) {
    return(
        <SocialWrapper stacked={stacked}>
            <SocialBtn
                href="mailto:hi@ruairiconway.com"
                target="_blank"
                dest="email"
                labelled={labelled}>
                {labelled && <SocialLabel>Email</SocialLabel>}
                <Icon>
                    <EmailIcon />
                </Icon>
            </SocialBtn>
            <SocialBtn
                href="https://www.linkedin.com/in/ruairiconway"
                target="_blank"
                dest="linkedin"
                labelled={labelled}>
                <Icon>
                    <LinkedInIcon />
                </Icon>
                {labelled && <SocialLabel>LinkedIn</SocialLabel>}
            </SocialBtn>
            <SocialBtn
                href="https://github.com/ruairiconway"
                target="_blank"
                dest="github"
                labelled={labelled}>
                <Icon>
                    <GitHubIcon />
                </Icon>
                {labelled && <SocialLabel>GitHub</SocialLabel>}
            </SocialBtn>
        </SocialWrapper>
    )
}
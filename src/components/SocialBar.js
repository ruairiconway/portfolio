import React from 'react'
import styled from 'styled-components'
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
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: ${({ type }) => type === 'email' ? 'flex-end' : 'flex-start' };
    ${({ type }) => type === 'email' && 'justify-self: end;'}
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;

    svg {
        margin: 0 0.5rem;
    }

    p {
        padding: 0.5rem;
        color: lightgrey;
    }
`

export default function SocialBar({ labelled = false, stacked = false }) {
    return(
        <SocialWrapper stacked={stacked}>
            <SocialBtn type='email'>
                {labelled && <p>Email</p>}
                <EmailIcon />
            </SocialBtn>
            <SocialBtn type='linkedin'>
                <LinkedInIcon />
                {labelled && <p>LinkedIn</p>}
            </SocialBtn>
            <SocialBtn type='github'>
                <GitHubIcon />
                {labelled && <p>GitHub</p>}
            </SocialBtn>
        </SocialWrapper>
    )
}
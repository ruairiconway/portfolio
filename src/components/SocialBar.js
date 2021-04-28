import React from 'react'
import styled from 'styled-components'
import { EmailIcon, LinkedInIcon, GitHubIcon } from '../artwork/icons'

const SocialWrapper = styled.div`
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    justify-content: space-between;
    margin: 2em 0;
`

const SocialBtn = styled.button`
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function SocialBar({ labelled = false }) {
    return(
        <SocialWrapper>
            <SocialBtn>
                {labelled && <p>Email</p>}
                <EmailIcon />
            </SocialBtn>
            <SocialBtn>
                <LinkedInIcon />
                {labelled && <p>LinkedIn</p>}
            </SocialBtn>
            <SocialBtn>
                {labelled && <p>GitHub</p>}
                <GitHubIcon />
            </SocialBtn>
        </SocialWrapper>
    )
}
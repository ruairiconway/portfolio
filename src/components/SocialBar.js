import React from 'react'
import styled from 'styled-components'
import { EmailIcon, LinkedInIcon, GitHubIcon } from '../artwork/icons'

const SocialWrapper = styled.div`
    ${({ stacked }) => stacked ? 
        `display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;`
        :
        `display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;`
    }
    width: 100%;
    margin: 2em 0;
`

const SocialBtn = styled.button`
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function SocialBar({ labelled = false, stacked = false }) {
    return(
        <SocialWrapper stacked={stacked}>
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
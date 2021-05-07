import React from 'react'
import styled from 'styled-components'
import PageCount from '../components/PageCount'
import TextLink from '../components/TextLink'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { AboutIcon } from '../assets/icons'

let skills = ['HTML5', 'CSS/SCSS', 'JavaScript (ES6+)', 'React', 'JQuery', 'Git', 'GitHub', 'Figma', 'Adobe Illo.' ]

const TitleWrapper = styled.div`
    display: flex;
    flex-flow: column nowrap;
    width: fit-content;
    align-items: center;
    margin: 2rem 0;

    h3 {
        margin-bottom: 1rem;
        color: var(--ranColor);
        transition: 0.5s;
    }
`

const LeadPara = styled.p`
    font-weight: 600;
    text-align: right;
`

const List = styled.ul`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
    margin-left: 0;
    padding-left: 0;
`

export default function AboutPage() {
    
    const { width } = useWindowDimensions()

    return (
        <>
            <PageCount>03</PageCount>
            <TitleWrapper>
                <h3>About</h3>
                <AboutIcon />
            </TitleWrapper>
            <LeadPara>{width > 1025 ? 'Just like the big sign says, m' : 'M' }y name is <TextLink>Ruair&iacute;</TextLink>.</LeadPara>
            <p>I’m a frontend developer from Ireland, based in Brooklyn.</p>
            <p>With a background in design project management and coding with a focus on UX/UI + accessibility; I like to build with creativity in both technique and design.</p>
            <List>
                {skills.map((skill, i) => <li key={i}>- {skill}</li>)}
            </List>
            <p>Away from my laptop, I play rugby and bake bread.</p>
        </>
    )
}
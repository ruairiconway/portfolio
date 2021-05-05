import React from 'react'
import PageCount from '../components/PageCount'
import TextLink from '../components/TextLink'
import { BoldPara } from '../styles/BoldPara'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { AboutIcon } from '../assets/icons'

let skills = ['HTML5', 'CSS/SCSS', 'JavaScript (ES6+)', 'React', 'JQuery', 'Git', 'GitHub', 'Figma', 'Adobe Illo.' ]

export default function AboutPage() {
    
    const { width } = useWindowDimensions()

    return (
        <>
            <PageCount>03</PageCount>
            <h3>About</h3>
            <AboutIcon />
            <BoldPara>{width > 1025 ? 'Just like the big sign says, m' : 'M' }y name is <TextLink>Ruair&iacute;</TextLink>.</BoldPara>
            <p>I’m a frontend developer from Ireland, based in Brooklyn.</p>
            <p>With a background in design project management and coding with a focus on UX/UI + accessibility; I like to build with creativity in both technique and design.</p>
            <ul>
                {skills.map((skill, i) => <li key={i}>{skill}</li>)}
            </ul>
            <p>Away from my laptop, I play rugby and bake bread.</p>
        </>
    )
}
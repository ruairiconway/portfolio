import React from 'react'
import styled from 'styled-components'
import { StarIcon, FlagIcon, HtmlOpenIcon, HtmlCloseIcon } from '../assets/icons'

const TitleWrapper = styled.div`
    display: flex;
    flex-flow: row nowrap;
    margin-bottom: 0.5rem;

    h5 {
        ${({ type }) => {
            if (type === 'right') {
                return 'margin: 0 1rem 0 0;'
            } else if (type === 'left') {
                return 'margin: 0 0 0 1rem;'
            } else if (type === 'both') {
                return 'margin: 0 1rem;'
            }
        }}
    }
`

const Title = styled.h5`

`

export default function PortfolioInfo({ highlights, todos, skills, ...props }) {

    const highlightsList = highlights.map((item, i) => <li key={i}>- {item}</li>)
    const todosList = todos.map((item, i) => <li key={i}>- {item}</li>)
    const skillsList = skills.map((item, i) => <li key={i}>- {item}</li>)

    return (
        <>
            <div>
                <TitleWrapper type='right'>
                    <Title>Highlights</Title>
                    <StarIcon />
                </TitleWrapper>
                <ul>
                    {highlightsList}
                </ul>
            </div>
            <div>
                <TitleWrapper type='left'>
                    <FlagIcon />
                    <Title>Todos</Title>
                </TitleWrapper>
                <ul>
                    {todosList}
                </ul>
            </div>
            <div>
                <TitleWrapper type='both'>
                    <HtmlOpenIcon />
                    <Title>Skills</Title>
                    <HtmlCloseIcon />
                </TitleWrapper>
                <ul>
                    {skillsList}
                </ul>
            </div>
        </>
    )
}
import React from 'react'
import styled from 'styled-components'

const Title = styled.h5`
    margin-bottom: 0.5rem;
`

export default function PortfolioInfo({ highlights, todos, skills, ...props }) {

    const highlightsList = highlights.map((item, i) => <li key={i}>{item}</li>)
    const todosList = todos.map((item, i) => <li key={i}>{item}</li>)
    const skillsList = skills.map((item, i) => <li key={i}>{item}</li>)

    return (
        <>
            <div>
                <Title>Highlights</Title>
                <ul>
                    {highlightsList}
                </ul>
            </div>
            <div>
                <Title>Todos</Title>
                <ul>
                    {todosList}
                </ul>
            </div>
            <div>
                <Title>Skills</Title>
                <ul>
                    {skillsList}
                </ul>
            </div>
        </>
    )
}
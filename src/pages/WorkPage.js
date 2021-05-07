import React, { useContext } from 'react'
import styled from 'styled-components'
import { WorkIcon } from '../assets/icons'
import { PortfolioContext } from '../contexts/PortfolioContext'
import PageCount from '../components/PageCount'
import ProjectCard from '../components/ProjectCard'

const TitleWrapper = styled.div`
    display: flex;
    flex-flow: row nowrap;
    width: fit-content;
    justify-content: center;
    align-items: flex-start;
    margin: 2rem 0 3rem;

    h3 {
        margin-right: 2rem;
        color: var(--ranColor);
        transition: 0.5s;
    }
`

const ProjectWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    width: 100%;

    @media all and (max-width: 1170px) {
        grid-template-columns: 1fr;
    }

    @media all and (max-width: 1025px) {
        grid-template-columns: 1fr 1fr;
    }

    @media all and (max-width: 550px) {
        grid-template-columns: 1fr;
    }
`

export default function Workpage() {

    const { portfolioData } = useContext(PortfolioContext)

    const generatePortfolio = portfolioData.map( item => {
        return <ProjectCard key={item.id} value={item} />
    })

    return (
        <>
            <PageCount>02</PageCount>
            <TitleWrapper>
                <h3>Work</h3>
                <WorkIcon />
            </TitleWrapper>
            <ProjectWrapper>
                {generatePortfolio}
            </ProjectWrapper>
        </>
    )
}
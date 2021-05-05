import React, { useContext } from 'react'
import { PortfolioContext } from '../contexts/PortfolioContext'
import PageCount from '../components/PageCount'
import ProjectCard from '../components/ProjectCard'

export default function Workpage() {

    const { portfolioData } = useContext(PortfolioContext)

    const generatePortfolio = portfolioData.map( item => {
        return <ProjectCard key={item.id} value={item} />
    })

    return (
        <>
            <PageCount>02</PageCount>
            <h3>Work</h3>
            <div>
                {generatePortfolio}
            </div>
        </>
    )
}
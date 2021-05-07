import React from 'react'
import styled from 'styled-components'

const PageNum = styled.p`
    font-family: 'Spectral', serif;
    font-weight: 400;
    color: lightgrey;
    margin: 0;
`

export default function PageCount({ children }) {
    return (
        <PageNum>{children}</PageNum>
    )
}
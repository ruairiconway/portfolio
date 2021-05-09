import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
    html {
        scroll-behavior: smooth;
        --ranColor: ${({colorHex}) => colorHex};
    }

    /* font-family: 'Spectral', serif;
    font-family: 'Work Sans', sans-serif; */

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
    }

    h1, h2, h3, h4, h5, p {
        margin: 0;
    }

    h2 {
        font-family: 'Spectral', serif;
        font-weight: 700;
        font-size: 10rem;
        letter-spacing: 1.5rem;
        line-height: 1;
    }

    h3 {
        font-family: 'Spectral', serif;
        font-weight: 700;
        font-size: 3rem;
        letter-spacing: 2px;
        line-height: 1;
    }

    h4 {
        font-family: 'Spectral', serif;
        font-weight: 700;
        font-size: 1.25rem;
        letter-spacing: 1.25px;
        line-height: 1;
    }

    h5 {
        font-family: 'Work Sans', sans-serif;
        font-weight: 600;
        font-size: 1rem;
        letter-spacing: 1.25px;
        line-height: 1;
    }

    p {
        font-family: 'Work Sans', sans-serif;
        font-weight: 400;
        font-size: 1rem;
        letter-spacing: 0.1px;
        line-height: 1.6;
        margin: 1.5rem 0;
    }

    a {
        text-decoration: none;
    }

    a, button p {
        font-family: 'Spectral', serif;
        font-weight: 400;
        font-size: 1rem;
        letter-spacing: 0.1px;
    }

    a p {
        font-family: 'Spectral', serif;
        font-weight: 400;
        font-size: 1rem;
        letter-spacing: 0.1px;
    }

    svg path {
        transition: 0.5s;
    }

    ul {
        list-style-type: none;
        margin: 1rem 0;
        padding: 0;
    }

    li {
        font-family: 'Work Sans', sans-serif;
        font-weight: 400;
        font-size: 1rem;
        letter-spacing: 0.1px;
        line-height: 1.6;
    }

`
import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
    html {
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

    h1, h2, h3, p {
        margin: 0;
    }

    h2 {
        font-family: 'Spectral', serif;
        font-weight: 700;
        font-size: 10rem;
        letter-spacing: 1.5rem;
        line-height: 1;
    }

    p {
        font-family: 'Work Sans', sans-serif;
        font-weight: 400;
        font-size: 1rem;
        letter-spacing: 0.1px;
        line-height: 1.6;
    }

    a, button p {
        font-family: 'Spectral', serif;
        font-weight: 400;
        font-size: 1rem;
        letter-spacing: 0.1px;
    }
`
import React, { useState } from 'react'
import { GlobalStyles } from './styles/GlobalStyles'
import { generateColor } from './tools'
import MenuContainer from './containers/MenuContainer'
import HeroContainer from './containers/HeroContainer'
import ContentContainer from './containers/ContentContainer'
import Frame from './components/Frame'

function App() {

    const [ ranColor, setRanColor ] = useState('#0000FF')

    function handleColorChange(e) {
        const target = e.target.tagName.toLowerCase()
        if ( target === 'div' || target === 'section' || target === 'h2' ) {
            setRanColor(generateColor)
        }
    }

    return (
        <>
            <GlobalStyles colorHex={ranColor} />
            <div onClick={(e) => handleColorChange(e)}>
                <MenuContainer />
                <HeroContainer />
                <ContentContainer />
                <Frame />
            </div>
        </>
    );
}

export default App;

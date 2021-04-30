import React, { useState, useContext } from 'react'
import { FrameContext } from './contexts/FrameContext'
import { GlobalStyles } from './GlobalStyles'
import { generateColor } from './tools'
import MenuContainer from './containers/MenuContainer'
import HeroContainer from './containers/HeroContainer'
import ContentContainer from './containers/ContentContainer'
import Frame from './components/Frame'

function App() {

    const { watchScroll } = useContext(FrameContext)
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
            <div onWheel={() => watchScroll()} onClick={(e) => handleColorChange(e)}>
                <Frame />
                <MenuContainer />
                <HeroContainer />
                <ContentContainer />
            </div>
        </>
    );
}

export default App;

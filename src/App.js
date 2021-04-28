import React, { useContext } from 'react'
import './App.css'
import { FrameContext } from './contexts/FrameContext'
import { ColorContext } from './contexts/ColorContext'
import MenuContainer from './containers/MenuContainer'
import HeroContainer from './containers/HeroContainer'
import ContentContainer from './containers/ContentContainer'
import Frame from './components/Frame'

function App() {

    const { watchScroll } = useContext(FrameContext)
    const { generateRanColor } = useContext(ColorContext)

    return (
        <div onWheel={() => watchScroll()} onClick={() => generateRanColor()}>
            <Frame />
            <MenuContainer />
            <HeroContainer />
            <ContentContainer />
        </div>
    );
}

export default App;

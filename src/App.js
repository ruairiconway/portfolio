import React, { useContext } from 'react'
import './App.css'
import { FrameContext } from './context/FrameContext'
import MenuContainer from './containers/MenuContainer'
import HeroContainer from './containers/HeroContainer'
import ContentContainer from './containers/ContentContainer'
import Frame from './components/Frame'

function App() {

    const { watchScroll } = useContext(FrameContext)

    return (
        <div onWheel={() => watchScroll()}>
            <Frame />
            <MenuContainer />
            <HeroContainer />
            <ContentContainer />
        </div>
    );
}

export default App;

import React from 'react'
import styled from 'styled-components';
import './App.css';
import MenuContainer from './containers/MenuContainer'

const Content = styled.div`
    width: 50%;
    padding: 2em;
`

function App() {
  return (
    <>
        <Content>
            <MenuContainer />
        </Content>
    </>
  );
}

export default App;

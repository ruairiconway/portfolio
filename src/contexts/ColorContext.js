import React, { useState } from 'react'
const ColorContext = React.createContext()

function ColorContextProvider({ children, ...prevProps }) {

    const [ ranColor, setRanColor ] = useState('#0000FF')

    function generateRanColor() {
        // let colorHex = '#'
        // while ( colorHex.length < 7 ) {
        //     colorHex += (Math.round(Math.random() * 15)).toString(16)
        // }
        setRanColor('#0000FF')
    }

    return (
        <ColorContext.Provider value={{ ranColor: ranColor, generateRanColor: generateRanColor }}>
            {children}
        </ColorContext.Provider>
    )

}

export { ColorContextProvider, ColorContext }
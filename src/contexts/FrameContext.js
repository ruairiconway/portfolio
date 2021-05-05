import React, { useState, createContext } from 'react'
const FrameContext = createContext()

function FrameContextProvider({ children, ...prevProps }) {

    const [ frameScrolled, setFrameScrolled ] = useState(false)

    function watchScroll() {
        window.pageYOffset >= 10 ? setFrameScrolled(true) : setFrameScrolled(false)
    }

    return (
        <FrameContext.Provider value={{ frameScrolled: frameScrolled, watchScroll: watchScroll }} >
            {children}
        </FrameContext.Provider>
    )

}

export { FrameContextProvider, FrameContext }

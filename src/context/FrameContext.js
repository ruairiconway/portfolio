import React, { useState } from 'react'
const FrameContext = React.createContext()

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

import React, { useState } from 'react'
import { SendIcon } from '../assets/icons'
import PageCount from '../components/PageCount'

export default function ContactPage() {

    const [ formName, setFormName ] = useState('')
    function handleNameChange(e) { setFormName(e.target.value) }
    
    const [ formEmail, setFormEmail ] = useState('')
    function handleEmailChange(e) { setFormEmail(e.target.value) }
    
    const [ formMessage, setFormMessage ] = useState('')
    function handleMessageChange(e) { setFormMessage(e.target.value) }

    return (
        <>
            <PageCount>04</PageCount>
            <h3>Contact</h3>
            <p>I’m always looking for new opportunities.<br/>Whether it’s freelance or full-time. Give me a shout!</p>
            <form>
                <input
                    type='text'
                    name="name"
                    placeholder="Name"
                    value={formName}
                    aria-label="enter name"
                    onChange={handleNameChange}
                />
                <input
                    type='email'
                    name="email"
                    placeholder="Email"
                    value={formEmail}
                    aria-label="enter email"
                    onChange={handleEmailChange}
                />
                <textarea
                    name="message"
                    value={formMessage}
                    placeholder="Your message..."
                    aria-label="enter message"
                    onChange={handleMessageChange}
                />
                <SendIcon />
                <SendIcon />
                <button
                    type="submit"
                    aria-label="send message"
                >Send</button>
            </form>
        </>
    )
}
import React, { useState } from 'react'
import styled from 'styled-components'
import { useForm, ValidationError } from '@formspree/react'
import { SendIcon } from '../assets/icons'

const Form = styled.form`
    display: flex;
    flex-flow: column nowrap;

    input, textarea {
        font-family: 'Work Sans', sans-serif;
        font-weight: 600;
        font-size: 1rem;
        background: lightgrey;
        border: none;
        max-width: 100%;
        margin: 1rem 0;
        padding: 0.75rem;
        transition: 0.2s;

        &::placeholder {
            transition: 0.2s;
            color: #000;
        }

        &:hover, &:focus {
            box-shadow: 5px 5px 0px 0px var(--ranColor);
        }

        &:focus {
            &::placeholder {
                color: darkgrey;
            }
        }

        &:active {
            box-shadow: 3px 3px 0px 0px var(--ranColor);
        }

    }

    textarea {
        min-height: 175px;
    }
`

const SubmitWrapper = styled.div`
    align-self: flex-end;
    display: grid;
    width: fit-content;
    margin: 1rem 0 0 0;
    grid: 1fr 1fr / auto auto 1fr;
    grid-template-areas:
        "icon1 . btn"
        ". icon2 btn";
`

const Icon = styled.div`
    grid-area: ${({ area }) => area};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2rem;
`

const SubmitBtnWrapper = styled.div`
    grid-area: ${({ area }) => area};
    align-self: center;
    margin: 0 4rem 0 0;
`

const SubmitBtn = styled.button`
    font-family: 'Spectral', serif;
    font-weight: 400;
    font-size: 1rem;
    font-style: italic;
    letter-spacing: 0.1px;
    color: var(--ranColor);
    position: relative;
    width: fit-content;
    background: none;
    border: none;
    padding: 0 4px;
    transition: 0.2s;
    cursor: pointer;

    &:after {
        position: absolute;
        content: '';
        left: 0;
        bottom: 0;
        height: 2px;
        width: 100%;
        background: var(--ranColor);
        transition: 0.2s;
        z-index: -1;
    }

    &:hover, &:focus {
        &:after {
            bottom: 40%;
            height: 5px;
        }
    }

    &:active {
        color: #FFF;
        &:after {
            height: 100%;
            bottom: 0;
        }
    }
`

export default function ContactForm() {

    const [ formName, setFormName ] = useState('')
    function handleNameChange(e) { setFormName(e.target.value) }
    
    const [ formEmail, setFormEmail ] = useState('')
    function handleEmailChange(e) { setFormEmail(e.target.value) }
    
    const [ formMessage, setFormMessage ] = useState('')
    function handleMessageChange(e) { setFormMessage(e.target.value) }

    const [ formSubmit, handleFormSubmit ] = useForm("mayaqzew")

    if (formSubmit.succeeded) {
        return <p>Thanks for the note! I'll be in touch soon.</p>
    }

    return (
        <Form onSubmit={handleFormSubmit}>
            <input
                id="name"
                type="text"
                name="name"
                placeholder="Name"
                value={formName}
                aria-label="enter name"
                onChange={handleNameChange}
            />
            <ValidationError 
                prefix="Name"
                field="name"
                errors={formSubmit.errors}
            />
            <input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={formEmail}
                aria-label="enter email"
                onChange={handleEmailChange}
            />
            <ValidationError 
                prefix="Email"
                field="email"
                errors={formSubmit.errors}
            />
            <textarea
                id="message"
                name="message"
                value={formMessage}
                placeholder="Message..."
                aria-label="enter message"
                onChange={handleMessageChange}
            />
            <ValidationError 
                prefix="Message"
                field="message"
                errors={formSubmit.errors}
            />
            <SubmitWrapper>
                <Icon area="icon1">
                    <SendIcon />
                </Icon>
                <Icon area="icon2">
                    <SendIcon />
                </Icon>
                <SubmitBtnWrapper area="btn">
                    <SubmitBtn
                        type="submit"
                        disabled={formSubmit.submitting}
                        aria-label="send message"
                    >Send</SubmitBtn>
                </SubmitBtnWrapper>
            </SubmitWrapper>
        </Form>
    )
}
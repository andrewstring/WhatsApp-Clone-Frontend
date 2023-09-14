import { useState, useContext } from 'react'

import { CredentialsContext } from '../Contexts/CredentialsContext'

import "../css/Modal.css"

// Axios import
import axios from "axios"

// Axios setup
axios.defaults.baseURL = "http://localhost:3005"


const Modal = ({type, handleAddChat}) => {
    // State initialization
    const [ inputOne, setInputOne ] = useState("")
    const [ error, setError ] = useState(false)
    const [ inputArr, setInputArr ] = useState([""])

    // Context initialization
    const credentials = useContext(CredentialsContext)
    console.log(credentials)

    const handleChange = (inputType, e) => {
        if (inputType === "addChat") {
            setInputOne(e.target.value)
        }
    }
    const handleSubmit = async (inputType, e) => {
        e.preventDefault()
        if (inputType === "addChat") {
            try {
                await axios.post("/chatroom/new", {
                    name: inputOne,
                    id: credentials._id
                })
                setError(false)
                setInputOne("")
                handleAddChat()
            } catch (e) {
                setError(true)
            }
        }
    }

    if (type === "addChat") {
        return (
            <div className="Modal">
                <form onSubmit={(e) => handleSubmit(type,e)}>
                    <label>Enter Chat Name</label>
                    <input
                    placeholder="Chat Name"
                    value={inputOne}
                    onChange={(e) => handleChange(type,e)}
                    ></input>
                    { inputArr.map(input => {
                        return (
                            <input
                            placeholder="Add Member"></input>
                            
                        )
                    })
                    }
                    <input
                    type="submit"
                    ></input>
                    {error && <p>chatRoomAlreadyExists</p>}
                </form>
            </div>
        )
    }
}


export default Modal
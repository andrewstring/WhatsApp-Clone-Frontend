// react import
import { useState, useContext } from 'react'

// css import
import "../css/Modal.css"

// context import
import { CredentialsContext } from '../Contexts/CredentialsContext'
import { MongodbContext } from '../Contexts/MongodbContext'

// library import
import axios from "axios"

// library setup
axios.defaults.baseURL = "http://localhost:3005"
// axios.defaults.baseURL = "https://whatsapp-clone-backend-608e90b922c2.herokuapp.com"


const Modal = ({type, handleAddChat, modalRef}) => {

    // state initialization
    const [ inputOne, setInputOne ] = useState("")
    const [ error, setError ] = useState(false)
    const [ memberQuery, setMemberQuery ] = useState([])
    const [ members, setMembers ] = useState([])

    // context initialization
    const credentials = useContext(CredentialsContext)
    const mongodb = useContext(MongodbContext)

    // collection initialization
    const accountsCollection = mongodb.db("test").collection("accounts")

    // prop/helper functions
    const handleMemberQuery = async (e) => {
        let accounts = []
        if (e.target.value) {
            // add escaped values to handle errors in regex parsing
            const escapedInput = e.target.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`\\b${escapedInput}\\w*\\b`, 'i');
            accounts = await accountsCollection.find({
                "username": pattern
            })
            accounts = accounts.filter(account => account._id.toString() != credentials._id)
        }
        setMemberQuery(accounts)
    }
    const handleAddMember = (e,member) => {
        e.preventDefault()
        setMembers((members) => {
            if (!members.includes(member)) {
                return [member, ...members]
            }
            return [...members]
        })
    }
    const handleChange = (inputType, e) => {
        if (inputType === "addChat") {
            setInputOne(e.target.value)
        }
    }
    const handleSubmit = async (inputType, e) => {
        e.preventDefault()
        console.log(e.nativeEvent.submitter.id)
        if (inputType === "addChat") {
            try {
                await axios.post("/chatroom/new", {
                    name: inputOne,
                    id: credentials._id,
                    members: members.map(member => member._id)
                })
                setError(false)
                setInputOne("")
                handleAddChat()
            } catch (e) {
                console.log(e.response.data)
                setError("Chat Room already exists")
            }
        }
    }
    const handleExit = () => handleAddChat()

    // rendering
    if (type === "addChat") {
        return (
            <div className="Modal-outer">
                <div
                ref={modalRef}
                className="Modal Modal-addChat">
                        <div className="Modal-chatName-header">
                            <h3>MEMBERS ADDED TO CHAT:</h3>
                            {members.length ?
                            members.map((member) => {
                                return <p>{member.username}</p>
                            })
                            : <p>None yet</p>}
                        </div>
                        <form className="Modal-chatName-form" onSubmit={(e) => handleSubmit(type,e)}>
                            <label>Enter Chat Name</label>
                            <div className="Modal-form-input">
                                <input
                                placeholder="Chat Name"
                                type="text"
                                value={inputOne}
                                onChange={(e) => handleChange(type,e)}
                                ></input>
                                <input
                                id="addChat"
                                type="submit"
                                value="Create Chat"
                                ></input>
                            </div>
                            {error && <p>{error}</p>}
                        </form>

                        <div className="Modal-chatMembers-header">
                            <h3>ADD MEMBERS TO CHAT</h3>
                        </div>
                        <form className="Modal-chatMembers-form" onSubmit={(e) => handleSubmit(type,e)}>
                            <label>Enter Username</label>
                            <div className="Modal-form-input">
                                <input
                                onChange={handleMemberQuery}
                                placeholder="Username"
                                type="text"
                                ></input>
                            </div>
                            
                            <div className="Modal-member-query">
                                {memberQuery.length ? memberQuery.map(member => 
                                    <div className="Modal-member-query-member">
                                        <button onClick={(e) => handleAddMember(e,member)}>{member.username}</button>
                                    </div>)
                                : <p></p>}
                            </div>
                        </form>
                </div>

            </div>
            
        )
    }
    if (type === "attachmentModal") {
        return (
            <h1>Attachment</h1>
        )
    }
}


export default Modal
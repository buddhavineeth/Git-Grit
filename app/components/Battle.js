import React from "react"
import { FaUserFriends, FaUserSlash, FaTrophy, FaTimesCircle } from "react-icons/fa"
import PropTypes from "prop-types"
import {ThemeConsumer} from "../contexts/theme"
import {Link} from "react-router-dom"

function Instructions () {
    return (
        <ThemeConsumer>
            {({theme}) => (
                <div className = "instructions-container">
                    <h1 className = "center-text header-lg">
                        How this works
                    </h1>
                    <ol className = "container-small grid center-text battle-instructions">
                        <li>
                            <h3 className = "header-sm">Enter two GitHub usernames</h3>
                            <FaUserFriends className = {"bg-" + theme} color = "rgb(255, 191, 116)" size = {140}/>
                        </li>
                        <li>
                            <h3 className = "header-sm">Let them battle it out</h3>
                            <FaUserSlash className = {"bg-" + theme} color = "#727272" size = {140}/>
                        </li>
                        <li>
                            <h3 className = "header-sm">Find out the champion</h3>
                            <FaTrophy className = {"bg-" + theme} color = "rgb(255, 215, 0)" size = {140}/>
                        </li>
                    </ol>
                </div>
            )}
        </ThemeConsumer>
    )
}

class PlayerInput extends React.Component {
    state = {
        username: ""
    }

    handleSubmit = (event) => {
        //prevent normal browser events from taking place
        event.preventDefault()
        this.props.onSubmit(this.state.username)
    }

    handleChange = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    render() {
        return (
            <ThemeConsumer>
                {({theme}) => (
                    <form className = "column player" onSubmit = {this.handleSubmit}>
                        <label htmlFor = "username" className = "player-label">
                            {this.props.label}    
                        </label>
                        <div className = "row player-inputs">
                            <input
                                type = "text"
                                id = "username"
                                className = {"input-" + theme}
                                placeholder = "Username"
                                autoComplete = "off"
                                //value of input field is local state
                                //to update input field, must update local state
                                value = {this.state.username}
                                onChange = {this.handleChange}
                            />
                            <button 
                                className = {`btn ${theme === "dark" ? "btn-light" : "btn-dark"}`}
                                type = "submit"
                                disabled = {!this.state.username}>
                                Submit
                            </button>
                        </div>
                    </form>
                )}
            </ThemeConsumer>
        )
    }
}

PlayerInput.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
}

function PlayerPreview ({username, onReset, label}) {
    return (
        <ThemeConsumer>
            {({theme}) => (
                <div className = "column player">
                    <h3 className = "player-label">
                        {label}
                    </h3>
                    <div className = {`row bg-${theme}`}>
                        <div className = "player-info">
                            <img 
                                className = "avatar-sm" 
                                src = {"https://github.com/" + username + ".png?size=200"}
                                alt = {"Avatar for " + username}
                            />
                            <a
                                href = {"https://github.com/" + username}
                                className = "link">
                                    {username}
                            </a>
                        </div>
                        <button
                            className = "btn-clear flex-center"
                            onClick = {onReset}>
                                <FaTimesCircle color = "#008080" size = {26} />
                        </button>
                    </div>
                </div>
            )}
        </ThemeConsumer>
    )
}

PlayerPreview.propTypes = {
    username: PropTypes.string.isRequired,
    onReset: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
}

export default class Battle extends React.Component {
    state = {
        playerOne: null,
        playerTwo: null,
    }

    handleSubmit = (id, playerName) => {
        this.setState({
            [id]: playerName,
        })
    }

    handleReset = (id) => {
        this.setState({
            [id]: null,
        })
    }

    render() {
        const { playerOne, playerTwo} = this.state;
        
        return (
            <React.Fragment>
                <Instructions />
                
                <div className = "player-container">
                    <h1 className = "center-text header-lg">Players</h1>
                    <div className = "row space-around">
                        {playerOne === null 
                        ?   <PlayerInput 
                                label = "Enter Player One"
                                onSubmit = {(player) => this.handleSubmit("playerOne", player)}
                            />
                        :   <PlayerPreview 
                                username = {playerOne}
                                label = "Player One" 
                                onReset = {() => this.handleReset("playerOne")} 
                            />
                        }

                        {playerTwo === null
                        ? <PlayerInput 
                            label = "Enter Player Two"
                            onSubmit = {(player) => this.handleSubmit("playerTwo", player)}
                          />
                        : <PlayerPreview 
                            username = {playerTwo}
                            label = "Player Two" 
                            onReset = {() => this.handleReset("playerTwo")} 
                          />
                        }
                    </div>
                    
                    {playerOne && playerTwo && (
                        <Link 
                            className = "btn btn-dark btn-space"
                            to = {{
                                pathname: "/battle/results",
                                search: `?playerOne=${playerOne}&playerTwo=${playerTwo}`
                            }}
                        >
                            Battle
                        </Link>
                    )}
                </div>
            </React.Fragment>
        )
    }
}
import React from "react"
import PropTypes from "prop-types"
import { fetchPopularRepos } from "../utils/api"
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from "react-icons/fa"
import Card from "./Card"
import Loading from "./Loading"
import Tooltip from "./Tooltip"

//stateless Functional Component that is a function of its Props
function LanguagesNav({ currentLanguage, onUpdateLanguage }) {
    const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"]

    return (
        <ul className = "flex-center">
            {languages.map((language) => (
                //every Language is unique so can use as key
                <li key = {language}>
                    <button 
                        className = "btn-clear nav-link"
                        style = {language === currentLanguage ? { color: "rgb(0,128,128)"} : null}
                        onClick = {() => onUpdateLanguage(language)}>
                        {language}
                    </button>
                </li>
            ))}
        </ul>
    )
}

LanguagesNav.propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired,
}

//create a Grid Component for the Popular Repositories that're fetched from GitHub API
function Grid ({ repos }) {
    return (
        <ul className = "grid space-around">
           {repos.map((repo, index) => {
               const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
               const { login, avatar_url } = owner
               
               return  (
                <li key = {html_url}>
                    <Card 
                        header = {index + 1 + "."}
                        avatar = {avatar_url}
                        href = {html_url}
                        name = {login}
                    >
                        <ul className = "card-list">
                            <li>
                                <Tooltip text = "GitHub Username">
                                    <FaUser color = "rgb(255, 191, 116)" size = {22}/>
                                    <a href = {"https://github.com/" + login}>
                                        {login}
                                    </a> 
                                </Tooltip>
                            </li>
                            <li>
                                <FaStar color = "rgb(255, 215, 0)" size = {22}/>
                                    {stargazers_count.toLocaleString()} stars
                            </li>
                            <li>
                                <FaCodeBranch color = "rgb(129, 195, 245)" size = {22}/>
                                {forks.toLocaleString()} forks
                            </li>
                            <li>
                                <FaExclamationTriangle color = "rgb(241, 138, 147)" size = {22}/>
                                {open_issues.toLocaleString()} open issues
                            </li>
                        </ul>
                    </Card>
                </li>
               )
           })}
        </ul>
    )
}

Grid.propTypes = {
    repos: PropTypes.array.isRequired
}

export default class Popular extends React.Component {
    state = {
        selectedLanguage: "All",
        repos: {},
        error: null,
    }

    componentDidMount () {
        this.updateLanguage(this.state.selectedLanguage)
    }   

    updateLanguage = (selectedLanguage) => {
        this.setState({
            selectedLanguage,
            error: null,
        })

        //only fetch repos if its not in the
        if (!this.state.repos[selectedLanguage]) {
            fetchPopularRepos(selectedLanguage)
            .then((data) => {
                this.setState(({ repos }) => ({
                    repos: {
                        ...repos,
                        [selectedLanguage] : data
                    }
                }))
            })
            .catch(() => {
                console.warn("Error fetching repos: ", error)
                
                this.setState({
                    error: "There was an error fetching the repositories."
                })
            })
        }
    }

    isLoading = () => {
        const { selectedLanguage, repos, error} = this.state

        return !repos[selectedLanguage] && error === null
    }

    render() {
        const { selectedLanguage , repos, error } = this.state

        return (
            <React.Fragment>
                <LanguagesNav
                    currentLanguage = {selectedLanguage} 
                    onUpdateLanguage = {this.updateLanguage}
                />
                
                {/* if isLoading is true, second expression is evaluated */}
                {this.isLoading() && <Loading text = "Please wait while we fetch em' all"/>}
                
                {error && <p className = "center-text error">{error}</p> }

                {repos[selectedLanguage] && <Grid repos = {repos[selectedLanguage]} />}
            </React.Fragment>
        )
    }
}   
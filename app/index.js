import React from "react"
import ReactDOM from "react-dom"
import "./index.css" //to allow all css to be active
import {ThemeProvider} from "./contexts/theme"
import NavBar from "./components/NavBar"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Loading from "./components/Loading"


//Component has 3 things
// 1. State (each Component manages its own state)
// 2. Life Cycle (fetching data from API etc)
// 3. UI (main focus)


//function should return a promise that resolves a particular module/ particular component
const Popular = React.lazy(() => import("./components/Popular"))
const Battle = React.lazy(() => import("./components/Battle"))
const Results = React.lazy(() => import("./components/Results"))

//Defining a Component
class App extends React.Component {
    state = {
        theme: "light",
        toggleTheme: () => {
            this.setState(({ theme }) => ({
                theme: theme === "light" ? "dark" : "light"
            }))
        }
    }
    
    //this method is the main thing that describes how UI looks like
    render() {
        return (
            <Router>
                <ThemeProvider value = {this.state}>
                    <div className = {this.state.theme}>   
                        <div className = "container">
                            <NavBar />

                            <React.Suspense fallback = {<Loading />}>
                                <Switch>
                                    <Route exact path = "/" component = {Popular} />
                                    <Route exact path = "/battle" component = {Battle} />
                                    <Route path = "/battle/results" component = {Results} />
                                    <Route render = {() => 
                                        <h3>Error 404: Page was not found. Use one of the above links. </h3>
                                    }/>
                                </Switch>
                            </React.Suspense>
                        </div>
                    </div>
                </ThemeProvider>
            </Router>
        )
    }
}

//Using a Component
ReactDOM.render(
    <App />,
    document.getElementById("app")
)
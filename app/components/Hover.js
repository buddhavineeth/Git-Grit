import React from "react"

//a Render Prop Component
//This Component does not render its own UI
//it simply maintains local state,
//A functional component with a UI to be rendered, but depends on state of this Component, will be passed to this through children
//this component invokes the children by passing an argument (its local state)
//depending on value of argument, the invoked function renders relevant ui
// this method is used to avoid Naming Collisions
export default class Hover extends React.Component {
    state = {
        hovering: false,
    }

    mouseOver = () => {
        this.setState({
            hovering: true
        })
    }

    mouseOut = () => {
        this.setState({
            hovering: false
        })  
    }
    
    render() {
        return (
            <div onMouseOver = {this.mouseOver} onMouseOut = {this.mouseOut}>
                {this.props.children(this.state.hovering)}
            </div>
        )
    }
}
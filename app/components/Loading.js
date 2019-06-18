import React from "react"
import PropTypes from "prop-types"

const styles = {
    content : {
        fontSize: "35px",
        position: "absolute",
        left: "0",
        right: "0",
        marginTop: "20px",
        textAlign: "center",
    }
}
export default class Loading extends React.Component {
    state = {
        content: this.props.text
    }
    
    componentDidMount() {
        //create a class property so that you can access this interval
        //in other methods like componentWillUnmount
        const {text, interval} = this.props

        this.interval = window.setInterval(() => {
            this.state.content === text + "..."
                ? this.setState({content: text})
                : this.setState(({content}) => ({content : content + "."}))
        }, interval)
    }

    componentWillUnmount() {
        window.clearInterval(this.interval)
    }

    render() {
        return (
            <p style = {styles.content} >
                {this.state.content}
            </p>
        )
    }
}

Loading.propTypes = {
    text: PropTypes.string.isRequired,
    interval: PropTypes.number.isRequired,
}

Loading.defaultProps = {
    text: "Loading",
    interval: 300
}
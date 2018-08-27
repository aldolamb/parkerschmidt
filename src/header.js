import React from "react";
import Instagram from "./icons/instagram.svg";
import Vimeo from "./icons/vimeo.svg";
import Mail from "./icons/mail.svg";

export class Header extends React.Component {
    render() {
        return (
            <header>
                <div style={{float: "left"}}><a href="/">PARKER SCHMIDT</a></div>
                <div style={{float: "right", paddingTop: ".25em"}} >
                    <a href="https://www.instagram.com/parkerrschmidtt/?hl=en"><img src={Instagram}/></a>
                    <a href="https://vimeo.com/parkerschmidt"><img src={Vimeo}/></a>
                    <a href="mailto:parkerschmidt95@gmail.com"><img style={{fontSize: "1.2em", paddingLeft: ".45em", marginBottom: "-.07em"}} src={Mail}/></a>
                </div>
            </header>
        )
    }
}
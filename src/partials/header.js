import React from "react";
import Mail from "../icons/Contact.svg"

export class Header extends React.Component {
    render() {
        return (
            <header>
                <div className="parkerSchmidt"><a href="/">PARKER SCHMIDT</a></div>
                <div className="contactLink"><a href="mailto:parkerschmidt95@gmail.com"><img src={Mail} alt="contact"/><span>CONTACT</span></a></div>
            </header>
        )
    }
}
import React from "react";

export class Header extends React.Component {
    render() {
        return (
            <header>
                <div className="parkerSchmidt" style={{float: "left"}}><a href="/">PARKER SCHMIDT</a></div>
                <div className="contact" style={{float: "right"}}>
                    <a href="mailto:parkerschmidt95@gmail.com">CONTACT</a>
                    {/*<div className="adobeAfterEffects"/>*/}
                    {/*<a href="https://www.instagram.com/parkerrschmidtt/?hl=en"><img src={Instagram} alt="Instagram"/></a>*/}
                    {/*<a href="mailto:parkerschmidt95@gmail.com"><img style={{fontSize: "1.2em", paddingLeft: ".45em", marginBottom: "-.07em"}} src={Mail} alt="Contact"/></a>*/}
                </div>
            </header>
        )
    }
}
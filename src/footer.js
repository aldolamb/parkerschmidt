import React from "react";

export class Footer extends React.Component {
    render() {
        return (
            <footer>
                &copy; {(new Date()).getFullYear()} Design & build by <a href="https://aldolamberti.com/">Aldo Lamberti.</a>
            </footer>
        )
    }
}
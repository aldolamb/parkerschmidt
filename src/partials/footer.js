import React from "react";

export class Footer extends React.Component {
  render() {
    return (
      <footer className="noSelect">
        <div>&copy; {new Date().getFullYear()} Parker Schmidt</div>
      </footer>
    );
  }
}

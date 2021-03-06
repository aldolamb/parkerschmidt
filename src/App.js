import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./stylesheets/css/index.css";

import { Header } from "./components";
import { Edit, Login, Main, Project, Upload } from "./pages";

export class App extends Component {
  componentDidMount() {
    console.log(
      "%cconcrete",
      "text-align: center; padding: .3em .6em; font-weight: bold; font-size: 24px; color: white; background: black;"
    );
  }

  render() {
    return (
      <div>
        <Header />
        {sessionStorage.getItem("loggedIn") ? (
          <Router>
            <Switch>
              <Route path="/edit/:postID" component={Edit} />
              <Route path="/upload" component={Upload} />
              <Route path="/login" component={Login} />
              <Route path="/:postID" component={Project} />
              <Route path="/" component={Main} />
            </Switch>
          </Router>
        ) : (
          <Router>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/:postID" component={Project} />
              <Route path="/" component={Main} />
            </Switch>
          </Router>
        )}
      </div>
    );
  }
}

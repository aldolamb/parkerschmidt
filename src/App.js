import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './css/App.css';

import { Main } from "./main";
import { Header } from "./partials/header";
import { Project } from "./project";
import { Login } from "./login";
import { Upload } from "./upload";
import { Edit } from "./edit";

export class App extends Component {
    componentDidMount () {
        console.log('%cMade By Aldo', 'font-weight: bold; font-size: 2em; color: white; padding: 1em; background: black;');
    }

    render() {
        return (
            <div>
                <Header/>
                {sessionStorage.getItem("loggedIn") ?
                    <Router>
                        <Switch>
                            <Route path='/edit/:postID'     component={Edit} />
                            <Route path='/upload'           component={Upload}/>
                            <Route path='/login'            component={Login} />
                            <Route path='/:postID'          component={Project} />
                            <Route path='/'                 component={Main} />
                        </Switch>
                    </Router> :
                    <Router>
                        <Switch>
                            <Route path='/login'            component={Login} />
                            <Route path='/:postID'          component={Project} />
                            <Route path='/'                 component={Main} />
                        </Switch>
                    </Router>
                }
            </div>
        )
    }
}

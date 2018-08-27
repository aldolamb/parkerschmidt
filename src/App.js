import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import firebase from "firebase";
import { Main } from "./main";
import { Login } from "./login";
import { Edit } from "./edit";

const config = {
    apiKey: "AIzaSyAZziublbH4L5O0uxy3bDJUeAXFS6Eulhc",
    authDomain: "parkerschmidt-cd115.firebaseapp.com",
    databaseURL: "https://parkerschmidt-cd115.firebaseio.com",
    projectId: "parkerschmidt-cd115",
    storageBucket: "parkerschmidt-cd115.appspot.com",
    messagingSenderId: "82396941507"
};
firebase.initializeApp(config);

export class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/edit/:postID'     component={Edit} />
                    <Route path='/login'            component={Login} />
                    <Route path='/'                 component={Main} />
                </Switch>
            </Router>
        )
    }
}

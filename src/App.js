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
        console.log('%cAldo Lamberti', 'text-align: center; padding: .5em 1em 1em .5em; font-weight: bold; font-size: 50px;color: #1a1a1a; text-shadow: 3px 3px 0 #333333, 6px 6px 0 #4d4d4d, 9px 9px 0 #666666, 12px 12px 0 #808080, 15px 15px 0 #999999, 18px 18px 0 #b3b3b3, 21px 21px 0 #cccccc, 24px 24px 0 #e6e6e6');
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

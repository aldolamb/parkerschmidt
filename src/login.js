import React from 'react';
import { firebaseAuth } from './config/firebase.js';

export class Login extends React.Component {
    async handleSubmit(e) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const self = this;
        e.preventDefault();

        firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(function() {
                sessionStorage.setItem("loggedIn", true);
                self.props.history.push('/')
            })
            .catch(function() {
                sessionStorage.setItem("loggedIn", false);
                alert("Log In Failed")
            });
    }

    static resetForm () {
        document.getElementById('contact-form').reset();
    }

    render () {
        return (
            <div className="single-form" style={{paddingTop: "30vh"}}>
                <form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">
                    <div className="form-group">
                        <input placeholder="email" type="email" className="form-control" id="email" autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <input placeholder="password" type="password" className="form-control" id="password" autoComplete="off" />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        )
    }
}
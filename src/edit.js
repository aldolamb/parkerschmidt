import React from 'react';
const firebase = require("firebase");

export class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            postID: props.match.params.postID
        };
    }

    componentWillMount() {
        this.loadFeed();
    }

    async loadFeed() {
        let self = this;
        firebase.firestore().collection("posts").doc(this.state.postID).get().then(snapshot => {
            self.setState({data: snapshot.data()});
            this.state.data.Roles.map((e) => document.getElementById(e).checked = true);
        })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }

    async handleSubmit(e) {
        const title = document.getElementById('title').value;
        const image = document.getElementById('image').value.replace("google.com/open", "google.com/uc");
        const url = document.getElementById('url').value;
        const checkBoxes = document.querySelectorAll("input[name^='vehicle']:checked");

        let Roles = [];
        for (let item of checkBoxes) {
            Roles.push(item.value);
        }

        // console.log(roles);
        const self = this;
        e.preventDefault();

        firebase.firestore().collection("posts").doc(this.state.postID).update({
            Title: title,
            Image: image,
            URL: url,
            Roles}).then(function() {
            self.props.history.push('/')
        });
    }

    onChange(e) {
        let dataCopy = JSON.parse(JSON.stringify(this.state.data));
        dataCopy[e.target.name] = e.target.value;
        this.setState({data: dataCopy});
    }

    render() {
        return (
            <div className="single-form">
                <div className="upload">
                    <form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input type="text" className="form-control" id="title" autoComplete="off" required
                                   name="Title" value={this.state.data.Title} onChange={(value) => this.onChange(value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Image</label>
                            <input type="text" className="form-control" id="image" aria-describedby="emailHelp" required
                                   name="Image" value={this.state.data.Image} onChange={(value) => this.onChange(value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Url</label>
                            <input type="text" className="form-control" id="url" aria-describedby="emailHelp" required
                                   name="URL" value={this.state.data.URL} onChange={(value) => this.onChange(value)}/>
                        </div>

                        <div>
                            <br/>Motion Graphics<input type="checkbox" name="vehicle1" id="Motion Graphics" value="Motion Graphics"/>
                            <br/>Compositing<input type="checkbox" name="vehicle2" id="Compositing" value="Compositing"/>
                            <br/>VFX<input type="checkbox" name="vehicle3" id="VFX" value="VFX"/>
                            <br/>Designer<input type="checkbox" name="vehicle4" id="Designer" value="Designer"/>
                            <br/>Director<input type="checkbox" name="vehicle5" id="Director" value="Director"/>
                            <br/>Editor<input type="checkbox" name="vehicle6" id="Editor" value="Editor"/>
                            <br/>Filmer<input type="checkbox" name="vehicle7" id="Filmer" value="Filmer"/>
                            <br/>Illustrator<input type="checkbox" name="vehicle8" id="Illustrator" value="Illustrator"/>
                        </div>

                        <button type="submit" className="btn btn-primary">Update</button>
                    </form>
                </div>
            </div>
        )
    }
}
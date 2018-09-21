import React from 'react';
const firebase = require("firebase");

export class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {Roles: []},
            postID: props.match.params.postID
        };
    }

    componentWillMount() {
        this.loadFeed();
    }

    async loadFeed() {
        let self = this;
        firebase.firestore().collection("projects").doc(this.state.postID).get().then(snapshot => {
            if (snapshot.exists) {
                self.setState({data: snapshot.data()});
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).then(() => {
            const data = [];
            firebase.firestore().collection("projects").orderBy('Date', 'desc').get().then(snapshot => {
                snapshot.forEach(doc => {data.push(doc.id);});
                let length = data.length - 1;
                let index = data.indexOf(this.state.postID);
                document.getElementById("nextArrow").href = data[index < length ? index + 1 : 0];
                document.getElementById("backArrow").href = data[index > 0 ? index - 1 : length];
            }).catch(err => {
                    console.log('Error getting documents', err);
                });
        }).catch(err => {
            console.log('Error getting documents', err);
        });
    }

    async handleDelete() {
        const self = this;
        firebase.firestore().collection("projects").doc(this.state.postID).delete().then(function() {
            self.props.history.push('/');
        }).catch(function(error) {
            window.alert("Error removing document: " + error);
        });
    }

    createClips = (item) => (
        <div>
            {item && item.map((clip, index) =>
            <div key={this.state.postID + "clip" + index} className="clip" style={{height: (this.state.data.Ratio*304) + "px"}}>
                <iframe src={clip+"?background=1"} frameBorder="0"/>
            </div>
            )}
        </div>
    );

    render() {
        return (
            <div className="projectPage">
                {this.state.data.Title &&
                <div>
                    <iframe src={this.state.data.Video} frameBorder="0" allowFullScreen id="projectVideo"
                            className="showReelVideo"/>
                    <div className="projectInformation">
                        <h1>{this.state.data.Title}</h1>
                        {sessionStorage.getItem("loggedIn") &&
                        <div className="tools">
                            <button><a href={`/edit/${this.state.postID}`}>Edit</a></button>
                            <button
                                onClick={() => window.confirm("Are you absolutely positive you want to delete this?\nIt will be gone forever.") && this.handleDelete()}>Delete
                            </button>
                        </div>
                        }
                        <p className="roles">Roles: {this.state.data.Roles.map((role) => {
                            return role
                        }).join(", ")}</p>

                        <div className="information">
                                {this.state.data.Description && <p>{this.state.data.Description}</p>}
                                {this.state.data.Client && <p>Client: {this.state.data.ClientURL ?
                                    <a href={this.state.data.ClientURL}>{this.state.data.Client}</a> : this.state.data.Client}</p>}
                                {this.state.data.FullProject &&
                                <p>View the full project <a href={this.state.data.FullProject}>here</a></p>}
                                    <p style={{margin: "0 auto"}}>Programs Used:</p>
                                    <p style={{margin: "0 auto"}}>{this.state.data.Tools.map((tool) => {
                                        return <li className={tool} key={tool}/>
                                    })}</p>
                        </div>

                        <div className="clips">
                            {this.createClips(this.state.data.Clips)}
                        </div>
                    </div>
                </div>
                }
                <a href={"/edit/" + this.state.postID} className="linkButton">Edit</a>
                <button href={"/edit/" + this.state.postID} className="linkButton"
                        onClick={() => this.handleDelete()}>Delete</button>
                <div className="projectNavigation">
                    <a id="backArrow">&larr;</a>
                    <a href="/">HOME</a>
                    <a id="nextArrow">&rarr;</a>
                </div>
            </div>
        )
    }
}
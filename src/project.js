import React from 'react';
const firebase = require("firebase");

const Roles = [
    "Compositing",
    "Designer",
    "Director"
]

export class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {Title: "", Roles: []},
            postID: props.match.params.postID
        };
    }

    componentWillMount() {
        this.loadFeed();
    }

    async loadFeed() {
        let self = this;
        // firebase.firestore().collection("posts").doc(this.state.postID).get().then(snapshot => {
        //     self.setState({data: snapshot.data()});
        //     // this.state.data.Roles.map((e) => document.getElementById(e).checked = true);
        // })
        //     .catch(err => {
        //         console.log('Error getting documents', err);
        //     });
    }

    async handleDelete() {
        firebase.database().ref('Posts/' + this.state.postID).remove();
        this.props.history.push('/feed/' + this.state.postID);
    }

    render() {
        return (
            <div className="projectPage">
                <iframe src="https://player.vimeo.com/video/280292382?title=0&loop=1&byline=0&portrait=0"
                        frameBorder="0" allowFullScreen className="showReelVideo" />
                {/*<h1>{this.state.data.Title}</h1>*/}
                {/*<p>{this.state.data.Roles.map((role) => {return role})}</p>*/}
                <h1>Head Noise Animation</h1>
                <p className="roles"><b>Roles: </b>{Roles.map((role) => {return role}).join(", ")}</p>
                <div className="information">
                    <div className="left">
                        {/*<p style={{textAlign: "center"}}>Description</p>*/}
                        <p>Description of the project</p>
                        <p>Specifics to what you did</p>
                    </div>
                    <div className="right">
                        {/*<p style={{textAlign: "center"}}>Clients - Credit</p>*/}
                        <p>Clients - Credit</p>
                    </div>
                </div>
                {sessionStorage.getItem("loggedIn") &&
                <div className="tools">
                    <button><a href={`/feed/edit/${this.state.postID}`}>Edit</a></button>
                    <button onClick={() => window.confirm("Are you absolutely positive you want to delete this?\nIt will be gone forever.") && this.handleDelete()}>Delete</button>
                </div>
                }
                {/*<div style={{float: "left", paddingLeft: "5vw"}}>&lt; Back</div>*/}
            </div>
        )
    }
}
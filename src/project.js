import React from 'react';
const firebase = require("firebase");

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
        firebase.firestore().collection("projects").doc(this.state.postID).get().then(snapshot => {
            self.setState({data: snapshot.data()});
            console.log(snapshot.data().Roles);
            // this.state.data.Roles.map((e) => document.getElementById(e).checked = true);
        }).then(() => {
            // document.getElementById("projectVideo").src = self.state.data.Video;
        })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }

    async handleDelete() {
        firebase.database().ref('Posts/' + this.state.postID).remove();
        this.props.history.push('/feed/' + this.state.postID);
    }

    createImages = (item) => (
        <div>
            {item && item.map((image) =>
            <div key={image} className="container">
                <img src={image} alt="" className="image"/>
            </div>
            )}
        </div>
    );

    render() {
        return (
            <div className="projectPage">
                {/*{this.state.data.Video}*/}
                <iframe src={this.state.data.Video} frameBorder="0" allowFullScreen id="projectVideo" className="showReelVideo"/>
                {/*<iframe src="" frameBorder="0" allowFullScreen id="projectVideo" className="showReelVideo"/>*/}
                {/*<h1>{this.state.data.Title}</h1>*/}
                {/*<p>{this.state.data.Roles.map((role) => {return role})}</p>*/}
                <h1>{this.state.data.Title}</h1>
                <p className="roles"><b>Roles: </b>{this.state.data.Roles.map((role) => {return role}).join(", ")}</p>
                <div className="information">
                    <div className="left">
                        {/*<p style={{textAlign: "center"}}>Description</p>*/}
                        <p>{this.state.data.Description}</p>
                        {/*<p>Description of the project: Noa Deane's "Head Noise" is a cinematic surf movie from filmmaker Mikey Mallalieu.</p>*/}
                        {/*<p>Specifics to what you did: motion graphics</p>*/}
                    </div>
                    <div className="right">
                        {/*<p style={{textAlign: "center"}}>Clients - Credit</p>*/}
                        <p>Client: {this.state.data.ClientURL ? <a href={this.state.data.ClientURL}>{this.state.data.Client}</a> : this.state.data.Client}</p>
                        {/*<p>Client: <a href="https://www.volcom.com/truetothis/noa-deane/">Noah Dean</a></p>*/}
                        <p>Tools: {this.state.data.Tools}</p>
                    </div>
                </div>

                {this.createImages(this.state.data.Images)}

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
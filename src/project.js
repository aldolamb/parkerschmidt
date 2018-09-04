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
        }).catch(err => {
            console.log('Error getting documents', err);
        });
    }

    async handleDelete() {
        firebase.firestore().collection("projects").doc(this.state.postID).delete().then(function() {
            this.props.history.push('/');
        }).catch(function(error) {
            window.alert("Error removing document: " + error);
        });
    }

    createImages = (item) => (
        <div>
            {item && item.map((image) =>
            <div key={image} className="container">
                <iframe src={image} frameBorder="0"/>
                <img src={image} alt="" className="image"/>
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
                    <h1>{this.state.data.Title}</h1>
                    {sessionStorage.getItem("loggedIn") &&
                    <div className="tools">
                        <button><a href={`/edit/${this.state.postID}`}>Edit</a></button>
                        <button
                            onClick={() => window.confirm("Are you absolutely positive you want to delete this?\nIt will be gone forever.") && this.handleDelete()}>Delete
                        </button>
                    </div>
                    }
                    <p className="roles">{this.state.data.Roles.map((role) => {
                        return role
                    }).join(", ")}</p>
                    {/*<p className="roles"><b>Roles: </b>{this.state.data.Roles.map((role) => {*/}
                        {/*return role*/}
                    {/*}).join(", ")}</p>*/}
                    <p className="tools">{this.state.data.Tools.map((tool) => {
                        return <li className={tool} id={tool}/>
                    })}</p>
                    {/*<p style={{margin: 0}}>{this.state.data.Tools}</p>*/}
                    <div className="information">
                        <div className="left">
                            <p>{this.state.data.Description}</p>
                        </div>
                        <div className="right">
                            <p>Client: {this.state.data.ClientURL ?
                                <a href={this.state.data.ClientURL}>{this.state.data.Client}</a> : this.state.data.Client}</p>
                        </div>
                    </div>

                    {this.createImages(this.state.data.Images)}
                </div>
                }
            </div>
        )
    }
}
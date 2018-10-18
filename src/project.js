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
                let tmp = snapshot.data();
                if (tmp.Clips.length > 0)
                    tmp.Clips.unshift(tmp.Video);
                self.setState({data: tmp});
                document.getElementById("projectVideo").src = snapshot.data().Video;
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
                <div key={this.state.postID + "clip" + index} className="clip"
                     style={{height: (this.state.data.Ratio * 304) + "px"}}>
                    <button onClick={() => {
                        document.getElementById("projectVideo").src = clip;
                        window.scrollTo(0, 0)
                    }}/>
                    <iframe src={clip + "?background=1"} frameBorder="0"/>
                </div>
            )}
        </div>
    );

// {clip === this.state.data.Video ?
// <button style={{opacity: "0.5"}} onClick={() => {document.getElementById("projectVideo").src = clip; window.scrollTo(0, 0)}}/> :
// <button onClick={() => {document.getElementById("projectVideo").src = clip; window.scrollTo(0, 0)}}/>}

// <div key={this.state.postID + "clip"} className="clip" style={{height: (this.state.data.Ratio*304) + "px"}}>
// <button onClick={() => {document.getElementById("projectVideo").src = clip; window.scrollTo(0, 0)}}/>
// <iframe src={clip+"?background=1"} frameBorder="0"/>
// </div>
// <div key={this.state.postID + "clip" + index} className="clip" style={{height: (this.state.data.Ratio*304) + "px"}}>
// <iframe src={clip+"?background=1"} frameBorder="0"/>
// </div>

    render() {
        return (
            <div className="projectPage">
                {this.state.data.Title &&
                <div>
                    <iframe frameBorder="0" allowFullScreen id="projectVideo"
                            className="showReelVideo"/>
                    <div className="projectInformation">
                        <div style={{padding: "0 1em"}}>
                            <h1>{this.state.data.Title}</h1>
                            <p className="roles">Roles: {this.state.data.Roles.map((role) => {
                                return role
                            }).join(", ")}</p>
                        </div>

                        <div className="information">
                            <div>
                            {/*{this.state.data.Description && <p>{this.state.data.Description}</p>}*/}
                            {this.state.data.Description && <p dangerouslySetInnerHTML={{ __html: this.state.data.Description}}></p>}
                                {this.state.data.Client && <p>Client: {this.state.data.ClientURL ?
                                    <a href={this.state.data.ClientURL}>{this.state.data.Client}</a> : this.state.data.Client}</p>}
                                {this.state.data.FullProject &&
                                <p>View the full project <a href={this.state.data.FullProject}>here</a></p>}
                                    <p style={{margin: "0 auto"}}>Programs Used:</p>
                                    <p style={{margin: "0 auto"}}>{this.state.data.Tools.map((tool) => {
                                        return <li className={tool} key={tool}/>
                                    })}</p>
                            </div>
                        </div>

                        {this.state.data.Clips.length > 0 && <p style={{textAlign: "center", letterSpacing: "normal", margin: "5vh"}}>More From This Project</p>}

                        <div className="clips">
                            {/*{this.state.data.Clips.length > 0 &&*/}
                            {/*<div key={this.state.postID + "clip"} className="clip"*/}
                                 {/*style={{height: (this.state.data.Ratio * 304) + "px"}}>*/}
                                {/*<iframe src={this.state.data.Video + "?background=1"} frameBorder="0"/>*/}
                            {/*</div>*/}
                            {/*}*/}
                            {this.createClips(this.state.data.Clips)}
                            {/*{this.state.data.Clips && this.state.data.Clips.unshift(this.state.data.Video).map(this.createClips)}*/}
                        </div>
                    </div>
                </div>
                }
                {sessionStorage.getItem("loggedIn") &&
                    <div>
                        <a href={"/edit/" + this.state.postID} className="linkButton">Edit</a>
                        <button href={"/edit/" + this.state.postID} className="linkButton"
                                onClick={() => this.handleDelete()}>Delete
                        </button>
                    </div>
                }
                <div className="projectNavigation">
                    <a id="backArrow">&larr;</a>
                    <a href="/">HOME</a>
                    <a id="nextArrow">&rarr;</a>
                </div>
            </div>
        )
    }
}
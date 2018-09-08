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
        firebase.firestore().collection("projects").doc(this.state.postID).get().then(snapshot => {
            self.setState({data: snapshot.data()});
            this.state.data.Roles.map((e) => document.getElementById(e).checked = true);
            this.state.data.Clips.map((e) =>
            {
                let p = document.getElementById("uploadClips");
                let newElement = document.createElement("input");
                newElement.setAttribute('id', "clip"+(p.childElementCount+1));
                newElement.setAttribute('name', "clip");
                newElement.setAttribute('type', "text");
                newElement.setAttribute('value', e);
                p.appendChild(newElement);
            });
        })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }

    async handleSubmit(e) {
        e.preventDefault();

        let video = document.getElementById('uploadVideo').value;
        if(video.indexOf('src=') !== -1) {
            video = video.substring(video.indexOf('src='));
            video = video.substring(5, video.indexOf(' ')-1);
        }
        const image = document.getElementById('editCoverImage').value;
        const title = document.getElementById('uploadTitle').value;
        const client = document.getElementById('uploadClient').value;
        const clientURL = document.getElementById('uploadClientURL').value;
        const description = document.getElementById('uploadDescription').value;
        const checkedRoles = document.querySelectorAll("input[name^='uploadRoles']:checked");
        const checkedTools = document.querySelectorAll("input[name^='uploadTools']:checked");
        const clips = document.querySelectorAll("input[name^='clip']");

        let Roles = [];
        for (let item of checkedRoles) {
            Roles.push(item.value);
        }

        let Tools = [];
        for (let item of checkedTools) {
            Tools.push(item.value);
        }

        let Clips = [];
        for (let item of clips) {
            Clips.push(item.value);
        }

        const self = this;

        firebase.firestore().collection("projects").doc(self.state.postID).set({
            Date: self.state.data.Date,
            CoverImage: image,
            Title: title,
            Video: video,
            Client: client,
            ClientURL: clientURL,
            Description: description,
            Ratio: 0.5625,
            Roles,
            Tools,
            Clips,
        }).then(() => {
            self.props.history.push(`/${self.state.postID}`)
        });
    }

    onChange(e) {
        let dataCopy = JSON.parse(JSON.stringify(this.state.data));
        dataCopy[e.target.name] = e.target.value;
        this.setState({data: dataCopy});
    }

    addClip = () => {
        // Adds an element to the document
        let p = document.getElementById("uploadClips");
        let newElement = document.createElement("input");
        newElement.setAttribute('id', "clip"+(p.childElementCount+1));
        newElement.setAttribute('name', 'clip');
        newElement.setAttribute('type', "text");
        p.appendChild(newElement);
    };

    removeClip = () => {
        // Removes an element from the document
        let el = document.getElementById("uploadClips");
        if (el.childElementCount)
            el.removeChild(el.children[el.childElementCount-1]);
        else
            console.log("it works");
    };


    render() {
        return (
            <div className="upload">
                <form onSubmit={this.handleSubmit.bind(this)} method="POST">
                    <div>
                        <label htmlFor="uploadVideo" onClick={() =>
                            window.alert("This is the video of the project for the project page. For Vimeo, have 'fixed size' selected." +
                                "You can also choose loop, autoplay, or a color too but have everything else deselected. For Youtube, select any of the options.")}>Video</label>
                        <input type="text" id="uploadVideo" required
                               name="Video" value={this.state.data.Video} onChange={(value) => this.onChange(value)}/>
                    </div>

                    <div>
                        <label htmlFor="uploadImage" onClick={() =>
                            window.alert("This is the image shown on the feed. Make the width of the image 500px, " +
                                "it will be loaded into an area 500px wide so any larger will just be a waste of storage and transfer space. " +
                                "Try and compress the image as well if possible to reduce file size, only enough where image quality isn't sacrificed.")}>Image</label>
                        <input type="text" id="editCoverImage" autoComplete="off" required
                               name="CoverImage" value={this.state.data.CoverImage} onChange={(value) => this.onChange(value)}/>
                    </div>

                    <div>
                        <label htmlFor="uploadTitle" onClick={() =>
                            window.alert("This is the title of the project. It has to be unique from all other projects")}>
                            Title
                        </label>
                        <input type="text" id="uploadTitle" autoComplete="off" required
                               name="Title" value={this.state.data.Title} onChange={(value) => this.onChange(value)}/>
                    </div>

                    <div>
                        Roles
                        <br/>Animation<input type="checkbox" name="uploadRoles" id="Animation" value="Animation"/>
                        <br/>VFX<input type="checkbox" name="uploadRoles" id="VFX" value="VFX"/>
                        <br/>Design<input type="checkbox" name="uploadRoles" id="Design" value="Design"/>
                        <br/>Film<input type="checkbox" name="uploadRoles" id="Film" value="Film"/>
                        <br/>Sound<input type="checkbox" name="uploadRoles" id="Sound" value="Sound"/>
                    </div>

                    <div>
                        Tools
                        <br/>Adobe After Effects<input type="checkbox" name="uploadTools" id="adobeAfterEffects" value="adobeAfterEffects"/>
                        <br/>Adobe Illustrator<input type="checkbox" name="uploadTools" id="adobeIllustrator" value="adobeIllustrator"/>
                        <br/>Adobe Photoshop<input type="checkbox" name="uploadTools" id="adobePhotoshop" value="adobePhotoshop"/>
                        <br/>Adobe Premiere<input type="checkbox" name="uploadTools" id="adobePremiere" value="adobePremiere"/>
                        <br/>Analog<input type="checkbox" name="uploadTools" id="analog" value="analog"/>
                        <br/>Cinema 4D<input type="checkbox" name="uploadTools" id="cinema4D" value="cinema4D"/>
                        <br/>Reason<input type="checkbox" name="uploadTools" id="reason" value="reason"/>
                    </div>

                    <div>
                        <div>
                            <label htmlFor="uploadClient" onClick={() =>
                                window.alert("Name of the client")}>Client</label>
                            <input type="text" className="form-control" id="uploadClient" required
                                   name="Client" value={this.state.data.Client} onChange={(value) => this.onChange(value)}/>
                        </div>
                        <div>
                            <label htmlFor="uploadClientURL" onClick={() =>
                                window.alert("URL if you want to link to the clients site. This is optional")}>Client URL</label>
                            <input type="text" id="uploadClientURL"
                                   name="ClientURL" value={this.state.data.ClientURL} onChange={(value) => this.onChange(value)}/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="uploadDescription" onClick={() =>
                            window.alert("A description of the project and further details about what your role(s) on it were. Can be anything though")}>Description</label>
                        <textarea id="uploadDescription" required
                                  name="Description" value={this.state.data.Description} onChange={(value) => this.onChange(value)}/>
                    </div>

                    <div>
                        Clips
                        <div id="uploadClips" className="uploadImages">
                            {/*<input type="text" id="image1" name="Tools"/>*/}
                        </div>
                        <button type="button" onClick={() => this.addClip()}>+</button>
                        <button type="button" onClick={() => this.removeClip()}>-</button>
                    </div>

                    <button type="submit" className="btn btn-primary">Upload</button>
                </form>
            </div>
        )
    }
}
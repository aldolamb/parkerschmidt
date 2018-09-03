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
            this.state.data.Images.map((e) =>
            {
                let p = document.getElementById("uploadImages");
                let newElement = document.createElement("input");
                newElement.setAttribute('id', "image"+(p.childElementCount+1));
                newElement.setAttribute('name', "image");
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
        let video = document.getElementById('uploadVideo').value;
        if(video.indexOf('src=') !== -1) {
            video = video.substring(video.indexOf('src='));
            video = video.substring(5, video.indexOf(' ')-1);
        }
        const client = document.getElementById('uploadClient').value;
        const clientURL = document.getElementById('uploadClientURL').value;
        const tools = document.getElementById('uploadTools').value;
        const description = document.getElementById('uploadDescription').value;
        const checkBoxes = document.querySelectorAll("input[name^='upload']:checked");
        const images = document.querySelectorAll("input[name='image']");

        let Roles = [];
        for (let item of checkBoxes) {
            Roles.push(item.value);
        }

        let Images = [];
        for (let item of images) {
            Images.push(item.value);
        }

        console.log(Images);

        const self = this;
        e.preventDefault();

        firebase.firestore().collection("projects").doc(self.state.postID).set({
            Date: self.state.data.Date,
            CoverImage: self.state.data.CoverImage,
            Title: self.state.data.Title,
            Video: video,
            Client: client,
            ClientURL: clientURL,
            Tools: tools,
            Description: description,
            Roles,
            Images,
        }).then(() => {
            self.props.history.push(`/${self.state.postID}`)
        });
    }

    onChange(e) {
        let dataCopy = JSON.parse(JSON.stringify(this.state.data));
        dataCopy[e.target.name] = e.target.value;
        this.setState({data: dataCopy});
    }

    addImage = () => {
        // Adds an element to the document
        let p = document.getElementById("uploadImages");
        let newElement = document.createElement("input");
        newElement.setAttribute('id', "image"+(p.childElementCount+1));
        newElement.setAttribute('name', "image");
        newElement.setAttribute('type', "text");
        p.appendChild(newElement);
    };

    removeImage = () => {
        // Removes an element from the document
        let el = document.getElementById("uploadImages");
        if (el.childElementCount)
            el.removeChild(el.children[el.childElementCount-1]);
        else
            console.log("it works");
    };

    render() {
        return (
            <div className="upload">
                {/*<form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">*/}
                    {/*<div className="form-group">*/}
                        {/*<label htmlFor="title">Title</label>*/}
                        {/*<input type="text" className="form-control" id="title" autoComplete="off" required*/}
                               {/*name="Title" value={this.state.data.Title} onChange={(value) => this.onChange(value)}/>*/}
                    {/*</div>*/}
                    {/*<div className="form-group">*/}
                        {/*<label htmlFor="email">Image</label>*/}
                        {/*<input type="text" className="form-control" id="image" aria-describedby="emailHelp" required*/}
                               {/*name="Image" value={this.state.data.Image} onChange={(value) => this.onChange(value)}/>*/}
                    {/*</div>*/}
                    {/*<div className="form-group">*/}
                        {/*<label htmlFor="email">Url</label>*/}
                        {/*<input type="text" className="form-control" id="url" aria-describedby="emailHelp" required*/}
                               {/*name="URL" value={this.state.data.URL} onChange={(value) => this.onChange(value)}/>*/}
                    {/*</div>*/}

                    {/*<div>*/}
                        {/*<br/>Motion Graphics<input type="checkbox" name="vehicle1" id="Motion Graphics" value="Motion Graphics"/>*/}
                        {/*<br/>Compositing<input type="checkbox" name="vehicle2" id="Compositing" value="Compositing"/>*/}
                        {/*<br/>VFX<input type="checkbox" name="vehicle3" id="VFX" value="VFX"/>*/}
                        {/*<br/>Designer<input type="checkbox" name="vehicle4" id="Designer" value="Designer"/>*/}
                        {/*<br/>Director<input type="checkbox" name="vehicle5" id="Director" value="Director"/>*/}
                        {/*<br/>Editor<input type="checkbox" name="vehicle6" id="Editor" value="Editor"/>*/}
                        {/*<br/>Filmer<input type="checkbox" name="vehicle7" id="Filmer" value="Filmer"/>*/}
                        {/*<br/>Illustrator<input type="checkbox" name="vehicle8" id="Illustrator" value="Illustrator"/>*/}
                    {/*</div>*/}

                    {/*<button type="submit" className="btn btn-primary">Update</button>*/}
                {/*</form>*/}
                <form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">
                    {/*<img id="uploadImagePreview" src="" alt="No Image"/>*/}
                    <div className="form-group">
                        <label htmlFor="uploadImage" onClick={() =>
                            window.alert("This is the image shown on the feed. Make the width of the image 500px, " +
                                "it will be loaded into an area 500px wide so any larger will just be a waste of storage and transfer space. " +
                                "Try and compress the image as well if possible to reduce file size, only enough where image quality isn't sacrificed.")}>Image</label>
                        {/*<div className="toolBar">*/}
                        {/*<label><input onChange={this.fileSelectedHandler} type="file" className="form-control" id="file"/></label>*/}
                        {/*<button type="button" onClick= {this.fileUploadHandler}>Add Image</button>*/}
                        {/*</div>*/}
                        <input type="text" className="form-control" id="editCoverImage" autoComplete="off" required
                               name="CoverImage" value={this.state.data.CoverImage} onChange={(value) => this.onChange(value)}/>
                    </div>

                    <div>
                        Roles
                        <br/>Motion Graphics<input type="checkbox" name="upload1" id="Motion Graphics" value="Motion Graphics"/>
                        <br/>Compositing<input type="checkbox" name="upload2" id="Compositing" value="Compositing"/>
                        <br/>VFX<input type="checkbox" name="upload3" id="VFX" value="VFX"/>
                        <br/>Designer<input type="checkbox" name="upload4" id="Designer" value="Designer"/>
                        <br/>Director<input type="checkbox" name="upload5" id="Director" value="Director"/>
                        <br/>Editor<input type="checkbox" name="upload6" id="Editor" value="Editor"/>
                        <br/>Filmer<input type="checkbox" name="upload7" id="Filmer" value="Filmer"/>
                        <br/>Illustrator<input type="checkbox" name="upload8" id="Illustrator" value="Illustrator"/>
                    </div>

                    <div className="projectUpload">
                        <div style={{paddingTop: "2em"}}>
                            <label htmlFor="uploadVideo" onClick={() =>
                                window.alert("This is the video of the project for the project page. For Vimeo, have 'fixed size' selected." +
                                    "You can also choose loop, autoplay, or a color too but have everything else deselected. For Youtube, select any of the options.")}>Video</label>
                            <input type="text" className="form-control" id="uploadVideo" required
                                   name="Video" value={this.state.data.Video} onChange={(value) => this.onChange(value)}/>
                        </div>
                        <div>
                            <label htmlFor="uploadDescription" onClick={() =>
                                window.alert("A description of the project and further details about what your role(s) on it were. Can be anything though")}>Description</label>
                            <textarea className="form-control" id="uploadDescription" required
                                      name="Description" value={this.state.data.Description} onChange={(value) => this.onChange(value)}/>
                        </div>

                        <div style={{paddingTop: "2em"}}>
                            <label htmlFor="uploadClient" onClick={() =>
                                window.alert("Name of the client")}>Client</label>
                            <input type="text" className="form-control" id="uploadClient" required
                                   name="Client" value={this.state.data.Client} onChange={(value) => this.onChange(value)}/>
                        </div>
                        <div>
                            <label htmlFor="uploadClientURL" onClick={() =>
                                window.alert("URL if you want to link to the clients site. This is optional")}>Client URL</label>
                            <input type="text" className="form-control" id="uploadClientURL"
                                   name="ClientURL" value={this.state.data.ClientURL} onChange={(value) => this.onChange(value)}/>
                        </div>

                        <div style={{paddingTop: "2em"}}>
                            <label htmlFor="uploadTools" onClick={() =>
                                window.alert("List of the tools you used: Photoshop, After Effects, etc.... I suggest making it a comma separated list for consistency")}>Tools</label>
                            <input type="text" className="form-control" id="uploadTools" required
                                   name="Tools" value={this.state.data.Tools} onChange={(value) => this.onChange(value)}/>
                        </div>

                        <div>
                            Images
                            <div id="uploadImages" className="uploadImages">
                                {/*<input type="text" id="image1" name="Tools"/>*/}
                            </div>
                            <button type="button" onClick={() => this.addImage()}>+</button>
                            <button type="button" onClick={() => this.removeImage()}>-</button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">Upload</button>
                </form>
            </div>
        )
    }
}
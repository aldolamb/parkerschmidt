import React from 'react';
const firebase = require("firebase");

export class Upload extends React.Component {
    async handleSubmit(e) {
        const date = Date.now();
        const image = document.getElementById('uploadCoverImage').value.replace("google.com/open", "google.com/uc");
        const title = document.getElementById('uploadTitle').value;
        const url = document.getElementById('uploadTitle').value.toLowerCase().replace(/[^\w\s]/gi, '').trim().split(" ").join("-");
        let video = document.getElementById('uploadVideo').value;
        video = video.substring(video.indexOf('src='));
        video = video.substring(5, video.indexOf(' '));
        const client = document.getElementById('uploadClient').value;
        const clientURL = document.getElementById('uploadClientURL').value;
        const tools = document.getElementById('uploadTools').value;
        const description = document.getElementById('uploadDescription').value;
        const checkBoxes = document.querySelectorAll("input[name^='upload']:checked");
        const images = document.querySelectorAll("input[name^='image']");

        let Roles = [];
        for (let item of checkBoxes) {
            Roles.push(item.value);
        }

        let Images = [];
        for (let item of images) {
            Images.push(item.value);
        }

        const self = this;
        e.preventDefault();

        firebase.firestore().collection("projects").doc(url).set({
            Date: date,
            CoverImage: image,
            Title: title,
            Video: video,
            Client: client,
            ClientURL: clientURL,
            Tools: tools,
            Description: description,
            Roles,
            Images,
        }).then(() => {
            self.props.history.push(`/${url}`)
        });
    }

    // fileSelectedHandler = event => {
    //     let self = this;
    //     this.setState({
    //         selectedFile: event.target.files[0]
    //     }, () => {
    //         self.fileUploadHandler();
    //     });
    // };
    //
    // fileUploadHandler = () => {
    //     let file = this.state.selectedFile;
    //     let filename = file.name;
    //     let imageStorage = firebase.storage().ref(filename);
    //     let uploadTask = imageStorage.put(file);
    //
    //     let oldImage = document.getElementById("uploadCoverImage").value;
    //     if (oldImage) {
    //         // Create a reference to the file to delete
    //         let imageRef = firebase.storage().refFromURL(oldImage);
    //
    //         // Delete the file
    //         imageRef.delete().then(function () {
    //
    //         }).catch(function (error) {
    //
    //         });
    //     }
    //
    //     let self = this;
    //     uploadTask.on('state_changed', function(snapshot) {
    //         let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         console.log('Upload is ' + progress + '% done');
    //         switch (snapshot.state) {
    //             case firebase.storage.TaskState.PAUSED: // or 'paused'
    //                 console.log('Upload is paused');
    //                 break;
    //             case firebase.storage.TaskState.RUNNING: // or 'running'
    //                 console.log('Upload is running');
    //                 break;
    //         }
    //     }, function (error) {
    //         window.alert("Unauthorized or file is larger than 50kb");
    //     }, function () {
    //         uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    //             console.log('File available at', downloadURL);
    //             self.state.data.CoverImage = downloadURL;
    //             // document.getElementById('uploadCoverImage').value = downloadURL;
    //             document.getElementById('uploadCoverImagePreview').src = downloadURL;
    //         });
    //     });
    // };

    addImage = () => {
        // Adds an element to the document
        let p = document.getElementById("uploadImages");
        let newElement = document.createElement("input");
        newElement.setAttribute('id', "image"+(p.childElementCount+1));
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

    titleToURL = (e) => {
        document.getElementById("uploadURL").value =
            window.location.host +
            "/" +
            e.target.value.toLowerCase().replace(/[^\w\s]/gi, '').trim().split(" ").join("-");
    };

    render() {
        return (
            <div className="upload">
                <form onSubmit={this.handleSubmit.bind(this)} method="POST">
                    {/*<img id="uploadCoverImagePreview" src="" alt="No Image" className="image"/>*/}
                    <div>
                        <label htmlFor="uploadCoverImage" onClick={() =>
                            window.alert("This is the image shown on the feed. Make the width of the image 500px, " +
                                "it will be loaded into an area 500px wide so any larger will just be a waste of storage and transfer space. " +
                                "Try and compress the image as well if possible to reduce file size, only enough where image quality isn't sacrificed.")}>
                            Cover Image
                        </label>
                            {/*<input onChange={this.fileSelectedHandler} type="file" className="form-control" id="file"/>*/}
                        <input type="text" id="uploadCoverImage" autoComplete="off" name="CoverImage" required/>
                    </div>

                    <div style={{paddingTop: "2em"}}>
                        <label htmlFor="uploadTitle" onClick={() =>
                            window.alert("This is the title of the project. It has to be unique from all other projects")}>
                            Title
                        </label>
                        <input type="text" id="uploadTitle" autoComplete="off" required
                               name="Title" onChange={(e) => this.titleToURL(e)}/>
                    </div>
                    <div>
                        <label htmlFor="uploadURL" onClick={() =>
                            window.alert("This is how the URL will look. It's lowercase and spaces are replaced by '-'")}>
                            URL
                        </label>
                        <input type="text" id="uploadURL" autoComplete="off" required name="Title" value="" readOnly />
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
                                    "You can also choose loop, autoplay, or a color too but have everything else deselected. For Youtube, select any of the options.")}>
                                Video
                            </label>
                            <input type="text" id="uploadVideo" name="Video" required/>
                        </div>
                        <div>
                            <label htmlFor="uploadDescription" onClick={() =>
                                window.alert("A description of the project and further details about what your role(s) on it were. Can be anything though")}>
                                Description
                            </label>
                            <textarea id="uploadDescription" name="Description" required/>
                        </div>

                        <div style={{paddingTop: "2em"}}>
                            <label htmlFor="uploadClient" onClick={() =>
                                window.alert("Name of the client")}>
                                Client
                            </label>
                            <input type="text" id="uploadClient" name="Client" required/>
                        </div>
                        <div>
                            <label htmlFor="uploadClientURL" onClick={() =>
                                window.alert("URL if you want to link to the clients site. This is optional")}>
                                Client URL
                            </label>
                            <input type="text" className="form-control" id="uploadClientURL" name="ClientURL"/>
                        </div>

                        <div style={{paddingTop: "2em"}}>
                            <label htmlFor="uploadTools" onClick={() =>
                                window.alert("List of the tools you used: Photoshop, After Effects, etc.... I suggest making it a comma separated list for consistency")}>
                                Tools
                            </label>
                            <input type="text" className="form-control" id="uploadTools" name="Tools" required/>
                        </div>

                        <div>
                            Images
                            <div id="uploadImages" className="uploadImages">
                                <input type="text" id="image1" name="Tools"/>
                            </div>
                            <button type="button" onClick={() => this.addImage()}>+</button>
                            <button type="button" onClick={() => this.removeImage()}>-</button>
                        </div>
                    </div>

                    <button type="submit">Upload</button>
                </form>
            </div>
        )
    }
}
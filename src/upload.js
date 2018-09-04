import React from 'react';
const firebase = require("firebase");

export class Upload extends React.Component {

    loadThumbnail(url) {
        // axios.post("http://vimeo.com/api/oembed.json?url=" + url)
        //     .then(results => {
        //         console.log(results);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });

        if (url) {
            const embedURL = "https://player.vimeo.com/video/" + url.substring(url.indexOf(".com/") + 5);

            let apiURL = "http://vimeo.com/api/oembed.json?url=" + embedURL;

            let thumbnail_url = '';

            fetch(apiURL)
                .then(response => response.json())
                .then(results => {
                    console.log(results);
                    thumbnail_url = results["thumbnail_url"];
                    // if (thumbnail_url.indexOf('_') !== -1)
                    // thumbnail_url = thumbnail_url.replace('_', '');
                    // thumbnail_url = thumbnail_url.replace(thumbnail_url.substring(thumbnail_url.indexOf('_')), '.jpg');
                    thumbnail_url = thumbnail_url.substring(0, thumbnail_url.indexOf('_'));

                    document.getElementById('uploadCoverImage').value = thumbnail_url;
                    document.getElementById('uploadVideo').value = embedURL;
                    document.getElementById('uploadTitle').value = results["title"];
                    document.getElementById('uploadDescription').value = results["description"];

                    // return thumbnail_url;
                })
                .catch(error => {
                    window.alert("Error in video url: " + error);
                });
        }
    }

    async handleSubmit(e) {
        const date = Date.now();
        const image = document.getElementById('uploadCoverImage').value.replace("google.com/open", "google.com/uc");
        const title = document.getElementById('uploadTitle').value;
        // const url = document.getElementById('uploadTitle').value.toLowerCase().replace(/[^\w\s]/gi, '').trim().split(" ").join("-");
        let video = document.getElementById('uploadVideo').value;
        // console.log(video.indexOf('src='));
        if (video.indexOf('src=') !== -1) {
            video = video.substring(video.indexOf('src='));
            video = video.substring(5, video.indexOf(' ') - 1);
        }
        // this.loadThumbnail(video);
        // console.log("Test: " + test);
        const client = document.getElementById('uploadClient').value;
        const clientURL = document.getElementById('uploadClientURL').value;
        const description = document.getElementById('uploadDescription').value;
        const checkedRoles = document.querySelectorAll("input[name^='uploadRoles']:checked");
        const checkedTools = document.querySelectorAll("input[name^='uploadTools']:checked");
        const images = document.querySelectorAll("input[name^='image']");

        let Roles = [];
        for (let item of checkedRoles) {
            Roles.push(item.value);
        }

        let Tools = [];
        for (let item of checkedTools) {
            Tools.push(item.value);
        }

        let Images = [];
        for (let item of images) {
            Images.push(item.value);
        }

        const self = this;
        e.preventDefault();

        firebase.firestore().collection("projects").doc().set({
            Date: date,
            CoverImage: image,
            Title: title,
            Video: video,
            Client: client,
            ClientURL: clientURL,
            Description: description,
            Roles,
            Tools,
            Images,
        }).then(() => {
            self.props.history.push(`/`)
        });
    }

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

    render() {
        return (
            <div className="upload">
                <form onSubmit={this.handleSubmit.bind(this)} method="POST">
                    <button type="button" onClick={() => this.loadThumbnail(prompt("Video URL"))}>Load From Vimeo</button>
                    <div>
                        <label htmlFor="uploadVideo" onClick={() =>
                            window.alert("This is the video of the project for the project page. For Vimeo, have 'fixed size' selected." +
                                "You can also choose loop, autoplay, or a color too but have everything else deselected. For Youtube, select any of the options.")}>
                            Video
                        </label>
                        <input type="text" id="uploadVideo" name="Video" required/>
                    </div>

                    <div>
                        <label htmlFor="uploadCoverImage" onClick={() =>
                            window.alert("This is the image shown on the feed. Make the width of the image 500px, " +
                                "it will be loaded into an area 500px wide so any larger will just be a waste of storage and transfer space. " +
                                "Try and compress the image as well if possible to reduce file size, only enough where image quality isn't sacrificed.")}>
                            Cover Image
                        </label>
                        <input type="text" id="uploadCoverImage" autoComplete="off" name="CoverImage" required/>
                    </div>

                    <div>
                        <label htmlFor="uploadTitle" onClick={() =>
                            window.alert("This is the title of the project. It has to be unique from all other projects")}>
                            Title
                        </label>
                        <input type="text" id="uploadTitle" autoComplete="off" required
                               name="Title"/>
                    </div>

                    <div>
                        Roles
                        <br/>Motion Graphics<input type="checkbox" name="uploadRoles" id="Motion Graphics" value="Motion Graphics"/>
                        <br/>Compositing<input type="checkbox" name="uploadRoles" id="Compositing" value="Compositing"/>
                        <br/>VFX<input type="checkbox" name="uploadRoles" id="VFX" value="VFX"/>
                        <br/>Designer<input type="checkbox" name="uploadRoles" id="Designer" value="Designer"/>
                        <br/>Director<input type="checkbox" name="uploadRoles" id="Director" value="Director"/>
                        <br/>Editor<input type="checkbox" name="uploadRoles" id="Editor" value="Editor"/>
                        <br/>Filmer<input type="checkbox" name="uploadRoles" id="Filmer" value="Filmer"/>
                        <br/>Illustrator<input type="checkbox" name="uploadRoles" id="Illustrator" value="Illustrator"/>
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
                        <label htmlFor="uploadClient" onClick={() =>
                            window.alert("Name of the client")}>
                            Client
                        </label>
                        <input type="text" id="uploadClient" name="Client" required/>

                        <label htmlFor="uploadClientURL" onClick={() =>
                            window.alert("URL if you want to link to the clients site. This is optional")}>
                            URL
                        </label>
                        <input type="text" className="form-control" id="uploadClientURL" name="ClientURL"/>
                    </div>

                    <div>
                        <label htmlFor="uploadDescription" onClick={() =>
                            window.alert("A description of the project and further details about what your role(s) on it were. Can be anything though")}>
                            Description
                        </label>
                        <textarea id="uploadDescription" name="Description"/>
                    </div>

                    <div>
                        Clips
                        <div id="uploadImages" className="uploadImages">
                            <input type="text" id="image1" name="Tools"/>
                        </div>
                        <button type="button" onClick={() => this.addImage()}>+</button>
                        <button type="button" onClick={() => this.removeImage()}>-</button>
                    </div>

                    <button type="submit">Upload</button>
                </form>
            </div>
        )
    }
}
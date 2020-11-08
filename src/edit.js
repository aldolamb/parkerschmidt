import React from "react";
import { firestore } from "./config/firebase.js";

export class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      postID: props.match.params.postID,
    };
  }

  componentWillMount() {
    this.loadFeed();
  }

  loadThumbnail(url) {
    if (url) {
      const embedURL =
        "https://player.vimeo.com/video/" +
        url.substring(url.indexOf(".com/") + 5);

      let apiURL = "https://vimeo.com/api/oembed.json?url=" + embedURL;

      let thumbnail_url = "";

      fetch(apiURL)
        .then((response) => response.json())
        .then((results) => {
          console.log(results);
          thumbnail_url = results["thumbnail_url"];
          // if (thumbnail_url.indexOf('_') !== -1)
          // thumbnail_url = thumbnail_url.replace('_', '');
          // thumbnail_url = thumbnail_url.replace(thumbnail_url.substring(thumbnail_url.indexOf('_')), '.jpg');
          thumbnail_url = thumbnail_url.substring(
            0,
            thumbnail_url.indexOf("_")
          );

          document.getElementById("uploadCoverImage").value = thumbnail_url;
          document.getElementById("uploadVideo").value = embedURL;
          document.getElementById("uploadTitle").value = results["title"];
          document.getElementById("uploadDescription").value =
            results["description"];
          document.getElementById("uploadRatio").value =
            results["height"] / results["width"];

          // return thumbnail_url;
        })
        .catch((error) => {
          window.alert("Error in video url: " + error);
        });
    }
  }

  async loadFeed() {
    let self = this;
    firestore
      .collection("projects")
      .doc(this.state.postID)
      .get()
      .then((snapshot) => {
        const snapshotData = snapshot.data();
        self.setState({ data: snapshotData });
        document.getElementById("uploadTitle").value = snapshotData.Title;
        document.getElementById("uploadCoverImage").value =
          snapshotData.CoverImage;
        document.getElementById("uploadVideo").value = snapshotData.Video;
        document.getElementById(
          "uploadFullProject"
        ).value = snapshotData.FullProject ? snapshotData.FullProject : "";
        document.getElementById(
          "uploadDescription"
        ).value = snapshotData.Description ? snapshotData.Description : "";
        document.getElementById("uploadRatio").value = snapshotData.Ratio;
        document.getElementById("uploadClient").value = snapshotData.Client
          ? snapshotData.Client
          : "";
        document.getElementById(
          "uploadClientURL"
        ).value = snapshotData.ClientURL ? snapshotData.ClientURL : "";
        snapshotData.Roles.map(
          (e) => (document.getElementById(e).checked = true)
        );
        snapshotData.Tools.map(
          (e) => (document.getElementById(e).checked = true)
        );
        snapshotData.Clips.map((e) => {
          let p = document.getElementById("uploadClips");
          let newElement = document.createElement("iframe");
          newElement.setAttribute("id", "clip" + (p.childElementCount + 1));
          newElement.setAttribute("name", "clip");
          newElement.setAttribute("src", e);
          p.appendChild(newElement);
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const video = document.getElementById("uploadVideo").value;
    const ratio = document.getElementById("uploadRatio").value;
    // if(video.indexOf('src=') !== -1) {
    //     video = video.substring(video.indexOf('src='));
    //     video = video.substring(5, video.indexOf(' ')-1);
    // }
    const image = document.getElementById("uploadCoverImage").value;
    const title = document.getElementById("uploadTitle").value;
    const client = document.getElementById("uploadClient").value;
    const clientURL = document.getElementById("uploadClientURL").value;
    const fullProject = document.getElementById("uploadFullProject").value;
    const description = document
      .getElementById("uploadDescription")
      .value.replace(/(?:\r\n|\r|\n)/g, "<br>");
    const checkedRoles = document.querySelectorAll(
      "input[name^='uploadRoles']:checked"
    );
    const checkedTools = document.querySelectorAll(
      "input[name^='uploadTools']:checked"
    );
    const clips = document.querySelectorAll("iframe[name^='clip']");

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
      Clips.push(item.src);
    }

    const self = this;

    firestore
      .collection("projects")
      .doc(self.state.postID)
      .set({
        Date: self.state.data.Date,
        CoverImage: image,
        Title: title,
        Video: video,
        Client: client,
        ClientURL: clientURL,
        FullProject: fullProject,
        Description: description,
        Ratio: ratio,
        Roles,
        Tools,
        Clips,
      })
      .then(() => {
        self.props.history.push(`/${self.state.postID}`);
      });
  }

  onChange(e) {
    let dataCopy = JSON.parse(JSON.stringify(this.state.data));
    dataCopy[e.target.name] = e.target.value;
    this.setState({ data: dataCopy });
  }

  addClip = () => {
    let input = window.prompt("Enter a URL");
    // if (input && input.includes("https://vimeo.com/")) {
    //     const embedURL = "https://player.vimeo.com/video/" + input.substring(input.indexOf(".com/") + 5);
    //
    //     let p = document.getElementById("uploadClips");
    //     let newElement = document.createElement("iframe");
    //     newElement.setAttribute('id', "clip"+(p.childElementCount+1));
    //     newElement.setAttribute('name', 'clip');
    //     newElement.setAttribute('src', embedURL);
    //     p.appendChild(newElement);
    // }
    if (input) {
      if (input && input.includes("https://vimeo.com/")) {
        const embedURL =
          "https://player.vimeo.com/video/" +
          input.substring(input.indexOf(".com/") + 5);

        let p = document.getElementById("uploadClips");
        let newElement = document.createElement("iframe");
        newElement.setAttribute("id", "clip" + (p.childElementCount + 1));
        newElement.setAttribute("name", "clip");
        newElement.setAttribute("src", embedURL);
        p.appendChild(newElement);
      } else if (input.includes("youtube")) {
        const embedURL =
          "https://www.youtube.com/embed/" +
          input.substring(input.indexOf("=") + 1);

        let p = document.getElementById("uploadClips");
        let newElement = document.createElement("iframe");
        newElement.setAttribute("id", "clip" + (p.childElementCount + 1));
        newElement.setAttribute("name", "clip");
        newElement.setAttribute("src", embedURL);
        p.appendChild(newElement);
      }
    }
    // Adds an element to the document
  };

  removeClip = () => {
    // Removes an element from the document
    let el = document.getElementById("uploadClips");
    if (el.childElementCount)
      el.removeChild(el.children[el.childElementCount - 1]);
    else console.log("it works");
  };

  render() {
    return (
      <div className="upload">
        <form onSubmit={this.handleSubmit.bind(this)} method="POST">
          <button
            type="button"
            onClick={() => this.loadThumbnail(prompt("Video URL"))}
          >
            Load Cover Video
          </button>
          <div>
            <label
              htmlFor="uploadVideo"
              onClick={() =>
                window.alert(
                  "This is the video of the project for the project page. For Vimeo, have 'fixed size' selected." +
                    "You can also choose loop, autoplay, or a color too but have everything else deselected. For Youtube, select any of the options."
                )
              }
            >
              Video
            </label>
            <input
              type="text"
              id="uploadVideo"
              required
              name="Video"
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="uploadImage"
              onClick={() =>
                window.alert(
                  "This is the image shown on the feed. Make the width of the image 500px, " +
                    "it will be loaded into an area 500px wide so any larger will just be a waste of storage and transfer space. " +
                    "Try and compress the image as well if possible to reduce file size, only enough where image quality isn't sacrificed."
                )
              }
            >
              Image
            </label>
            <input
              type="text"
              id="uploadCoverImage"
              autoComplete="off"
              required
              name="CoverImage"
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="uploadRatio"
              onClick={() => window.alert("height/width of video")}
            >
              Ratio
            </label>
            <input
              type="text"
              id="uploadRatio"
              autoComplete="off"
              name="Ratio"
              required
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="uploadTitle"
              onClick={() =>
                window.alert(
                  "This is the title of the project. It has to be unique from all other projects"
                )
              }
            >
              Title
            </label>
            <input
              type="text"
              id="uploadTitle"
              autoComplete="off"
              required
              name="Title"
            />
          </div>

          <div>
            Roles
            <br />
            Animation
            <input
              type="checkbox"
              name="uploadRoles"
              id="Animation"
              value="Animation"
            />
            <br />
            VFX
            <input type="checkbox" name="uploadRoles" id="VFX" value="VFX" />
            <br />
            Design
            <input
              type="checkbox"
              name="uploadRoles"
              id="Design"
              value="Design"
            />
            <br />
            Film
            <input type="checkbox" name="uploadRoles" id="Film" value="Film" />
            <br />
            Sound
            <input
              type="checkbox"
              name="uploadRoles"
              id="Sound"
              value="Sound"
            />
          </div>

          <div>
            Tools
            <br />
            Adobe After Effects
            <input
              type="checkbox"
              name="uploadTools"
              id="adobeAfterEffects"
              value="adobeAfterEffects"
            />
            <br />
            Adobe Illustrator
            <input
              type="checkbox"
              name="uploadTools"
              id="adobeIllustrator"
              value="adobeIllustrator"
            />
            <br />
            Adobe Photoshop
            <input
              type="checkbox"
              name="uploadTools"
              id="adobePhotoshop"
              value="adobePhotoshop"
            />
            <br />
            Adobe Premiere
            <input
              type="checkbox"
              name="uploadTools"
              id="adobePremiere"
              value="adobePremiere"
            />
            <br />
            Analog
            <input
              type="checkbox"
              name="uploadTools"
              id="analog"
              value="analog"
            />
            <br />
            Cinema 4D
            <input
              type="checkbox"
              name="uploadTools"
              id="cinema4D"
              value="cinema4D"
            />
            <br />
            Reason
            <input
              type="checkbox"
              name="uploadTools"
              id="reason"
              value="reason"
            />
          </div>

          <div>
            <div>
              <label
                htmlFor="uploadClient"
                onClick={() => window.alert("Name of the client")}
              >
                Client
              </label>
              <input
                type="text"
                className="form-control"
                id="uploadClient"
                name="Client"
              />
            </div>
            <div>
              <label
                htmlFor="uploadClientURL"
                onClick={() =>
                  window.alert(
                    "URL if you want to link to the clients site. This is optional"
                  )
                }
              >
                Client URL
              </label>
              <input type="text" id="uploadClientURL" name="ClientURL" />
            </div>
          </div>

          <div>
            <label
              htmlFor="uploadFullProject"
              onClick={() => window.alert("link for the Full project")}
            >
              Link to full project
            </label>
            <input type="text" id="uploadFullProject" name="FullProject" />
          </div>

          <div>
            <label
              htmlFor="uploadDescription"
              onClick={() =>
                window.alert(
                  "A description of the project and further details about what your role(s) on it were. Can be anything though"
                )
              }
            >
              Description
            </label>
            <textarea id="uploadDescription" name="Description" />
          </div>

          <div>
            Clips
            <div id="uploadClips" className="uploadImages"></div>
            <button type="button" onClick={() => this.addClip()}>
              +
            </button>
            <button type="button" onClick={() => this.removeClip()}>
              -
            </button>
          </div>

          <button type="submit" className="btn btn-primary">
            Upload
          </button>
        </form>
      </div>
    );
  }
}

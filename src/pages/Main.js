import React from "react";
import { Footer } from "../components/Footer";
import bodymovin from "bodymovin";
import animationData from "../utils/Black_Animation_Intro.json";
import { firestore } from "../utils/config/firebase.js";
import { Post } from "../components";

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoaded: true,
      lastVisible: "",
      filter: "All"
    };
  }

  animationIsAttached = false;

  componentDidMount() {
    this.attachAnimation();
  }

  componentWillMount() {
    this.loadFeed();
  }

  async loadFeed() {
    let self = this;
    self.setState({ isLoaded: false });

    const data = [];
    firestore
      .collection("projects")
      .orderBy("Date", "desc")
      .get()
      .then(snapshot => {
        let lastVisible = snapshot.docs.length
          ? snapshot.docs[snapshot.docs.length - 1].data().Date
          : "";
        snapshot.forEach(doc => {
          let temp = doc.data();
          temp.key = doc.id;
          data.push(temp);
        });
        self.setState({ data: data });
        self.setState({ lastVisible: lastVisible, isLoaded: true });
        let element = document.getElementById("loadingScreen");
        setTimeout(function () {
          element.style.opacity = "0";
          window.scrollTo(0, 0);
        }, 1000);
        setTimeout(function () {
          element.parentNode.removeChild(element);
        }, 1500);
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  static resetForm() {
    document.getElementById("contact-form").reset();
  }

  async handleSubmit(e) {
    const title = document.getElementById("title").value;
    const date = Date.now();
    const image = document
      .getElementById("image")
      .value.replace("google.com/open", "google.com/uc");
    const url = document.getElementById("url").value;

    e.preventDefault();

    firestore
      .collection("posts")
      .add({
        Title: title,
        Date: date,
        Image: image,
        URL: url
      })
      .then(() => {
        document.getElementById("contact-form").reset();
      });
  }

  createPosts = item =>
    (item.Roles.includes(this.state.filter) || this.state.filter === "All") && (
      <Post item={item} />
    );

  handleFilterClick(filter) {
    this.setState({ filter: filter });
  }

  attachAnimation = () => {
    if (this.animationContainer !== undefined && !this.animationIsAttached) {
      const animationProperties = {
        container: this.animationContainer,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData
      };

      bodymovin.loadAnimation(animationProperties);
    }
  };

  render() {
    return (
      <div>
        <div className="main">
          <div id="loadingScreen" className="loadingScreen">
            <div
              className="loadingScreenIcon"
              ref={animationDiv => {
                this.animationContainer = animationDiv;
              }}
            />
          </div>

          <form className="filters" action="">
            <input
              type="radio"
              id="filter-1"
              name="filter"
              onClick={() => this.handleFilterClick("All")}
            />
            <label htmlFor="filter-1">All</label>|
            <input
              type="radio"
              id="filter-2"
              name="filter"
              onClick={() => this.handleFilterClick("Animation")}
            />
            <label htmlFor="filter-2">Animation</label>|
            <input
              type="radio"
              id="filter-3"
              name="filter"
              onClick={() => this.handleFilterClick("VFX")}
            />
            <label htmlFor="filter-3">VFX</label>|
            <input
              type="radio"
              id="filter-4"
              name="filter"
              onClick={() => this.handleFilterClick("Design")}
            />
            <label htmlFor="filter-4">Design</label>|
            <input
              type="radio"
              id="filter-5"
              name="filter"
              onClick={() => this.handleFilterClick("Film")}
            />
            <label htmlFor="filter-5">Film</label>|
            <input
              type="radio"
              id="filter-6"
              name="filter"
              onClick={() => this.handleFilterClick("Sound")}
            />
            <label htmlFor="filter-6" style={{ borderRight: "none" }}>
              Sound
            </label>
          </form>

          {sessionStorage.getItem("loggedIn") && (
            <button className="linkButton">
              <a href={"/upload"}>Upload</a>
            </button>
          )}

          <div className="posts">
            {Object.values(this.state.data).map(this.createPosts)}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

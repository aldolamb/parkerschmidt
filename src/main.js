import React from "react";
import { Footer } from "./footer";
import bodymovin from 'bodymovin'
import animationData from './Black Animation Intro.json'
const firebase = require("firebase");

const filters = [
    "All",
    "Motion Graphics",
    "Compositing",
    "VFX",
    "Designer",
    "Director",
    "Editor",
    "Filmer",
    "Illustrator"
];


const filtersNew = [
    "All",
    "Animation",
    "VFX",
    "Design",
    "Film",
    "Sound"
];

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

    componentDidMount () {
        this.attachAnimation()
    }

    componentWillMount() {
        this.loadFeed();
    }

    async loadFeed() {
        let self = this;
        self.setState({isLoaded: false});

        const data = [];
        firebase.firestore().collection("projects").orderBy('Date', 'desc').get().then(snapshot => {
            let lastVisible = snapshot.docs.length ? snapshot.docs[snapshot.docs.length - 1].data().Date : "";
            snapshot.forEach(doc => {
                let temp = doc.data();
                temp.key = doc.id;
                data.push(temp);
            });
            self.setState({data: data});
            self.setState({lastVisible: lastVisible, isLoaded: true});
            let element = document.getElementById("loadingScreen");
            setTimeout(function(){ element.style.opacity = "0"; window.scrollTo(0, 0); }, 1000);
            setTimeout(function(){ element.parentNode.removeChild(element) }, 1500);

        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    }

    // onScroll = () => {
    //     if (
    //         (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 250) &&
    //         this.state.data.length && this.state.isLoaded
    //     ) {
    //         this.loadMore();
    //     }
    // };
    //
    // async loadMore() {
    //     let self = this;
    //     self.setState({isLoaded: false});
    //
    //     const data = [];
    //     const lowerValue = this.state.lastVisible;
    //     firebase.firestore().collection("posts").orderBy('Date', 'desc').startAfter(lowerValue).limit(5).get().then(snapshot => {
    //         let lastVisible = snapshot.docs.length && snapshot.docs[snapshot.docs.length - 1].data().Date;
    //         snapshot.forEach(doc => {
    //             let temp = doc.data();
    //             temp.key = doc.id;
    //             data.push(temp);
    //         });
    //         if (data.length) {
    //             self.setState({data: self.state.data.concat(data.reverse())});
    //             self.setState({lastVisible: lastVisible, isLoaded: true})
    //         }
    //     })
    //         .catch(err => {
    //             console.log('Error getting documents', err);
    //         });
    // }

    static resetForm () {
        document.getElementById('contact-form').reset();
    }

    async handleSubmit(e) {
        const title = document.getElementById('title').value;
        const date = Date.now();
        const image = document.getElementById('image').value.replace("google.com/open", "google.com/uc");
        const url = document.getElementById('url').value;

        e.preventDefault();

        firebase.firestore().collection("posts").add({
            Title: title,
            Date: date,
            Image: image,
            URL: url,
        }).then(() => {
            document.getElementById('contact-form').reset();
        });
    }

    createPosts = (item) => (
        <div key={item.Date + "-wrapper"}>
            {(item.Roles.includes(this.state.filter) || this.state.filter === "All") &&
            <div key={item.Date} className="postContainer">
                {/*{sessionStorage.getItem("loggedIn") &&*/}
                {/*<div className="toolbar">*/}
                {/*<a style={{float: "left"}} href={`./edit/${item.key}`}>edit</a>*/}
                {/*<div style={{float: "right", cursor: "pointer"}} onClick={() =>*/}
                {/*window.confirm("are you sure you want to delete this") &&*/}
                {/*firebase.firestore().collection("posts").doc(item.key).delete().then(() => {*/}
                {/*this.props.history.push('/');*/}
                {/*})}>delete</div>*/}
                {/*<div>{new Date(item["Date"]).toLocaleString()}</div>*/}
                {/*</div>*/}
                {/*}*/}
                <a key={item.Title} href={`/${item.key}`}>
                    <img src={item.CoverImage} alt={item.Title} key={"img-"+item.Title}/>
                    <h4>{item.Title}</h4>
                    {/*<div style={{top: 0, left: 0, width: "100%", height: "252px", background: "red"}}>*/}
                    {/*</div>*/}
                    {/*<p>{item.Roles.map((e) => {return e}).join(", ")}</p>*/}
                    {/*<div className="overlay2">*/}
                        {/*<div className="text">*/}
                            {/*<h2>{item.Title}</h2>*/}
                            {/*<pre>{item.Roles.map((e) => {return e}).join("\n")}</pre>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="overlayPic"/>*/}
                </a>
            </div>
            // <div key={item.Date} className="container">
            //     {/*{sessionStorage.getItem("loggedIn") &&*/}
            //     {/*<div className="toolbar">*/}
            //         {/*<a style={{float: "left"}} href={`./edit/${item.key}`}>edit</a>*/}
            //         {/*<div style={{float: "right", cursor: "pointer"}} onClick={() =>*/}
            //             {/*window.confirm("are you sure you want to delete this") &&*/}
            //             {/*firebase.firestore().collection("posts").doc(item.key).delete().then(() => {*/}
            //                 {/*this.props.history.push('/');*/}
            //             {/*})}>delete</div>*/}
            //         {/*<div>{new Date(item["Date"]).toLocaleString()}</div>*/}
            //     {/*</div>*/}
            //     {/*}*/}
            //     <a className="projectPreview" key={item.Title} href={`/${item.key}`}>
            //         <img src={item.CoverImage} alt={item.Title} className="image"/>
            //         <div className="overlay2">
            //             <div className="text">
            //                 <h2>{item.Title}</h2>
            //                 <pre>{item.Roles.map((e) => {return e}).join("\n")}</pre>
            //             </div>
            //         </div>
            //         <div className="overlayPic"/>
            //     </a>
            // </div>
            }
        </div>
    );

    handleFilterClick(filter) {
        this.setState({filter: filter});
    }

    attachAnimation = () => {
        if (this.animationContainer !== undefined && !this.animationIsAttached) {
            const animationProperties = {
                container: this.animationContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData
            };

            bodymovin.loadAnimation(animationProperties);
        }
    };

    render() {
        return (
            <div className="main">
                <div id="loadingScreen" className="loadingScreen">
                    <div className="loadingScreenIcon"
                         ref={(animationDiv) => { this.animationContainer = animationDiv; }}/>
                </div>
                <iframe className="showReelVideo" src="https://player.vimeo.com/video/280292382?title=0&byline=0&portrait=0"
                            frameBorder="0" allowFullScreen/>

                <form className="filters" action="">
                    <div>
                        <input type="radio" id="filter-1" name="jeff" onClick={() => this.handleFilterClick("All")}/>
                        <label htmlFor="filter-1">All</label>|

                        <input type="radio" id="filter-2" name="jeff" onClick={() => this.handleFilterClick("Animation")}/>
                        <label htmlFor="filter-2">Animation</label>|

                        <input type="radio" id="filter-4" name="jeff" onClick={() => this.handleFilterClick("VFX")}/>
                        <label htmlFor="filter-4">VFX</label>|

                        <input type="radio" id="filter-5" name="jeff" onClick={() => this.handleFilterClick("Design")}/>
                        <label htmlFor="filter-5">Design</label>|

                        <input type="radio" id="filter-8" name="jeff" onClick={() => this.handleFilterClick("Film")}/>
                        <label htmlFor="filter-8">Film</label>|

                        <input type="radio" id="filter-9" name="jeff" onClick={() => this.handleFilterClick("Sound")}/>
                        <label htmlFor="filter-9" style={{borderRight: "none"}}>Sound</label>
                    </div>
                </form>

                {sessionStorage.getItem("loggedIn") &&
                <button className="linkButton">
                    <a href={"/upload"}>Upload</a>
                </button>
                }

                <div className="posts">
                    {Object.values(this.state.data).map(this.createPosts)}
                </div>

                <Footer/>
            </div>
        );
    }
}
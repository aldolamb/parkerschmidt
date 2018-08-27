import React from "react";
import Instagram from "./icons/instagram.svg";
import Vimeo from "./icons/vimeo.svg";
import Mail from "./icons/mail.svg";
const firebase = require("firebase");

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

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    componentWillMount() {
        this.loadFeed();
    }

    async loadFeed() {
        let self = this;
        self.setState({isLoaded: false});

        const data = [];
        firebase.firestore().collection("posts").orderBy('Date', 'desc').get().then(snapshot => {
            let lastVisible = snapshot.docs.length ? snapshot.docs[snapshot.docs.length - 1].data().Date : "";
            snapshot.forEach(doc => {
                let temp = doc.data();
                temp.key = doc.id;
                data.push(temp);
            });
            self.setState({data: data});
            self.setState({lastVisible: lastVisible, isLoaded: true});
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    }

    onScroll = () => {
        if (
            (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 250) &&
            this.state.data.length && this.state.isLoaded
        ) {
            this.loadMore();
        }
    };

    async loadMore() {
        let self = this;
        self.setState({isLoaded: false});

        const data = [];
        const lowerValue = this.state.lastVisible;
        firebase.firestore().collection("posts").orderBy('Date', 'desc').startAfter(lowerValue).limit(5).get().then(snapshot => {
            let lastVisible = snapshot.docs.length && snapshot.docs[snapshot.docs.length - 1].data().Date;
            snapshot.forEach(doc => {
                let temp = doc.data();
                temp.key = doc.id;
                data.push(temp);
            });
            if (data.length) {
                self.setState({data: self.state.data.concat(data.reverse())});
                self.setState({lastVisible: lastVisible, isLoaded: true})
            }
        })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }

    handleScroll = () => {
        // lastScrollY = window.scrollY;
        // // console.log(window);
        //
        // let triangle = document.getElementById("triangle");
        // let triangle2 = document.getElementById("triangle2");
        // let length = triangle.getTotalLength();
        //
        //
        // // The start position of the drawing
        // triangle.style.strokeDasharray = length;
        // triangle2.style.strokeDasharray = length;
        //
        // // Hide the triangle by offsetting dash. Remove this line to show the triangle before scroll draw
        // triangle.style.strokeDashoffset = length;
        // triangle2.style.strokeDashoffset = length;
        //
        // // console.log(window.innerHeight + ", " + lastScrollY);
        // let scrollpercent = (lastScrollY-window.innerHeight) > 0 ? (lastScrollY-window.innerHeight)/200 : 0;
        //
        // let draw = length * scrollpercent;
        // let draw2 = length * -scrollpercent;
        //
        // // Reverse the drawing (when scrolling upwards)
        // triangle.style.strokeDashoffset = length - draw;
        // triangle2.style.strokeDashoffset = length - draw2;
        // document.getElementById("svg").style.marginTop = ((lastScrollY - 1400) / 1.5) + "px";
        // // console.log(((lastScrollY - 800) / 15));
        // document.getElementById("mySVG1").style.marginRight = ((lastScrollY - 1400) / 15) + "px";
        // document.getElementById("mySVG2").style.marginLeft = ((lastScrollY - 1400) / 15) + "px";
    };

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


        // firebase.database().ref('Posts').push({
        //     Title: title,
        //     Subtitle: subtitle,
        //     Body: body,
        //     Date: date,
        //     Time: time,
        // }, function(error) {
        //     if (error)
        //         alert("Failed to save.");
        //     else
        //         self.props.history.push('/feed');
        //
        // });
    }

    createPosts = (item) => (
        <div key={item.Date + "-wrapper"}>
            {(item.Roles.includes(this.state.filter) || this.state.filter === "All") &&
            <div key={item.Date} className="container">
                {sessionStorage.getItem("loggedIn") &&
                <div className="toolbar">
                    <a style={{float: "left"}} href={`./edit/${item.key}`}>edit</a>
                    <div style={{float: "right", cursor: "pointer"}} onClick={() =>
                        window.confirm("are you sure you want to delete this") &&
                        firebase.firestore().collection("posts").doc(item.key).delete().then(() => {
                            this.props.history.push('/');
                        })}>delete</div>
                    <div>{new Date(item["Date"]).toLocaleString()}</div>
                </div>
                }
                <a key={item.Title} href={item.URL}>
                    <img src={item.Image} alt={item.Title} className="image"/>
                    <div className="overlay">
                        <div className="text">
                            <h2>{item.Title}</h2>
                            <pre>{item.Roles.map((e) => {return e}).join("\n")}</pre>
                        </div>
                    </div>
                </a>
            </div>
            }
        </div>
    );

    // showReel() {
    //     document.getElementById("showReel").style.display = "block";
    //     document.getElementById("header").style.height = "75vh";
    //     document.getElementById("title").style.display = "none";
    //     document.getElementById("showReelVideo").src += "&autoplay=1";
    // }
    //
    // hideReel() {
    //     document.getElementById("showReel").style.display = "none";
    //     document.getElementById("header").style.height = "86vh";
    //     document.getElementById("title").style.display = "table-cell";
    //     let iframe = document.getElementById("showReelVideo");
    //     let iframeSrc = iframe.src.replace('&autoplay=1','');;
    //     iframe.src = iframeSrc;
    // }

    handleFilterClick(filter) {
        this.setState({filter: filter});
    }

    render() {
        return (
            <div className="main">
                {/*<div className="links">*/}
                    {/*<img src={Instagram} className="InstagramLink" alt="instagram" />*/}
                    {/*<img src={Vimeo} className="VimeoLink" alt="vimeo" />*/}
                    {/*<img src={Contact} className="ContactLink" alt="contact" />*/}
                {/*</div>*/}
                <div id="testHeader" className="header">
                    <div style={{float: "left"}}>PARKER SCHMIDT</div>
                    <div style={{float: "right", paddingTop: ".25em"}} >
                        <img src={Instagram}/>
                        <img src={Vimeo}/>
                        <img style={{fontSize: "1.2em", margin: "0 0 -.1em -.15em"}} src={Mail}/>
                    </div>
                </div>
                {/*<div className="embed-container">*/}
                    <iframe id="showReelVideo" className="showReelVideo" src="https://player.vimeo.com/video/271950505?title=0&byline=0&portrait=0"
                            frameBorder="0" allowFullScreen/>
                {/*</div>*/}
                {/*<header id="header">*/}
                    {/*<div id="showReel" className="showReel">*/}
                        {/*<div className="embed-container">*/}
                            {/*<iframe id="showReelVideo" src="https://player.vimeo.com/video/271950505?title=0&byline=0&portrait=0"*/}
                                    {/*frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true"*/}
                                    {/*allowFullScreen/>*/}
                        {/*</div>*/}
                        {/*/!*<button onClick={() => this.hideReel()}style={{position: "absolute", bottom: "5%", right: 0, border: 0, letterSpacing: "5px"}}>CLOSE X</button>*!/*/}
                    {/*</div>*/}

                    {/*<div id="title" className="middle">*/}
                        {/*<h1>PARKER SCHMIDT</h1>*/}
                        {/*<button onClick={()=>this.showReel()}>2018 Reel</button>*/}
                        {/*/!*<Mail/>*!/*/}
                    {/*</div>*/}
                {/*</header>*/}
                {/*Motion graphics, compositing, vfx, designer, director, editor, filmer, illustrator*/}

                <form className="filters" action="">
                    <input type="radio" id="filter-1" name="jeff" onClick={() => this.handleFilterClick("All")}/>
                        <label htmlFor="filter-1">All</label>|

                    <input type="radio" id="filter-2" name="jeff" onClick={() => this.handleFilterClick("Motion Graphics")}/>
                        <label htmlFor="filter-2">Motion Graphics</label>|

                    <input type="radio" id="filter-3" name="jeff" onClick={() => this.handleFilterClick("Compositing")}/>
                        <label htmlFor="filter-3">Compositing</label>|

                    <input type="radio" id="filter-4" name="jeff" onClick={() => this.handleFilterClick("VFX")}/>
                        <label htmlFor="filter-4">VFX</label>|

                    <input type="radio" id="filter-5" name="jeff" onClick={() => this.handleFilterClick("Designer")}/>
                        <label htmlFor="filter-5">Designer</label>|

                    <input type="radio" id="filter-6" name="jeff" onClick={() => this.handleFilterClick("Director")}/>
                        <label htmlFor="filter-6">Director</label>|

                    <input type="radio" id="filter-7" name="jeff" onClick={() => this.handleFilterClick("Editor")}/>
                        <label htmlFor="filter-7">Editor</label>|

                    <input type="radio" id="filter-8" name="jeff" onClick={() => this.handleFilterClick("Filmer")}/>
                        <label htmlFor="filter-8">Filmer</label>|

                    <input type="radio" id="filter-9" name="jeff" onClick={() => this.handleFilterClick("Illustrator")}/>
                        <label htmlFor="filter-9" style={{borderRight: "none"}}>Illustrator</label>
                </form>

                {/*<div className="custom-select">*/}
                    {/*<select>*/}
                        {/*<option value="All">All</option>*/}
                        {/*<option value="Motion Graphics">Motion Graphics</option>*/}
                        {/*<option value="Compositing">Compositing</option>*/}
                        {/*<option value="VFX">VFX</option>*/}
                        {/*<option value="Designer">Designer</option>*/}
                        {/*<option value="Director">Director</option>*/}
                        {/*<option value="Editor">Editor</option>*/}
                        {/*<option value="Filmer">Filmer</option>*/}
                        {/*<option value="Illustrator">Illustrator</option>*/}
                    {/*</select>*/}
                {/*</div>*/}

                {/*{sessionStorage.getItem("loggedIn") &&*/}
                {/*<div className="upload">*/}
                    {/*<form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">*/}
                        {/*<div className="form-group">*/}
                            {/*<label htmlFor="title">Title</label>*/}
                            {/*<input type="text" className="form-control" id="title" autoComplete="off" required/>*/}
                        {/*</div>*/}
                        {/*<div className="form-group">*/}
                            {/*<label htmlFor="email">Image</label>*/}
                            {/*<input type="text" className="form-control" id="image" aria-describedby="emailHelp" required/>*/}
                        {/*</div>*/}
                        {/*<div className="form-group">*/}
                            {/*<label htmlFor="email">Url</label>*/}
                            {/*<input type="text" className="form-control" id="url" aria-describedby="emailHelp" required/>*/}
                        {/*</div>*/}
                        {/*<button type="submit" className="btn btn-primary">Upload</button>*/}
                    {/*</form>*/}
                {/*</div>*/}
                {/*}*/}

                <div className="posts">
                    {Object.values(this.state.data).map(this.createPosts)}
                </div>

                {/*<div id="svg" className="svg">*/}
                {/*<svg id="mySVG1">*/}
                {/*<path fill="none" stroke="red" strokeWidth="3" id="triangle" d="M150 0 L75 200 L225 200 Z" />*/}
                {/*Sorry, your browser does not support inline SVG.*/}
                {/*</svg>*/}
                {/*<svg id="mySVG2">*/}
                {/*<path fill="none" stroke="red" strokeWidth="3" id="triangle2" d="M150 0 L75 200 L225 200 Z" />*/}
                {/*Sorry, your browser does not support inline SVG.*/}
                {/*</svg>*/}
                {/*</div>*/}
                <footer>
                    <a href="https://www.instagram.com/parkerrschmidtt/?hl=en">Instagram</a>
                    <a href="https://vimeo.com/parkerschmidt">Vimeo</a>
                    <a href="mailto:parkerschmidt95@gmail.com">Contact</a>
                </footer>
            </div>
        );
    }
}
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

    // componentDidMount() {
    //     window.addEventListener('scroll', this.onScroll, false);
    // }
    //
    // componentWillUnmount() {
    //     window.removeEventListener('scroll', this.onScroll, false);
    // }
    //
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

    handleFilterClick(filter) {
        this.setState({filter: filter});
    }

    render() {
        return (
            <div className="main">
                <header>
                    <div style={{float: "left"}}>PARKER SCHMIDT</div>
                    <div style={{float: "right", paddingTop: ".25em"}} >
                        <a href="https://www.instagram.com/parkerrschmidtt/?hl=en"><img src={Instagram}/></a>
                        <a href="https://vimeo.com/parkerschmidt"><img src={Vimeo}/></a>
                        <a href="mailto:parkerschmidt95@gmail.com"><img style={{fontSize: "1.2em", paddingLeft: ".45em", marginBottom: "-.07em"}} src={Mail}/></a>
                    </div>
                </header>

                <iframe id="showReelVideo" className="showReelVideo" src="https://player.vimeo.com/video/271950505?title=0&byline=0&portrait=0"
                            frameBorder="0" allowFullScreen/>

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

                <div className="posts">
                    {Object.values(this.state.data).map(this.createPosts)}
                </div>

                <footer>
                    <a href="https://www.instagram.com/parkerrschmidtt/?hl=en">Instagram</a>
                    <a href="https://vimeo.com/parkerschmidt">Vimeo</a>
                    <a href="mailto:parkerschmidt95@gmail.com">Contact</a>
                </footer>
            </div>
        );
    }
}
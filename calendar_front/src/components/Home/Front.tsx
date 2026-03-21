import {Link, useNavigate} from 'react-router-dom'
import {useEffect} from "react"

const Front = ({base, setID}: {base: string, setID: (userID: number) => void}) => {
    const navigate = useNavigate();

    useEffect(() => {
        async function loadTokens() {
            try {
                const response = await fetch(`${base}/login/authToken`, {
                    credentials: "include"
                });
                const results = await response.json();
                if (response.ok && results.status) {
                    setID(results.id)
                    navigate("/home")
                }
            }
            catch (err) {
                if (err instanceof Error) alert("Network Error:" + err.message);
            }    
        }
        loadTokens();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                    else entry.target.classList.remove("visible");
                });
            },
            {threshold: 0.10}
        );

        document.querySelectorAll(".fadeIn").forEach(e => observer.observe(e));
        return () => observer.disconnect();
    }, []);

    return (
        <div style = {{position: "absolute", inset: "0"}}>
            <div className = "topTrack fadeIn">
                <div className = "topTrackL">
                    <div className = "topTrackItem">
                        <h1>Traxiu</h1>
                    </div>
                </div>
                <div className = "topTrackR">
                    <div className = "topTrackItem">
                        <Link to = "/login" className = "linkButton">
                            <button>Login</button>
                        </Link>
                    </div>
                    <div className = "topTrackItem">
                        <Link to = "/create" className = "linkButton">
                            <button>Create Account</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className = "frontContainer topCt fadeIn">
                <h1>Track the way <br/> you want</h1>
            </div>
            <div className = "frontContainer addBlock fadeIn" style = {{backgroundColor: "#00000027"}}>
                <h1>About Traxiu</h1>
                <p>What started as a way to gain experience quickly became a full-scale web development project. 
                    I originally wanted to start a small project to learn more about full-stack development. However, 
                    the more I worked on this project, the more I realized I needed something to keep track of my commitments. 
                    I wanted a tracking system that was more stylish and I could easily separate my concerns into different categories. 
                    Thus I turned my small project into something that I could use to store information. 
                    This website is mostly used for desktop and scales better with it, however it is still accessible on phone. 
                    I hope that this website continues to be a valuable tracker to myself and others as I continue on my CS journey!
                </p>
            </div>
            <div className = "frontContainer fadeIn" style = {{backgroundColor: "#00000011"}}>
                <h1>How to use</h1>
                <div className = "exUsage fadeIn">
                    <h2>About creating and editing calendars/goals</h2>
                    <p>Each calendar/goal is separated into a category which can be created, edited, and deleted. 
                        Most of the functionality related to this is located on the left sidebar. 
                        Clicking on create calendar will prompt the user to create a new calendar category to which events can be added. 
                        To edit a calendar, only select one calendar to be active to edit. 
                        To make an event on that calendar, do the same. 
                        You can delete multiple calendar categories at once by selecting all of the ones that want to be deleted. 
                        To select a calendar category, simply click on the name of the category and it should be highlighted as shown below. 
                        The same applies to goals.
                    </p>
                </div>
                <div className = "exUsage fadeIn">
                    <h2 style = {{textAlign: "right"}}>Popup window display for creation and edits</h2>
                    <p style = {{textAlign: "right"}}>When creating or editing a calendar/goal, a popup window will appear. 
                        The fields will appear filled if editing but will still require they fulfill specific requirements. 
                        For example, filling out the date for a calendar event will require the user to use a specific format. 
                        In addition, the way to exit out of the popup is to press escape on the keyboard. 
                        There are currently no other ways to escape out of the popup window.
                    </p>
                </div>
                <div className = "exUsage fadeIn">
                    <h2>Pictures:</h2>
                    <div className = "flexPictures">
                        <img src = "popupEx.png" style = {{maxWidth: "70%"}}/>
                        <div className = "flexPicturesV">
                            <img src = "activeEx.png" style = {{width: "200px", alignSelf: "flex-start"}}/>
                            <img src = "calendarEx.png" style = {{width: "200px", alignSelf: "flex-start"}}/>
                        </div>
                    </div>
                </div>
                <div className = "frontContainer fadeIn" style = {{backgroundColor: "#00000024"}}>
                    <h1>About me</h1>
                    <p>I'm currently an undergraduate student looking to gain more experience in MSE and CS! 
                        You can read more about me <a href = "https://main.d1o3ha5jsk9k7d.amplifyapp.com/">here</a>
                        <br/>
                        See an issue with the website? Feel free to reach out at kathyzguo@gmail.com! 
                        Thank you for reading and seeing my progress :)
                    </p>
                    <br/>
                </div>
            </div>
        </div>
    )
}

export default Front;
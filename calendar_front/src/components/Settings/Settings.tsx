import type {LoginCreate, LoginCreateErrors} from "../../interfaces/LoginInterface.tsx"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {createPortal} from "react-dom"
import Taskbar from "../Home/Taskbar"
import Warning from "./Warning"

const Settings = ({base, userID} : {base: string, userID: number}) => {
    const [formData, setFormData] = useState<LoginCreate>({name: "", email: "", password: ""});
    const [formErrors, setFormErrors] = useState<LoginCreateErrors>({});
    const [showDel, setShowDel] = useState<number | undefined>(undefined);
    const [success, setSuccess] = useState("");
    const [showPW, setShowPW] = useState(false);
    const navigate = useNavigate();
    
    const checkLoginB = (name: string, email: string, password: string) => {
        const newErrors: LoginCreateErrors = {};
        if (!name) {
            newErrors.name = "Enter a name";
        }
        if (!email) {
            newErrors.email = "Enter an email";
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid email";
        }
        if (!password && password !== "") {
            newErrors.password = "Enter a password";
        }
        else if (password.length < 5 && password !== "") {
            newErrors.password = "Password must be at least 5 characters long";
        }
        setFormErrors(newErrors);
        return newErrors;
    }
    
    useEffect(() => {
        if (userID === -1) {
            navigate("/");
        }
    }, [userID, navigate]); 

    useEffect(() => {
        async function loadInfo() {
            if (userID >= 1) {
                try {
                    const jsonObj = {id: userID};
                    const response = await fetch(`${base}/main/getUserInfo`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(jsonObj)
                    });
                    const results = await response.json();
                    if (response.ok && results.status) {
                        setFormData({name: results.name, email: results.email, password: ""});
                    }
                }
                catch (err) {
                    if (err instanceof Error) alert("Network Error:" + err.message);
                }              
            }
        }
        loadInfo();
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}))
        if (formErrors[name as keyof LoginCreateErrors]) {
            const newErrors = {...formErrors};
            delete newErrors[name as keyof LoginCreateErrors];
            setFormErrors(newErrors);
        }
    }

    const handlePasswordShow = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowPW(!showPW);
    }

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = checkLoginB(formData.name, formData.email, formData.password);
        if (Object.keys(errors).length > 0) {}
        else {
            try {
                const response = await fetch(`${base}/login/edit`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({id: userID, ...formData})
                })
                const results = await response.json();
                if (response.ok) {
                    setSuccess(results.message);
                }
            }
            catch (err) {
                if (err instanceof Error) alert("Network Error: " + err.message);
            }
        }
    }

    return (
        <div>
            <Taskbar type = {5}/>
            <div style = {{minHeight: "100%", minWidth: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div className = "settingsCont">
                    <h2>Account Settings</h2>
                    {success.length > 1 && <h6 style = {{color: "#ffffff"}}>{success}</h6>}
                    <form className = "px-4 py-3" noValidate onSubmit = {handleFormSubmission}>
                        <div className = "mb-3">
                            <label htmlFor = "Name" className = "form-label" style = {{color: "#ffffff"}}>Name</label>
                            <input name = "name" type = "text" value = {formData.name} className = "form-control whiteText" id = "Name" placeholder = "Name" onChange = {handleInputChange}/>
                            {formErrors.name && <p className = "text-danger errorTextNew">{formErrors.name}</p>}
                        </div>
                        <div className = "mb-3">
                            <label htmlFor = "Email" className = "form-label" style = {{color: "#ffffff"}}>Email address</label>
                            <input name = "email" type = "email" value = {formData.email} className = "form-control whiteText" id = "Email" placeholder = "Email" onChange = {handleInputChange}/>
                            {formErrors.email && <p className = "text-danger errorTextNew">{formErrors.email}</p>}
                        </div>
                        <div className = "mb-3">
                            <label htmlFor = "Password" className = "form-label" style = {{color: "#ffffff"}}>Password</label>
                            <input name = "password" value = {formData.password} type = {showPW ? "text" : "password"} className = "form-control whiteText" id = "Password" placeholder = "Password" onChange = {handleInputChange}/>
                            {formErrors.password && <p className = "text-danger errorTextNew">{formErrors.password}</p>}
                        </div>
                        <div className = "mb-3">
                            <div className = "form-check">
                                <input name = "showPW" type = "checkbox" className = "form-check-input purpCheck" id = "ShowPW" onChange = {handlePasswordShow}/>
                                <label className = "form-check-label" htmlFor = "Check" style = {{color: "#ffffff"}}>Show password</label>
                            </div>
                        </div>
                        <button type = "submit" className = "btn btn-primary purpBack">Edit Account</button>
                        <button type = "button" className = "btn btn-primary purpBack purpPad">Logout</button>
                        <button type = "button" className = "btn btn-primary purpBack purpPad" onClick = {() => setShowDel(userID)}>Delete Account</button>
                    </form>
                    <hr/>
                </div>
            </div>
            {showDel && createPortal(
            <div>
                <Warning base = {base} userDID = {showDel} setUserDID = {setShowDel}/>
            </div>, document.body)}
        </div>
    )
};

export default Settings
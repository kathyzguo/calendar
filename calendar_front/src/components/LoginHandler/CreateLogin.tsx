import type {LoginCreate, LoginCreateErrors} from '../../interfaces/LoginInterface.tsx'
import {useState} from 'react'
import {Link} from 'react-router-dom'

const CreateLogin = ({base}: {base: string}) => {
    const [formData, setFormData] = useState<LoginCreate>({name: "", email: "", password: ""});
    const [formErrors, setFormErrors] = useState<LoginCreateErrors>({});
    const [success, setSuccess] = useState("");
    const [showPW, setShowPW] = useState(false);

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
        if (!password) {
            newErrors.password = "Enter a password";
        }
        else if (password.length < 5) {
            newErrors.password = "Password must be at least 5 characters long";
        }
        setFormErrors(newErrors);
        return newErrors;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}))
        if (formErrors[name as keyof LoginCreateErrors]) {
            const newErrors = {...formErrors};
            delete newErrors[name as keyof LoginCreateErrors];
            setFormErrors(newErrors);
        }
    }

    const handlePasswordShow = () => {
        setShowPW(!showPW);
    }

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = checkLoginB(formData.name, formData.email, formData.password);
        if (Object.keys(errors).length > 0) {}
        else {
            try {
                const response = await fetch(`${base}/login/create`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(formData)
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
    <>
        <div style = {{minHeight: "100vh", minWidth: "100vw", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#9A6FFF"}}>
            <div className = "border border-5 rounded-3" style = {{width: "470px", padding: "20px", backgroundColor: "white"}}>
                <h2>Create Account</h2>
                {success.length > 1 && <h6 style = {{color: "#4400FF"}}>{success}</h6>}
                <form className = "px-4 py-3" noValidate onSubmit = {handleFormSubmission}>
                    <div className = "mb-3">
                        <label htmlFor = "Name" className = "form-label">Name</label>
                        <input name = "name" type = "text" className = "form-control purpText" id = "Name" placeholder = "Name" onChange = {handleInputChange}/>
                        {formErrors.name && <p className = "text-danger" style = {{paddingTop: "4px"}}>{formErrors.name}</p>}
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "Email" className = "form-label">Email address</label>
                        <input name = "email" type = "email" className = "form-control purpText" id = "Email" placeholder = "Email" onChange = {handleInputChange}/>
                        {formErrors.email && <p className = "text-danger" style = {{paddingTop: "4px"}}>{formErrors.email}</p>}
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "Password" className = "form-label">Password</label>
                        <input name = "password" type = {showPW ? "text" : "password"} className = "form-control purpText" id = "Password" placeholder = "Password" onChange = {handleInputChange}/>
                        {formErrors.password && <p className = "text-danger" style = {{paddingTop: "4px"}}>{formErrors.password}</p>}
                    </div>
                    <div className = "mb-3">
                        <div className = "form-check">
                            <input name = "showPW" type = "checkbox" className = "form-check-input purpCheck" id = "ShowPW" onChange = {handlePasswordShow}/>
                            <label className = "form-check-label" htmlFor = "Check">Show password</label>
                        </div>
                    </div>
                    <button type = "submit" className = "btn btn-primary purpBack">Create Account</button>
                </form>
                <hr/>
                <Link to = "/login">Go back to Login</Link>
            </div>
        </div>
    </>
    );
}

export default CreateLogin
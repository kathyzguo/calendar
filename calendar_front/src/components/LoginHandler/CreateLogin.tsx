import type {LoginCreate, LoginCreateErrors} from '../../interfaces/LoginInterface.tsx'
import {useState} from 'react'
import {Link} from 'react-router-dom'

const CreateLogin = ({base}: {base: string}) => {
    const [formData, setFormData] = useState<LoginCreate>({name: "", email: "", password: ""});
    const [formErrors, setFormError] = useState<LoginCreateErrors>({});

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
        setFormError(newErrors);
        return newErrors;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}))
        if (formErrors[name as keyof LoginCreateErrors]) {
            console.log(formErrors);
            setFormError(prev => ({...prev, [name]: undefined}));
        }
    }

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = checkLoginB(formData.name, formData.email, formData.password);
        if (Object.keys(errors).length > 0) {
            console.log(errors);
        }
        else {
            try {
                const response = await fetch(`${base}/login/create`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(formData)
                })
                console.log("passed?");
                const results = await response.json();
                if (response.ok) {
                    console.log(results);
                    console.log("YIPPE!");
                }
            }
            catch (err) {
                console.log("ERRRO");
                if (err instanceof Error) alert("Network Error: " + err.message);
            }
        }
    }

    return (
    <>
        <form noValidate onSubmit = {handleFormSubmission}>
            <input
                type = "name"
                id = "formName"
                name = "name"
                placeholder = "Name"
                onChange = {handleInputChange}
            />
            <input
                type = "email"
                id = "formEmail"
                name = "email"
                placeholder = "Email"
                onChange = {handleInputChange}
            />
            <input
                type = "password"
                id = "formPassword"
                name = "password"
                placeholder = "Password"
                onChange = {handleInputChange}
            />
            <button>Submit</button>
        </form>
        <Link to = "/">Go back to login</Link>
    </>
    );
}

export default CreateLogin
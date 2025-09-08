import type {LoginData, LoginErrors} from "../interfaces/LoginInterface.tsx"
import {useState} from "react"

const LoginInputs = () => {
    const base = "http://localhost:3000/api";
    const [formData, setFormData] = useState<LoginData>({email: "", password: "", stay: false});
    const [formErrors, setFormError] = useState<LoginErrors>({});

    const checkLoginB = (email: string, password: string) => {
        const newErrors: LoginErrors = {};
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
        if (formErrors[name as keyof LoginErrors]) {
            setFormError(prev => ({...prev, [name]: undefined}));
        }
    }
    const handleBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setFormData(prev => ({...prev, [name]: checked}));
    }
    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = checkLoginB(formData.email, formData.password);
        if (Object.keys(errors).length > 0) {
            console.log(errors);
        }
        else {
            try {
                const response = await fetch(`${base}/login`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(formData)
                })
                const results = await response.json();
                if (response.ok) {
                    console.log(results);
                }
            }
            catch (err) {
                if (err instanceof Error) {
                    alert("Network Error: " + err.message);
                }
                else {
                    alert("Network Error: " + String(err));
                }
            }
        }
    }

    return (
    <>
        <form noValidate onSubmit = {handleFormSubmission}>
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
            <input
                type = "checkbox"
                id = "formCheckbox"
                name = "stay"
                onChange = {handleBoxChange}
            />
            <button>Submit</button>
        </form>
    </>
    );
}

export default LoginInputs
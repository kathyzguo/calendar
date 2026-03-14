import type {GoalListed, GoalCatCreate} from "../../interfaces/GoalInterface"
import {useEffect, useState} from "react"
import {makeNewGoalCat} from "./GoalsAPI"

const CreateGoalCat = ({user_id, setUserID, base, goalL, setGoalL, allGoalL, setAllGoalL}: 
    {user_id: number | undefined, setUserID: (c: number | undefined) => void, base: string, 
    goalL: Set<GoalListed>, setGoalL: (c: Set<GoalListed>) => void,
    allGoalL: Set<GoalListed>, setAllGoalL: (c: Set<GoalListed>) => void}) => {
    const [errorTogether, setErrorTogether] = useState("");
    const [success, setSuccess] = useState("");
    const [createGC, setCreateGC] = useState<GoalCatCreate>(user_id ? {user_id: user_id, name: "", description: ""} :
        {user_id: 0, name: "", description: ""});

    useEffect(() => {
        if (user_id) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [])

    useEffect(() => {
        const keyEscHandle = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setUserID(undefined);
                document.body.style.overflow = "unset"
            }
        };
        document.addEventListener("keydown", keyEscHandle)
        return () => document.removeEventListener("keydown", keyEscHandle);
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCreateGC(prev => ({...prev, [name]: value}))
        if (errorTogether !== "") setErrorTogether("");
        if (success !== "") setSuccess("");
    }

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user_id) {
            if (createGC.name === "") {setErrorTogether("Please enter a name"); return}
            if (createGC.description === "") {setErrorTogether("Please enter a description"); return}
            setErrorTogether("");
            const newGL = await makeNewGoalCat(createGC, base, allGoalL);
            if (typeof newGL !== "string") {
                setGoalL(new Set(goalL));
                setAllGoalL(new Set(allGoalL));
                setSuccess("Goal category successfully created");
            }
            else setSuccess(newGL);
        }
    }

    return (
        user_id &&
        <div className = "popupDiv">
            <div className = "border border-5 rounded-3 popupContainer">
                <h2>Create Goal Category</h2>
                {success !== "" && <p style = {{color: "#4400FF"}}>{success}</p>}
                <form className = "px-4 py-3" noValidate onSubmit = {handleFormSubmission}>
                    {errorTogether !== "" && <p className = "text-danger">{errorTogether}</p>}
                    <div className = "mb-3">
                        <label htmlFor = "goalName" className = "form-label">Goal category name</label>
                        <input name = "name" type = "text" className = "form-control" id = "goalName" 
                        value = {createGC.name} onChange = {handleInputChange}/>
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "goalDesc" className = "form-label">Goal category description</label>
                        <input name = "description" type = "text" className = "form-control" id = "goalDesc" 
                        value = {createGC.description} onChange = {handleInputChange}/>
                    </div>
                    <button type = "submit" className = "btn btn-primary">Submit</button>
                </form>
                <hr/>
            </div>
        </div>
    )
}

export default CreateGoalCat
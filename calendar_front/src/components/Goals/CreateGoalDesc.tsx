import type {GoalListed, GoalDescCreate} from "../../interfaces/GoalInterface"
import {useEffect, useState} from "react"
import {makeNewGoalDesc} from "./GoalsAPI"

const CreateGoalDesc = ({goal_id, setGoalID, base, goalL, setGoalL, allGoalL, setAllGoalL}: 
    {goal_id: number | undefined, setGoalID: (c: number | undefined) => void, base: string, 
    goalL: Set<GoalListed>, setGoalL: (c: Set<GoalListed>) => void,
    allGoalL: Set<GoalListed>, setAllGoalL: (c: Set<GoalListed>) => void}) => {
    const [errorTogether, setErrorTogether] = useState("");
    const [success, setSuccess] = useState("");
    const [createGD, setCreateGD] = useState<GoalDescCreate>(goal_id ? {goal_id: goal_id, name: "", description: ""} 
        : {goal_id: 0, name: "", description: ""});

    useEffect(() => {
        if (goal_id) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [])

    useEffect(() => {
        const keyEscHandle = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setGoalID(undefined);
                document.body.style.overflow = "unset"
            }
        };
        document.addEventListener("keydown", keyEscHandle)
        return () => document.removeEventListener("keydown", keyEscHandle);
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCreateGD(prev => ({...prev, [name]: value}))
        if (errorTogether !== "") setErrorTogether("");
        if (success !== "") setSuccess("");
    }

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (goal_id) {
            if (createGD.name === "") {setErrorTogether("Please enter a name"); return}
            if (createGD.description === "") {setErrorTogether("Please enter a description"); return}
            setErrorTogether("");
            const newGL = await makeNewGoalDesc(createGD, base, allGoalL);
            if (typeof newGL !== "string") {
                setGoalL(new Set(goalL));
                setAllGoalL(new Set(allGoalL));
                setSuccess("Goal successfully created");
            }
            else setSuccess(newGL);
        }
    }

    return (
        goal_id &&
        <div className = "popupDiv">
            <div className = "border border-5 rounded-3 popupContainer">
                <h2>Create Goal</h2>
                {success !== "" && <p style = {{color: "#4400FF"}}>{success}</p>}
                <form className = "px-4 py-3" noValidate onSubmit = {handleFormSubmission}>
                    {errorTogether !== "" && <p className = "text-danger">{errorTogether}</p>}
                    <div className = "mb-3">
                        <label htmlFor = "goalName" className = "form-label">Goal name</label>
                        <input name = "name" type = "text" className = "form-control" id = "goalName" 
                        value = {createGD.name} onChange = {handleInputChange}/>
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "goalDesc" className = "form-label">Goal description</label>
                        <input name = "description" type = "text" className = "form-control" id = "goalDesc" 
                        value = {createGD.description} onChange = {handleInputChange}/>
                    </div>
                    <button type = "submit" className = "btn btn-primary">Submit</button>
                </form>
                <hr/>
            </div>
        </div>
    )
}

export default CreateGoalDesc
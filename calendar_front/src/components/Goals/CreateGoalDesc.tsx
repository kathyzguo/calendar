import type {GoalListed, GoalDescCreate} from "../../interfaces/GoalInterface"
import {useEffect, useState} from "react"
import {makeNewGoalDesc} from "./GoalsAPI"

const CreateGoalDesc = ({goal_id, base, goalL, setGoalL, allGoalL, setAllGoalL}: 
    {goal_id: number | undefined, base: string, 
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
        <div style = {{minHeight: "100vh", minWidth: "100vw", display: "flex", position: "fixed", top: "0", right: "0", left: "0", bottom: "0",
            zIndex: "4", justifyContent: "center", alignItems: "center", backgroundColor: "#00000097", border: "0"}}>
            <div className = "border border-5 rounded-3" style = {{width: "470px", padding: "20px", backgroundColor: "white", position: "relative",
                maxHeight: "650px", overflow: "scroll"}}>
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
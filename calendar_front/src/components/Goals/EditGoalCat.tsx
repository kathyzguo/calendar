import type {GoalListed, GoalCat} from "../../interfaces/GoalInterface"
import {useEffect, useState} from "react"
import {editGoalCat} from "./GoalsAPI"

const EditGoalCat = ({goal_info, base, goalL, setGoalL, allGoalL, setAllGoalL}: 
    {goal_info: GoalCat | undefined, base: string, 
    goalL: Set<GoalListed>, setGoalL: (c: Set<GoalListed>) => void,
    allGoalL: Set<GoalListed>, setAllGoalL: (c: Set<GoalListed>) => void}) => {
    const [errorTogether, setErrorTogether] = useState("");
    const [success, setSuccess] = useState("");
    const [goalSet, setGoalSet] = useState<GoalCat>(goal_info ? goal_info : {goal_id: 0, name: "", description: ""});

    useEffect(() => {
        if (goal_info) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setGoalSet(prev => ({...prev, [name]: value}))
        if (errorTogether !== "") setErrorTogether("");
        if (success !== "") setSuccess("");
    }

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (goal_info) {
            if (goalSet.name === "") {setErrorTogether("Please enter a name"); return}
            if (goalSet.description === "") {setErrorTogether("Please enter a description"); return}
            setErrorTogether("");
            const newG = await editGoalCat(goalSet, base, allGoalL, goalL);
            if (newG) {
                setGoalL(new Set(goalL));
                setAllGoalL(new Set(allGoalL));
                setSuccess("Goal category successfully edited");
            }
            else setSuccess("Unable to edit goal cateogry");
        }
    }

    return (
        goal_info &&
        <div style = {{minHeight: "100vh", minWidth: "100vw", display: "flex", position: "fixed", top: "0", right: "0", left: "0", bottom: "0",
            zIndex: "4", justifyContent: "center", alignItems: "center", backgroundColor: "#00000097", border: "0"}}>
            <div className = "border border-5 rounded-3" style = {{width: "470px", padding: "20px", backgroundColor: "white", position: "relative",
                maxHeight: "650px", overflow: "scroll"}}>
                <h2>Edit Goal Category</h2>
                {success !== "" && <p style = {{color: "#4400FF"}}>{success}</p>}
                <form className = "px-4 py-3" noValidate onSubmit = {handleFormSubmission}>
                    {errorTogether !== "" && <p className = "text-danger">{errorTogether}</p>}
                    <div className = "mb-3">
                        <label htmlFor = "goalName" className = "form-label">Goal cateogry name</label>
                        <input name = "name" type = "text" className = "form-control" id = "goalName" 
                        value = {goalSet.name} onChange = {handleInputChange}/>
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "goalDesc" className = "form-label">Goal category description</label>
                        <input name = "description" type = "text" className = "form-control" id = "goalDesc" 
                        value = {goalSet.description} onChange = {handleInputChange}/>
                    </div>
                    <button type = "submit" className = "btn btn-primary">Submit</button>
                </form>
                <hr/>
            </div>
        </div>
    )
}

export default EditGoalCat
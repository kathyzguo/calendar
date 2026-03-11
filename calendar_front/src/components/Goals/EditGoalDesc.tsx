import type {GoalListed, GoalDesc} from "../../interfaces/GoalInterface"
import {useEffect, useState} from "react"
import {editGoalDesc, deleteGoalDesc} from "./GoalsAPI"

const EditGoalDesc = ({goalDesc, base, goalL, setGoalL, allGoalL, setAllGoalL}: 
    {goalDesc: GoalDesc | undefined, base: string, 
    goalL: Set<GoalListed>, setGoalL: (c: Set<GoalListed>) => void,
    allGoalL: Set<GoalListed>, setAllGoalL: (c: Set<GoalListed>) => void}) => {
    const [errorTogether, setErrorTogether] = useState("");
    const [success, setSuccess] = useState("");
    const [goalSet, setGoalSet] = useState<GoalDesc>(goalDesc ? goalDesc : {id: 0, goal_id: 0, name: "", description: "", completed: false});
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        if (goalDesc) document.body.style.overflow = "hidden";
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
        if (goalDesc && !deleted) {
            if (goalSet.name === "") {setErrorTogether("Please enter a name"); return}
            if (goalSet.description === "") {setErrorTogether("Please enter a description"); return}
            setErrorTogether("");
            const newG = await editGoalDesc(goalSet, base, allGoalL);
            if (newG) {
                setGoalL(new Set(goalL));
                setAllGoalL(new Set(allGoalL));
                setSuccess("Goal successfully edited");
            }
            else setSuccess("Unable to edit goal");
        }
    }

    const handleDelete = async () => {
        const responseString: string = await deleteGoalDesc(goalSet.goal_id, goalSet.id, base, allGoalL);
        if (responseString === "Goal successfully deleted") {
            setGoalL(new Set(goalL));
            setAllGoalL(new Set(allGoalL));
        }
        setSuccess(responseString);
        setDeleted(true);
    }

    return (
        goalDesc &&
        <div style = {{minHeight: "100vh", minWidth: "100vw", display: "flex", position: "fixed", top: "0", right: "0", left: "0", bottom: "0",
            zIndex: "4", justifyContent: "center", alignItems: "center", backgroundColor: "#00000097", border: "0"}}>
            <div className = "border border-5 rounded-3" style = {{width: "470px", padding: "20px", backgroundColor: "white", position: "relative",
                maxHeight: "650px", overflow: "scroll"}}>
                <h2>Edit Goal</h2>
                {success !== "" && <p style = {{color: "#4400FF"}}>{success}</p>}
                <form className = "px-4 py-3" noValidate onSubmit = {handleFormSubmission}>
                    {errorTogether !== "" && <p className = "text-danger">{errorTogether}</p>}
                    <div className = "mb-3">
                        <label htmlFor = "goalName" className = "form-label">Goal name</label>
                        <input name = "name" type = "text" className = "form-control" id = "goalName" 
                        value = {goalSet.name} onChange = {handleInputChange}/>
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "goalDesc" className = "form-label">Goal description</label>
                        <input name = "description" type = "text" className = "form-control" id = "goalDesc" 
                        value = {goalSet.description} onChange = {handleInputChange}/>
                    </div>
                    <button style = {{marginRight: "12px"}} type = "submit" className = "btn btn-primary">Submit</button>
                </form>
                <br/>
                <button style = {{marginRight: "12px"}} className = "btn btn-primary" onClick = {() => handleDelete()}>Delete Goal</button>
                <hr/>
            </div>
        </div>
    )
}

export default EditGoalDesc
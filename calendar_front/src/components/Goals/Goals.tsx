import type {GoalListed, GoalCat, GoalCatCreate, GoalDesc, GoalDescCreate} from "../../interfaces/GoalInterface.tsx"
import {loadGoalCats, deleteGoalCat, editGoalDesc} from "./GoalsAPI"
import {createPortal} from "react-dom"
import {useRef, useEffect, useState} from "react"
import {useNavigate} from 'react-router-dom'
import Taskbar from "../Home/Taskbar"
import CreateGoalCat from "./CreateGoalCat";
import CreateGoalDesc from "./CreateGoalDesc";
import EditGoalCat from "./EditGoalCat"
import EditGoalDesc from "./EditGoalDesc";

const Goals = ({base, userID} : {base: string, userID: number}) => {
    const navigate = useNavigate();
    const [listOfGoalCats, setListOfGoalCats] = useState<Set<GoalListed>>(new Set<GoalListed>());
    const [activeGoalCats, setActiveGoalCats] = useState<Set<GoalListed>>(new Set<GoalListed>());
    const taskbarDiv = useRef<HTMLDivElement>(null);
    const [heightOfTask, setHeightOfTask] = useState(0);
    const [showCreateC, setShowCreateC] = useState<number | undefined>(undefined);
    const [showCreateD, setShowCreateD] = useState<number | undefined>(undefined);
    const [showEditC, setShowEditC] = useState<GoalCat | undefined>(undefined);
    const [showEditD, setShowEditD] = useState<GoalDesc | undefined>(undefined);
    
    useEffect(() => {
        if (userID === -1) {
            navigate("/");
        }
    }, [userID, navigate]); 

    useEffect(() => {
        const setGoalList = async () => {
            setListOfGoalCats(await loadGoalCats(userID, base))
        }
        setGoalList();
    }, []);

    useEffect(() => {
        if (taskbarDiv.current) setHeightOfTask(taskbarDiv.current.offsetHeight);
        const resizing = () => {
            if (taskbarDiv.current) setHeightOfTask(taskbarDiv.current.offsetHeight);
        }
        window.addEventListener("resize", resizing);
        return () => {
            window.removeEventListener("resize", resizing);
        }
    }, []);

    const handleEditCatSubmission = () => {
        if (activeGoalCats.size === 1) {
            for (const g of activeGoalCats) {
                setShowEditC({goal_id: g.goal_id, name: g.name, description: g.description});
            }
        }
    }

    const handleDeleteCatSubmission = async () => {
        if (activeGoalCats.size >= 1) {
            for (const c of activeGoalCats) {
                await deleteGoalCat(c.goal_id, base, listOfGoalCats, activeGoalCats);
            }
            setListOfGoalCats(new Set(listOfGoalCats));
            setActiveGoalCats(new Set(activeGoalCats));
        }
    }

    const handleCreateDescSubmission = () => {
        if (activeGoalCats.size === 1) {
            for (const g of activeGoalCats) {
                setShowCreateD(g.goal_id);
            }
        }
    }

    return (
        <div>
            <Taskbar type = {2}/>
            <div className = "forNav">
                <nav className = "leftnav" style = {{top: `${heightOfTask}px`}}>
                    <h2>Active Goal Categories</h2>
                    {Array.from(listOfGoalCats).sort((a, b) => a.goal_id - b.goal_id).map(c => (
                        <div className = "leftNavChange">
                            <label key = {"keyGoal" + c.goal_id} className = "overflow">
                                <input type = "checkbox" id = {"goal" + c.goal_id} onChange = {(e) => {
                                    for (const testC of listOfGoalCats) {
                                        if (testC.goal_id === c.goal_id) {
                                            const newActiveGoalCats = new Set<GoalListed>(activeGoalCats);
                                            (e.target.checked) ? newActiveGoalCats.add(testC) : newActiveGoalCats.delete(testC);
                                            setActiveGoalCats(newActiveGoalCats);
                                        }
                                    }
                                }}/>
                                {c.name}
                            </label>
                        </div>
                    ))}
                    <div className = "leftNavDiv" style = {{marginTop: "10px"}}>
                        <button onClick = {() => setShowCreateC(userID)}>Create goal category</button>
                    </div>
                    <div className = "leftNavDiv">
                        <button onClick = {() => handleEditCatSubmission()}>Edit selected goal category</button>
                    </div>
                    <div className = "leftNavDiv">
                        <button onClick = {() => handleDeleteCatSubmission()}>Delete selected goal categories</button>
                    </div>
                    <div className = "leftNavDiv">
                        <button onClick = {() => handleCreateDescSubmission()}>Create goal on selected category</button>
                    </div>  
                </nav>   
                <div className = "parentGoal">           
                    <div className = "goalTitle">
                        <h1>Uncompleted Goals:</h1>
                    </div>
                    {Array.from(activeGoalCats).sort((a, b) => a.goal_id - b.goal_id).map(c => (Array.from(c.goals).map(desc => 
                        (!desc.completed &&
                        <div className = "goalBlock" key = {c.goal_id + "keyGoal" + desc.id}>
                            <h3 onClick = {(e) => {setShowEditD(desc)}}>{desc.name}</h3>
                            <label>
                                {desc.description}
                                <input type = "checkbox" className = "goalCheck" onChange = {async (e) => {
                                    const changeCheck = await editGoalDesc({...desc, completed: true}, base, listOfGoalCats)
                                    if (changeCheck) {
                                        const newListOfGoalCats = new Set(listOfGoalCats)
                                        const newActiveGoalCats = new Set(activeGoalCats)
                                        setListOfGoalCats(newListOfGoalCats)
                                        setActiveGoalCats(newActiveGoalCats)
                                    }
                                }}/>
                                <div className = "goalCheckReal"><img src = "checkmark.png"/></div>
                            </label>
                        </div>)))
                    )}
                    <div className = "goalTitle">
                        <h1>Completed Goals:</h1>
                    </div>
                    {Array.from(activeGoalCats).sort((a, b) => b.goal_id - a.goal_id).map(c => (Array.from(c.goals).map(desc => 
                        (desc.completed &&
                        <div className = "goalBlock goalBlockCompleted" key = {c.goal_id + "keyGoal" + desc.id}>
                            <h3 onClick = {(e) => {setShowEditD(desc)}}>{desc.name}</h3>
                            <label>
                                {desc.description}
                                <input type = "checkbox" checked className = "goalCheck" onChange = {async (e) => {
                                    const changeCheck = await editGoalDesc({...desc, completed: false}, base, listOfGoalCats)
                                    if (changeCheck) {
                                        const newListOfGoalCats = new Set(listOfGoalCats)
                                        const newActiveGoalCats = new Set(activeGoalCats)
                                        setListOfGoalCats(newListOfGoalCats)
                                        setActiveGoalCats(newActiveGoalCats)
                                    }
                                }}/>
                                <div className = "goalCheckReal goalCheckCompleted"><img src = "checkmark.png"/></div>
                            </label>
                        </div>)))
                    )}
                </div>   
            </div>
            {showCreateC && createPortal(
                <div>
                    <CreateGoalCat user_id = {showCreateC} setUserID = {setShowCreateC} base = {base} goalL = {activeGoalCats} setGoalL = {setActiveGoalCats}
                    allGoalL = {listOfGoalCats} setAllGoalL = {setListOfGoalCats}/>
                </div>, document.body)}
            {showCreateD && createPortal(
                <div>
                    <CreateGoalDesc goal_id = {showCreateD} setGoalID = {setShowCreateD} base = {base} goalL = {activeGoalCats} setGoalL = {setActiveGoalCats}
                    allGoalL = {listOfGoalCats} setAllGoalL = {setListOfGoalCats}/>
                </div>, document.body)}
            {showEditC && createPortal(
                <div>
                    <EditGoalCat goal_info = {showEditC} setGoalCat = {setShowEditC} base = {base} goalL = {activeGoalCats} setGoalL = {setActiveGoalCats}
                    allGoalL = {listOfGoalCats} setAllGoalL = {setListOfGoalCats}/>
                </div>, document.body)}
            {showEditD && createPortal(
                <div>
                    <EditGoalDesc goalDesc = {showEditD} setGoalDesc = {setShowEditD} base = {base} goalL = {activeGoalCats} setGoalL = {setActiveGoalCats}
                    allGoalL = {listOfGoalCats} setAllGoalL = {setListOfGoalCats}/>
                </div>, document.body)}
        </div>
    )
};

export default Goals
import type {GoalListed, GoalCat, GoalCatCreate, GoalDesc, GoalDescCreate} from "../../interfaces/GoalInterface.tsx"
import {loadGoalCats, deleteGoalCat} from "./GoalsAPI"
import {useEffect, useState} from "react"
import {useNavigate} from 'react-router-dom'
import Taskbar from "../Home/Taskbar"

const Goals = ({base, userID} : {base: string, userID: number}) => {
    const navigate = useNavigate();
    const [listOfGoalCats, setListOfGoalCats] = useState<Set<GoalListed>>();
    const [activeGoalCats, setActiveGoalCats] = useState<Set<GoalListed>>();
    
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

    return (<Taskbar type = {2}/>)
};

export default Goals
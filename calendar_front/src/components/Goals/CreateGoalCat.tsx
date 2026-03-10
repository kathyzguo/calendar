import type {GoalListed} from "../../interfaces/GoalInterface"

const CreateGoalCat = ({user_id, base, goalL, setGoalL, allGoalL, setAllGoalL}: 
    {user_id: number | undefined, base: string, 
    goalL: Set<GoalListed>, setGoalL: (c: Set<GoalListed>) => void,
    allGoalL: Set<GoalListed>, setAllGoalL: (c: Set<GoalListed>) => void}) => {
    return (<div>{user_id}</div>)}

export default CreateGoalCat
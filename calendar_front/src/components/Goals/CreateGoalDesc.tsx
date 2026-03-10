import type {GoalListed} from "../../interfaces/GoalInterface"

const CreateGoalDesc = ({goal_id, base, goalL, setGoalL, allGoalL, setAllGoalL}: 
    {goal_id: number | undefined, base: string, 
    goalL: Set<GoalListed>, setGoalL: (c: Set<GoalListed>) => void,
    allGoalL: Set<GoalListed>, setAllGoalL: (c: Set<GoalListed>) => void}) => {
    return (<div>{goal_id}</div>)}

export default CreateGoalDesc
import type {GoalListed, GoalCatCreate} from "../../interfaces/GoalInterface"

const EditGoalCat = ({goal_info, base, goalL, setGoalL, allGoalL, setAllGoalL}: 
    {goal_info: GoalCatCreate | undefined, base: string, 
    goalL: Set<GoalListed>, setGoalL: (c: Set<GoalListed>) => void,
    allGoalL: Set<GoalListed>, setAllGoalL: (c: Set<GoalListed>) => void}) => {
    return (<div>{base}</div>)}

export default EditGoalCat
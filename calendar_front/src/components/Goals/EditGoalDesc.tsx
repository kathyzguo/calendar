import type {GoalListed, GoalDesc} from "../../interfaces/GoalInterface"

const EditGoalDesc = ({goalDesc, base, goalL, setGoalL, allGoalL, setAllGoalL}: 
    {goalDesc: GoalDesc | undefined, base: string, 
    goalL: Set<GoalListed>, setGoalL: (c: Set<GoalListed>) => void,
    allGoalL: Set<GoalListed>, setAllGoalL: (c: Set<GoalListed>) => void}) => {
    return (<div>{base}</div>)}

export default EditGoalDesc
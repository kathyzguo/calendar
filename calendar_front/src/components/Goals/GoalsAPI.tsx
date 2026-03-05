import type {GoalListed, GoalCat, GoalCatCreate, GoalDesc, GoalDescCreate} from "../../interfaces/GoalInterface"
    
const loadGoalCats = async (userID: number, base: string): Promise<Set<GoalListed>> => {
    try {
        const jsonObj = {user_id: userID};
        const response = await fetch(`${base}/goal/getGoalCat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(jsonObj)
        });
        const results = await response.json();
        if (response.ok && results.status) {
            const newGoalListed = new Set<GoalListed>();
            for (const goalCat of results.goals) {
                let {user_id, id, ...destructure} = goalCat;
                const getGoalDescs: GoalDesc[] = await getGoalDesc(id, base);
                let goalItem: GoalListed = {...destructure, goal_id: id, goals: getGoalDescs};
                newGoalListed.add(goalItem);
            };
            return newGoalListed;
        }
        else return new Set<GoalListed>();
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return new Set<GoalListed>();
    }    
}

const getGoalDesc = async (goalID: number, base: string): Promise<GoalDesc[]> => {
    try {
        const jsonObj = {goal_id: goalID};
        const response = await fetch(`${base}/goal/getGoalDesc`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(jsonObj)
        });
        const results = await response.json();
        if (response.ok && results.status) {
            const listOfGoals: GoalDesc[] = [];
            results.goal_details.forEach((goal: GoalDesc) => {
                listOfGoals.push(goal);
            });
            return listOfGoals;
        }
        return [];
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return [];
    }  
} 

const makeNewGoalCat = async (goalCat_info: GoalCatCreate, base: string, 
    listOfGoalCats: Set<GoalListed>): Promise<GoalListed | string> => {
    try {
        const response = await fetch(`${base}/goal/createGoalCat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(goalCat_info)
        });
        const results = await response.json();
        if (response.ok) {
            if (results.status) {
                const goalItem: GoalListed = {goal_id: results.goal_id, name: goalCat_info.name,
                    description: goalCat_info.description, goals: []};
                listOfGoalCats.add(goalItem);
                return goalItem;
            }
            else {
                return results.message;
            }
        }
        return "Unable to make goal category"
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return "Unable to make goal category"
    }
}

const editGoalCat = async (goalCat_info: GoalCat, base: string,
    listOfGoalCats: Set<GoalListed>, activeGoalCats: Set<GoalListed>): Promise<GoalListed | undefined> => {
    try {
        const response = await fetch(`${base}/goal/editGoalCat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(goalCat_info)
        });
        const results = await response.json();
        if (response.ok && results.status) {
            for (const goalCat of activeGoalCats) {
                if (goalCat.goal_id === goalCat_info.goal_id) {
                    const newGoalCat = {...goalCat, name: goalCat_info.name, description: goalCat_info.description};
                    listOfGoalCats.delete(goalCat);
                    listOfGoalCats.add(newGoalCat);
                    activeGoalCats.delete(goalCat);
                    activeGoalCats.add(newGoalCat);
                    return newGoalCat;
                }
            };
        }
        return undefined;
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return undefined;
    }
}

const deleteGoalCat = async (goal_id: number, base: string,
    listOfGoalCats: Set<GoalListed>, activeGoalCats: Set<GoalListed>): Promise<string> => {
    try {
        const jsonObj = {goal_id: goal_id};
        const response = await fetch(`${base}/goal/deleteGoalCat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(jsonObj)
        });
        const results = await response.json();
        if (response.ok && results.status) {
            for (const goalCat of activeGoalCats) {
                if (goalCat.goal_id === goal_id) {
                    listOfGoalCats.delete(goalCat);
                    activeGoalCats.delete(goalCat);
                    return "Goal category successfully deleted";
                }
            }
            return "Goal category could not be deleted";
        }
        else return "Goal category could not be deleted";
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return "Goal category could not be deleted";
    }
}

const makeNewGoalDesc = async (goalDesc_info: GoalDescCreate, base: string, 
    listOfGoalCats: Set<GoalListed>): Promise<GoalListed | string> => {
    try {
        const response = await fetch(`${base}/goal/createGoalDesc`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(goalDesc_info)
        });
        const results = await response.json();
        if (response.ok) {
            if (results.status) {
                for (const goalCat of listOfGoalCats) {
                    if (goalCat.goal_id === goalDesc_info.goal_id) {
                        const goalDesc = {...goalDesc_info, id: results.goalD_id, completed: false}
                        goalCat.goals.push(goalDesc);
                        return goalCat;
                    }
                }
            }
            else {
                return results.message;
            }
        }
        return "Unable to make goal";
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return "Unable to make goal";
    }
}

const editGoalDesc = async (goalDesc_info: GoalDesc, base: string,
    listOfGoalCats: Set<GoalListed>): Promise<GoalListed | undefined> => {
    try {
        const response = await fetch(`${base}/goal/editGoalDesc`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(goalDesc_info)
        });
        const results = await response.json();
        if (response.ok && results.status) {
            for (const goalCat of listOfGoalCats) {
                if (goalCat.goal_id === goalDesc_info.goal_id) {
                    for (const goalDesc of goalCat.goals) {
                        if (goalDesc.id === goalDesc_info.id) {
                            goalCat.goals[goalCat.goals.indexOf(goalDesc)] = goalDesc_info;
                        }
                    };
                    return goalCat;
                }
            };
        }
        return undefined;
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return undefined;
    }
}

const deleteGoalDesc = async (goal_id: number, goalDesc_id: number, base: string,
    listOfGoalCats: Set<GoalListed>): Promise<string> => {
    try {
        const jsonObj = {goalD_id: goalDesc_id};
        const response = await fetch(`${base}/goal/deleteGoalDesc`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(jsonObj)
        });
        const results = await response.json();
        if (response.ok && results.status) {
            for (const goalCat of listOfGoalCats) {
                if (goalCat.goal_id === goal_id) {
                    for (const goalDesc of goalCat.goals) {
                        if (goalDesc.id === goalDesc_id) {
                            goalCat.goals.splice(goalCat.goals.indexOf(goalDesc), 1);
                            return "Goal successfully deleted";
                        }
                    };
                }
            }
            return "Goal could not be deleted";
        }
        else return "Goal could not be deleted";
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return "Goal could not be deleted";
    }
}

export {loadGoalCats, makeNewGoalCat, editGoalCat, deleteGoalCat, makeNewGoalDesc, editGoalDesc, deleteGoalDesc};
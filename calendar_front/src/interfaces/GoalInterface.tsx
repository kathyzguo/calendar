export interface GoalListed {
    goal_id: number,
    name: string,
    description: string,
    goals: GoalDesc[];
}

export interface GoalCat {
    goal_id: number,
    name: string,
    description: string
}

export interface GoalDesc {
    id: number,
    goal_id: number,
    name: string,
    description: string,
    completed: boolean
}

export interface GoalCatCreate {
    user_id: number,
    name: string,
    description: string
}

export interface GoalDescCreate {
    goal_id: number,
    name: string,
    description: string
}
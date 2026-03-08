export type Priority = 'low' | 'medium' | 'high'

export interface Task {
    id: string
    title: string
    description: string
    priority: Priority
    completed: boolean
    createdAt: string
}

export type FilterType = 'all' | 'completed' | 'active'

export type CreateTaskInput = Pick<Task, 'title' | 'description' | 'priority'>

export type UpdateTaskInput = Partial<Omit<Task, 'id'>>

export interface TaskStats {
    total: number
    active: number
    completed: number
}

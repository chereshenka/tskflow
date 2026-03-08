import type { Task, FilterType, CreateTaskInput, UpdateTaskInput, TaskStats } from '../types'

export class TaskManager {
    private tasks: Task[] = []
    private static readonly STORAGE_KEY = 'tasks'
    constructor() {
        this.loadFromStorage()
    }
    addTask(input: CreateTaskInput): Task {
        const task = {
            ...input,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completed: false,
        }
        this.tasks.push(task)
        this.saveToStorage()
        return task
    }
    deleteTask(id: string): void {
        this.tasks = this.tasks.filter((task) => task.id !== id)
        this.saveToStorage()
    }
    toggleComplete(id: string): Task | undefined {
        const task = this.tasks.find((task) => task.id === id)
        if (task) {
            task.completed = !task.completed
            this.saveToStorage()
        }
        return task
    }
    getTasks(): Task[] {
        return [...this.tasks]
    }
    getFilteredTasks(filter: FilterType): Task[] {
        if (filter === 'all') return [...this.tasks]
        return this.tasks.filter((task) => (filter === 'active' ? !task.completed : task.completed))
    }
    getStats(): TaskStats {
        const active = this.getFilteredTasks('active')
        return { total: this.tasks.length, active: active.length, completed: this.tasks.length - active.length }
    }
    private saveToStorage(): void {
        localStorage.setItem(TaskManager.STORAGE_KEY, JSON.stringify(this.tasks))
    }
    private loadFromStorage(): void {
        const tasks = localStorage.getItem(TaskManager.STORAGE_KEY)
        this.tasks = tasks ? JSON.parse(tasks) : []
    }
    updateTask(taskId: string, input: UpdateTaskInput): Task | undefined {
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
        if (taskIndex === -1) return
        const updatedTask = { ...this.tasks[taskIndex], ...input }
        this.tasks[taskIndex] = updatedTask
        this.saveToStorage()
        return updatedTask
    }
}

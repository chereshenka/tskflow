import './style.css'
import { TaskManager } from './modules/taskManager'
import type { FilterType, Priority, TaskStats } from './types'

const tm = new TaskManager()
let currentFilter: FilterType = 'all'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) throw new Error('App element not found')

app.innerHTML = `
  <h1>TaskFlow</h1>
  
  <div id="stats">
    <div class="stat-card">
      <div class="stat-number" id="stat-total">0</div>
      <div class="stat-label">Total</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" id="stat-active">0</div>
      <div class="stat-label">Active</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" id="stat-completed">0</div>
      <div class="stat-label">Completed</div>
    </div>
  </div>

  <form id="task-form">
    <input type="text" id="task-input" placeholder="New task..." required>
    <select id="task-priority">
      <option value="low">Low</option>
      <option value="medium" selected>Medium</option>
      <option value="high">High</option>
    </select>
    <button type="submit">Add</button>
  </form>

  <div id="filters">
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="active">Active</button>
    <button class="filter-btn" data-filter="completed">Completed</button>
  </div>

  <div id="task-list"></div>
`

const taskInput = document.querySelector<HTMLInputElement>('#task-input')
const taskPriority = document.querySelector<HTMLSelectElement>('#task-priority')
const taskForm = document.querySelector<HTMLFormElement>('#task-form')
const taskList = document.querySelector<HTMLDivElement>('#task-list')
const filters = document.querySelector<HTMLDivElement>('#filters')

function isPriority(value: string): value is Priority {
    return value === 'low' || value === 'medium' || value === 'high'
}

function isFilterType(value: string): value is FilterType {
    return value === 'all' || value === 'active' || value === 'completed'
}

function renderTasks(): void {
    const tasks = tm.getFilteredTasks(currentFilter)
    const stats: TaskStats = tm.getStats()

    const total = document.querySelector<HTMLDivElement>('#stat-total')
    const active = document.querySelector<HTMLDivElement>('#stat-active')
    const completed = document.querySelector<HTMLDivElement>('#stat-completed')

    if (!total || !active || !completed) throw new Error('Task count element error')
    total.textContent = String(stats.total)
    active.textContent = String(stats.active)
    completed.textContent = String(stats.completed)

    if (!taskList) throw new Error('Some element not found')

    taskList.innerHTML = ''

    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-state">No tasks yet</p>'
        return
    }

    const fragment = document.createDocumentFragment()

    for (const task of tasks) {
        const div = document.createElement('div')
        div.className = 'task-item'
        if (task.completed) div.classList.add('completed')
        div.dataset.id = task.id

        const input = document.createElement('input')
        input.className = 'task-checkbox'
        input.type = 'checkbox'
        input.checked = task.completed

        const title = document.createElement('span')
        title.className = 'task-title'
        title.textContent = task.title

        const priority = document.createElement('span')
        priority.className = `task-priority ${task.priority}`
        priority.textContent = task.priority.toUpperCase()

        const button = document.createElement('button')
        button.className = 'task-delete'
        button.textContent = '×'

        div.append(input, title, priority, button)
        fragment.appendChild(div)
    }

    taskList.appendChild(fragment)
}

if (!taskForm) throw new Error('Some element not found')

taskForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!taskInput || !taskPriority) throw new Error('Some element not found')

    const title = taskInput.value.trim()
    if (!title) return

    const priority = taskPriority.value
    if (!priority || !isPriority(priority)) return

    tm.addTask({
        title,
        description: '',
        priority,
    })

    taskInput.value = ''
    taskInput.focus()
    renderTasks()
})

if (!filters) throw new Error('Some element not found')

filters.addEventListener('click', (e) => {
    const target = e.target
    if (!(target instanceof HTMLButtonElement)) return
    if (!target.classList.contains('filter-btn')) return
    if (target.classList.contains('active')) return

    const filter = target.dataset.filter
    if (!filter || !isFilterType(filter)) return

    filters.querySelector('.active')?.classList.remove('active')
    target.classList.add('active')
    currentFilter = filter
    renderTasks()
})

if (!taskList) throw new Error('Some element not found')

taskList.addEventListener('click', (e) => {
    const target = e.target
    if (!(target instanceof HTMLElement)) return
    const taskItem = target.closest('.task-item')
    if (!taskItem || !(taskItem instanceof HTMLDivElement)) return

    const id = taskItem.dataset.id
    if (!id) return

    if (target.classList.contains('task-checkbox')) {
        tm.toggleComplete(id)
    }

    if (target.classList.contains('task-delete')) {
        tm.deleteTask(id)
    }

    renderTasks()
})

renderTasks()
//sorrow

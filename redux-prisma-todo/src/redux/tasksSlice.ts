import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITask {
  id: string | null | undefined,
  title: string | null | undefined,
  description: string | null | undefined,
  important: boolean,
  complete: boolean,
  createdAt: string | null | undefined,
  updatedAt: string | null | undefined

}

export enum Statuses {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
}

type TaskStateType = {
  tasks: ITask[],
  status: Statuses
}



const initialState: TaskStateType = {
  tasks: [],
  status: Statuses.IDLE
}


const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<Statuses>) => {
      state.status = action.payload
    },
    setTasks: (state, action: PayloadAction<ITask[]>) => {
      state.tasks = (action.payload)
    },
    addTask: (state, action: PayloadAction<ITask>) => {
      state.tasks.push(action.payload)
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    },
    updateTask: (state, action: PayloadAction<ITask>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload }
      }
    }
  }
})


export const { setStatus, setTasks, addTask, removeTask, updateTask } = taskSlice.actions

export default taskSlice.reducer
'use client';
import TaskCard from "@/components/TaskCard";
import { RootState } from "@/redux/store";
import { Statuses, ITask, addTask, setStatus, setTasks } from "@/redux/tasksSlice";

import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";




export default function Home() {
  const tasks = useSelector((state: RootState) => state.tasks)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [adding, setAdding] = useState(false)


  const dispatch = useDispatch()
  console.log(tasks)

  async function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    try {
      if(!title || !description) return
      setAdding(true)

      const res = await axios.post('/api/tasks',
        {
          title,
          description
        }
      )
      dispatch(addTask(res.data.task))
      toast.success('Task added successfully!')
      setTitle('')
      setDescription('')
      setOpen(false)
    } catch (error) {
      console.log(`Add task error ${error}`)
      toast.error('Failed to add task!')
    } finally {
      setAdding(false)
    }
  }

  const fetchTasks = async () => {
    try {
      dispatch(setStatus(Statuses.LOADING))
      const res = await fetch('/api/tasks')
      const data = await res.json()
      const tasks = data.tasks

      dispatch(setTasks(tasks))
      if (res.ok) {
        dispatch(setStatus(Statuses.IDLE))
      } else {
        dispatch(setStatus(Statuses.ERROR))
      }

    } catch (error) {
      dispatch(setStatus(Statuses.ERROR))
    }
  }


  return (
    <div className="border  border-gray-700 bg-gray-800 w-full h-full p-3 rounded-md">
      {tasks.status == Statuses.LOADING &&
        <h1 className="text-2xl ml-6 mt-6">
          Loading tasks...
        </h1>
      }

      {tasks.status == Statuses.ERROR &&
        <div className="text-2xl ml-6 mt-6  flex flex-col items-start w-full">
          <h1 className="text-red-400">Failed to fetch tasks!</h1>
          <button
            onClick={() => fetchTasks()}
            className="bg-blue-500 px-4 py-1 rounded-md text-lg mt-3 cursor-pointer hover:scale-105 "
          >
            Retry
          </button>
        </div>

      }

      {
        tasks.status == Statuses.IDLE &&

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-10">
          {tasks.tasks?.map(task =>
            <TaskCard task={task} key={task.id} />
          )}

          <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger className='cursor-pointer'>
              <div className='cursor-pointer border border-gray-600 h-30 md:h-40 lg:h-50 bg-gray-700 rounded-md py-4 px-3 flex flex-col justify-center items-center hover:scale-105'>

                <h1 className="text-6xl">+</h1>
                <h1 className="text-xl">Add Task</h1>
              </div>
            </DialogTrigger>
            <DialogContent className='bg-gray-900 border-gray-600 text-gray-300'>
              <DialogHeader>
                <DialogTitle className='text-xl'>Add Task</DialogTitle>
                <div className='space-y-6'>
                  <div>
                    <label htmlFor="title"></label>
                    <input
                      id='title'
                      type="text"
                      className='mt-2 bg-gray-700 w-full px-3 py-2 rounded-md text-gray-300 text-lg focus:outline-none '
                      value={title}
                      placeholder="Task Title..."
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="description"></label>
                    <input
                      id='description'
                      placeholder="Task Description..."
                      type="text"
                      className='mt-2 bg-gray-700 w-full px-3 py-2 rounded-md text-gray-300 text-lg focus:outline-none '
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className='cursor-pointer w-full bg-blue-300 hover:bg-blue-400 py-2 rounded-md font-semibold mt-4 text-gray-900'
                  >
                    {adding ? 'Adding...' : 'Add Task'}
                  </button>

                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>



        </div>

      }
    </div>
  );
}

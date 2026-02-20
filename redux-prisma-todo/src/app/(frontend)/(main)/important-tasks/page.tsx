'use client';
import TaskCard from "@/components/TaskCard";
import { RootState } from "@/redux/store";
import { Statuses, ITask,setStatus, setTasks } from "@/redux/tasksSlice";

import { useDispatch, useSelector } from "react-redux";


export default function Home() {
    const tasks = useSelector((state: RootState) => state.tasks)
    console.log(tasks)

const dispatch = useDispatch()

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
                    {tasks.tasks?.map(task => {
                        if (task.important) {
                            return <TaskCard task={task} key={task.id} />
                        }
                    }

                    )}

                </div>

            }
        </div>
    );
}

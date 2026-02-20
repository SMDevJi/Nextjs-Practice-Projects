'use client';
import { ITask, removeTask, updateTask } from '@/redux/tasksSlice';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteSweep } from "react-icons/md";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const TaskCard = ({ task }: { task: ITask }) => {
    console.log(task)
    const [completing, setCompleting] = useState(false)
    const [editing, setEditing] = useState(false)
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState(task.title ?? '')
    const [description, setDescription] = useState(task.description ?? '')

    const dispatch = useDispatch()

    async function completeToggle(e: React.MouseEvent<HTMLButtonElement>) {
        try {
            if(completing) return
            setCompleting(true)
            const res = await axios.put('/api/tasks',
                { id: task.id, complete: !task.complete }
            )
            dispatch(updateTask(res.data.task))
            toast.success('Task updated successfully!')
        } catch (error) {
            console.log(`Toast complete failed ${error}`)
            toast.error('Failed to update task!')
        } finally {
            setCompleting(false)
        }
    }

    async function favToggle(e: React.MouseEvent<HTMLButtonElement>) {
        try {
            toast.info('Updating task...')
            const res = await axios.put('/api/tasks',
                { id: task.id, important: !task.important }
            )
            dispatch(updateTask(res.data.task))
            toast.success('Task updated successfully!')
        } catch (error) {
            console.log(`Task update failed ${error}`)
            toast.error('Failed to update task!')
        }
    }


    async function deleteTask(e: React.MouseEvent<HTMLButtonElement>) {
        try {
            toast.info('Deleting task...')
            const res = await axios.delete('/api/tasks',
                { data: { id: task.id } }
            )
            dispatch(removeTask(task.id as string))
            toast.success('Task deleted successfully!')
        } catch (error) {
            console.log(`Task delete failed ${error}`)
            toast.error('Failed to delete task!')
        }
    }

    async function handleEdit(e: React.MouseEvent<HTMLButtonElement>) {
        try {
            if(editing) return
            setEditing(true)

            const res = await axios.put('/api/tasks',
                {
                    id: task.id,
                    title,
                    description
                }
            )
            dispatch(updateTask(res.data.task))
            toast.success('Task edited successfully!')
            setOpen(false)
        } catch (error) {
            console.log(`Edit error ${error}`)
            toast.error('Failed to edit task!')
        } finally {
            setEditing(false)
        }
    }

    useEffect(() => {
        if (open) {
            setTitle(task.title ?? '')
            setDescription(task.description ?? '')
        }
    }, [open, task])

    return (
        <div className='border border-gray-600 h-35 md:h-40 lg:h-50 bg-gray-700 rounded-md py-4 px-3 flex flex-col justify-between '>
            <div className="con">
                <h1 className='text-xl'>{task.title}</h1>
                <h1 className='text-lg text-gray-400'>{task.description}</h1>
            </div>
            <div className="buttons flex justify-between pr-2">

                <button
                    className={`${task.complete ? 'bg-green-500' : 'bg-red-500'} px-3 py-2 rounded-md font-semibold cursor-pointer hover:scale-105`}
                    onClick={completeToggle}
                >
                    {completing ? 'Updating...' : ''}
                    {!completing &&

                        (task.complete ? 'Completed' : 'Incomplete')}
                </button>

                <div className="rest   flex justify-end items-center gap-2 ">
                    <button
                        className="fav cursor-pointer"
                        onClick={favToggle}
                    >
                        {task.important ?
                            <FaHeart color='red' size={25} />
                            :
                            <FaRegHeart size={25} />
                        }
                    </button>
                    <Dialog open={open} onOpenChange={setOpen} >
                        <DialogTrigger className='cursor-pointer'>
                            <CiEdit size={30} />
                        </DialogTrigger>
                        <DialogContent className='bg-gray-900 border-gray-600 text-gray-300'>
                            <DialogHeader>
                                <DialogTitle className='text-xl'>Update Task</DialogTitle>
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
                                            type="text"
                                            placeholder="Task Description..."
                                            className='mt-2 bg-gray-700 w-full px-3 py-2 rounded-md text-gray-300 text-lg focus:outline-none '
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        onClick={handleEdit}
                                        disabled={editing}
                                        className='cursor-pointer w-full bg-blue-300 hover:bg-blue-400 py-2 rounded-md font-semibold mt-4 text-gray-900'
                                    >
                                        {editing ? 'Updating...' : 'Save Changes'}
                                    </button>

                                </div>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                    <button
                        className='cursor-pointer'
                        onClick={deleteTask}
                    >
                        <MdOutlineDeleteSweep size={30} />
                    </button>

                </div>


            </div>
        </div>
    )
}

export default TaskCard
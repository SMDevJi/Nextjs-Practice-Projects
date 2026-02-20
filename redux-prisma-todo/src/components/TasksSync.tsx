'use client';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setStatus, setTasks, Statuses } from '@/redux/tasksSlice';


const TasksSync = () => {
    const tasks = useSelector((state: RootState) => state.tasks)
    console.log(tasks)

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                dispatch(setStatus(Statuses.LOADING))
                const res = await fetch('/api/tasks')
                const data = await res.json()
                const tasks=data.tasks
                
                dispatch(setTasks(tasks))
                if(res.ok){
                    dispatch(setStatus(Statuses.IDLE))
                }else{
                    dispatch(setStatus(Statuses.ERROR))
                }
                
            } catch (error) {
                dispatch(setStatus(Statuses.ERROR))
            }
        }
        fetchTasks()
     }, [])

    return null
}

export default TasksSync
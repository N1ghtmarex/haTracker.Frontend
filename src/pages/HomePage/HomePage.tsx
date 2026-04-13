import { useEffect, useState } from "react"
import type { Task } from '../../types/task'
import { getTaskList } from "../../services/task.service";
import TaskCard from "../../components/TaskCard/TaskCard";
import { AddTaskModal } from "../../components/AddTaskModal/AddTaskModal";

export default function HomePage() {
    const [selectedNavbarItem, setSelectedNavbarItem] = useState<string>(import.meta.env.VITE_TASK_TYPE_ID);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    const getTasks = async () => {
        const tasks = await getTaskList();

        setTasks(tasks.value.items);
    }
    useEffect(() => {
        getTasks();
    }, []);

    return (
        <>
        <div className="home-page">
            <button className="add" onClick={() => setShowAddModal(true)}>+</button>

            { showAddModal && (
                <AddTaskModal close={async () => { setShowAddModal(false); await getTasks(); }} type={selectedNavbarItem}></AddTaskModal>
            )
            }

            <div className="task-navbar">
                <div className={`task-navbar-item task ${selectedNavbarItem == import.meta.env.VITE_TASK_TYPE_ID ? 'active' : ''}`} 
                    onClick={() => setSelectedNavbarItem(import.meta.env.VITE_TASK_TYPE_ID)}>
                    <div className="icon">
                        ✅
                    </div>
                    <div className="title">
                        Задачи
                    </div>
                </div>

                <div className={`task-navbar-item daily ${selectedNavbarItem == import.meta.env.VITE_DAILY_TYPE_ID ? 'active' : ''}`} 
                    onClick={() => setSelectedNavbarItem(import.meta.env.VITE_DAILY_TYPE_ID)}>
                    <div className="icon">
                        📅
                    </div>
                    <div className="title">
                        Ежедневные
                    </div>
                </div>

                <div className={`task-navbar-item habit ${selectedNavbarItem == import.meta.env.VITE_HABIT_TYPE_ID ? 'active' : ''}`} 
                    onClick={() => setSelectedNavbarItem(import.meta.env.VITE_HABIT_TYPE_ID)}>
                    <div className="icon">
                        🎯
                    </div>
                    <div className="title">
                        Привычки
                    </div>
                </div>
            </div>

            <div className="task-cards">
                {
                    tasks
                    .filter(x => x.taskType.id == selectedNavbarItem)
                    .map((task) => (
                            <TaskCard key={task.id} task={task} />
                    ))
                }
            </div>
        </div>
        </>
    )
}
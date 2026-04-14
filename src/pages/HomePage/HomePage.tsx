import { useEffect, useState } from "react"
import type { Task } from '../../types/task'
import { getTaskList } from "../../services/task.service";
import TaskCard from "../../components/TaskCard/TaskCard";
import { AddTaskModal } from "../../components/AddTaskModal/AddTaskModal";
import Datepicker from "../../components/Datepicker/Datepicker";

export default function HomePage() {
    const [selectedNavbarItem, setSelectedNavbarItem] = useState<string>(import.meta.env.VITE_TASK_TYPE_ID);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [viewDate, setViewDate] = useState<string>(getToday())

    const getTasks = async () => {
        const tasks = await getTaskList();

        setTasks(tasks.value.items);
    }

    function getToday(): string {
        const date = new Date();

        return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    };

    function shiftDate(date: string, days: number): string {
        const parsedDate = new Date(date + "T00:00:00");

        parsedDate.setDate(parsedDate.getDate() + days);

        return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth()+1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`
    };

    function getDayName(date: string): string {
        const [y, m, d] = date.split('-').map(Number);

        return new Date(y, m - 1, d).toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "long"})
    }

    useEffect(() => {
        getTasks();
    }, []);

    return (
        <>
        <div className="home-page">
            <button className="add" onClick={() => setShowAddModal(true)}>+</button>

            <div className="datepicker">
                <button className="previos" onClick={() => setViewDate(shiftDate(viewDate, -1))}>‹</button>
                <button className="date" onClick={() => setShowCalendar(!showCalendar)} >📅 {viewDate == getToday() ? "Сегодня" : getDayName(viewDate.toString())}</button>
                <button className="next" onClick={() => setViewDate(shiftDate(viewDate, 1))}>›</button>
            </div>

            { showCalendar && (
                <Datepicker currentDate={viewDate} onClose={() => setShowCalendar(false)}
                    onSelect={(d: string) => { setViewDate(d); setShowCalendar(false); }}></Datepicker>
            )}

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
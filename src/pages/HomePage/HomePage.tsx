import { useEffect, useState } from "react";
import type { Task } from '../../types/task';
import { getTaskList } from "../../services/task.service";
import TaskCard from "../../components/TaskCard/TaskCard";
import { AddTaskModal } from "../../components/AddTaskModal/AddTaskModal";
import Datepicker from "../../components/Datepicker/Datepicker";
import { format, addDays, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export default function HomePage() {
    const [selectedNavbarItem, setSelectedNavbarItem] = useState<string>(import.meta.env.VITE_TASK_TYPE_ID);
    const [showAddModal, setShowAddModal] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    
    const [viewDate, setViewDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

    const fetchTasks = async () => {
        const dateObj = new Date(viewDate + "T00:00:00");
        const formattedDate = format(dateObj, "yyyy-MM-dd HH:mm:ss.SSS xx");

        const response = await getTaskList({
            date: formattedDate,
            taskTypeId: selectedNavbarItem
        });

        setTasks(response.value.items ?? []);
    };

    useEffect(() => {
        fetchTasks();
    }, [viewDate, selectedNavbarItem]);

    const handlePrevDay = () => setViewDate(format(addDays(new Date(viewDate), -1), "yyyy-MM-dd"));
    const handleNextDay = () => setViewDate(format(addDays(new Date(viewDate), 1), "yyyy-MM-dd"));
    const isToday = viewDate == format(new Date(), "yyyy-MM-dd");

    const displayDate = isToday 
        ? "Сегодня" 
        : format(parseISO(viewDate), "dd LLLL, EEEE", { locale: ru });

    return (
        <div className="home-page">
            <button className="add" onClick={() => setShowAddModal(true)}>+</button>

            <div className="datepicker">
                <button className="previos" onClick={handlePrevDay}>‹</button>
                <button className="date" onClick={() => setShowCalendar(prev => !prev)}>
                    📅 {displayDate}
                </button>
                <button className="next" onClick={handleNextDay}>›</button>
            </div>
            
            { !isToday && (
                <button className="home-set-today" onClick={() => setViewDate(format(new Date(), "yyyy-MM-dd"))}>Вернуться к сегодняшнему дню</button>
            )}

            {showCalendar && (
                <Datepicker 
                    currentDate={viewDate} 
                    onClose={() => setShowCalendar(false)}
                    onSelect={(d: string) => { 
                        setViewDate(d); 
                        setShowCalendar(false); 
                    }} 
                />
            )}

            {showAddModal && (
                <AddTaskModal 
                    close={() => setShowAddModal(false)} 
                    type={selectedNavbarItem} 
                />
            )}

            <div className="task-navbar">
                <div className={`task-navbar-item task ${selectedNavbarItem == import.meta.env.VITE_TASK_TYPE_ID ? 'active' : ''}`} 
                    onClick={() => setSelectedNavbarItem(import.meta.env.VITE_TASK_TYPE_ID)}>
                    <div className="icon">✅</div>
                    <div className="title">Задачи</div>
                </div>

                <div className={`task-navbar-item daily ${selectedNavbarItem == import.meta.env.VITE_DAILY_TYPE_ID ? 'active' : ''}`} 
                    onClick={() => setSelectedNavbarItem(import.meta.env.VITE_DAILY_TYPE_ID)}>
                    <div className="icon">📅</div>
                    <div className="title">Ежедневные</div>
                </div>

                <div className={`task-navbar-item habit ${selectedNavbarItem == import.meta.env.VITE_HABIT_TYPE_ID ? 'active' : ''}`} 
                    onClick={() => setSelectedNavbarItem(import.meta.env.VITE_HABIT_TYPE_ID)}>
                    <div className="icon">🎯</div>
                    <div className="title">Привычки</div>
                </div>
            </div>

            <div className="task-cards">
                {tasks.length == 0 ? (
                    <p className="empty-state">Нет задач на этот день</p>
                ) : (
                    tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onUpdate={fetchTasks}/>
                    ))
                )}
            </div>
        </div>
    );
}
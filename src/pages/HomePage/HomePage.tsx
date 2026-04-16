import { useEffect, useState } from "react";
import type { Task } from '../../types/task';
import { getTaskList, getTypesList } from "../../services/task.service";
import TaskCard from "../../components/TaskCard/TaskCard";
import { AddTaskModal } from "../../components/AddTaskModal/AddTaskModal";
import Datepicker from "../../components/Datepicker/Datepicker";
import { format, addDays, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import type { TaskType } from "../../types/taskType";
import Stats from "../../components/Stats/Stats";

export default function HomePage() {
    const [selectedNavbarItem, setSelectedNavbarItem] = useState<string>(import.meta.env.VITE_TASK_TYPE_ID);
    const [showAddModal, setShowAddModal] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [types, setTypes] = useState<TaskType[]>([]);
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

    const fetchTypes = async () => {

        const response = await getTypesList();

        setTypes(response.value.items ?? []);
    };

    useEffect(() => {
        if (selectedNavbarItem != "stats") {
            fetchTasks();
            fetchTypes();
        }
        else {
            setTasks([]);
        }
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
                    close={() => { setShowAddModal(false); fetchTasks() }} 
                    type={selectedNavbarItem}
                    date={viewDate}
                />
            )}

            <div className="task-navbar">
                { types.map(item => (
                    <>
                        <div className={`task-navbar-item ${selectedNavbarItem == item.id ? 'active' : ''}`} 
                            onClick={() => setSelectedNavbarItem(item.id)}>
                            <div className="icon">{ item.icon }</div>
                            <div className="title">{ item.name }</div>
                        </div>
                    </>
                ))
                }
                <div className={`task-navbar-item ${selectedNavbarItem == "stats" ? 'active' : ''}`} 
                    onClick={() => setSelectedNavbarItem("stats")}>
                    <div className="icon">📊</div>
                    <div className="title">Статистика</div>
                </div>
            </div>

            <div className="task-cards">
                {tasks.length == 0 && selectedNavbarItem != 'stats' ? (
                    <div className="empty">
                        <div className="icon">
                            {`${selectedNavbarItem == import.meta.env.VITE_TASK_TYPE_ID ? '✅' 
                                : `${selectedNavbarItem == import.meta.env.VITE_DAILY_TYPE_ID ? '📅' : '🎯'}`}`}</div>
                        <div className="text">
                            <div className="title">Пока пусто</div>
                            <div className="description">Нажмите «+» чтобы добавить</div>
                        </div>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskCard key={`${viewDate}-${task.id}`} task={task} date={viewDate} onUpdate={fetchTasks}/>
                    ))
                )}
            </div>

            { selectedNavbarItem == 'stats' && (
                <Stats></Stats>
            )
            }
        </div>
    );
}
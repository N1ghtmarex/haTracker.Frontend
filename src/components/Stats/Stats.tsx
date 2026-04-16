import { eachDayOfInterval, endOfMonth, startOfMonth, format, isToday, getDay } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { getTasksCompletions } from "../../services/task.service";
import type { TaskCompletion } from "../../types/taskCompletion";
import { ru } from "date-fns/locale";

export default function Stats() {
    const [tasks, setTasks] = useState<TaskCompletion[]>([]);
    const currentDate = useMemo(() => new Date(), []);

    const calendarData = useMemo(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const days = eachDayOfInterval({ start, end });

        const dayOfWeek = getDay(start);
        const startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        return {
            days,
            startOffset,
            monthName: format(currentDate, 'LLLL', { locale: ru}),
            year: format(currentDate, 'yyyy')
        };
    }, [currentDate]);

    useEffect(() => {
        fetchCompletions();
    }, []);

    const fetchCompletions = async () => {
        try {
            const response = await getTasksCompletions();

            setTasks(response?.value?.items ?? []);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="stats-wrapper">
            <div className="stats-header">
                <h2 className="stats-title">Статистика</h2>
                <span className="month-label">{calendarData.monthName} {calendarData.year}</span>
            </div>

            <div className="habits-list">
                {tasks.map((task) => {
                    const completionCount = task.completions?.length || 0;
                    const totalDays = calendarData.days.length;
                    const percent = totalDays > 0 ? Math.round((completionCount / totalDays) * 100) : 0;
                    const color = task.color?.value || '667eea';

                    return (
                        <div key={task.id} className="habit-stat">
                            <div className="header">
                                <div className="info">
                                    <div className="icon">{task.emoji?.value || '📌'}</div>
                                    <div className="text">
                                        <div className="title">{task.title}</div>
                                        <div className="meta">
                                            {task.targetValue ? `Цель: ${task.targetValue}` : 'Без цели'}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="progress-circle"
                                    style={{
                                        background: `conic-gradient(#${color} ${percent * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
                                    }}
                                >
                                    <span className="progress-inner">
                                        <span className="text">{percent}%</span>
                                    </span>
                                </div>
                            </div>

                            <div className="calendar-container">
                                <div className="days-header">
                                    <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
                                </div>
                                <div className="days">
                                    {Array.from({ length: calendarData.startOffset }).map((_, i) => (
                                        <div key={`empty-${i}`} className="day empty" />
                                    ))}

                                    {/* Days */}
                                    {calendarData.days.map((day) => {
                                        const dateStr = format(day, 'yyyy-MM-dd');
                                        const record = task.completions?.find(c => {
                                            return c.date.toString().startsWith(dateStr);
                                        });

                                        const isDone = record && (
                                            task.targetValue > 0
                                                ? record.currentValue >= task.targetValue
                                                : record.isCompleted
                                        );

                                        return (
                                            <div
                                                key={dateStr}
                                                className={`day ${isDone ? 'done' : ''} ${isToday(day) ? 'today' : ''}`}
                                                style={isDone ? { backgroundColor: `#${color}`, borderColor: `#${color}` } : {}}
                                                title={`${dateStr}: ${isDone ? 'Выполнено' : 'Не выполнено'}`}
                                            >
                                                {format(day, 'd')}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="streak-row">
                                <div className="streak-item">
                                    <span className="s-icon">🔥</span>
                                    <div className="s-text">
                                        <span className="s-value">{task.currentStreak || 0}</span>
                                        <span className="s-label">Текущая</span>
                                    </div>
                                </div>
                                <div className="streak-divider" />
                                <div className="streak-item">
                                    <span className="s-icon">⭐</span>
                                    <div className="s-text">
                                        <span className="s-value">{task.maxStreak || 0}</span>
                                        <span className="s-label">Рекорд</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

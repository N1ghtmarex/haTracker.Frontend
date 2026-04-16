import { useEffect, useState } from "react";
import type { Task } from "../../types/task";
import { completeTask } from "../../services/task.service";

export interface TaskCardProps {
    task: Task;
    onUpdate: () => void;
    date: string;
}

export default function TaskCard({ task, onUpdate, date }: TaskCardProps) {
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState(task.currentValue ?? 0);

    const handleIncrease = async () => {
        const newValue = inputValue + 1;
        setInputValue(newValue);
        await completeTask(task.id, newValue, new Date(date + "T13:00:00").toISOString());
        onUpdate();
    }
    const handleDecrease = async () => {
        const newValue = Math.max(0, inputValue - 1);
        setInputValue(newValue);
        await completeTask(task.id, newValue, new Date(date + "T13:00:00").toISOString());
        onUpdate();
    }

    const handleConfirm = async () => {
        try {
            await completeTask(task.id, inputValue, new Date(date + "T13:00:00").toISOString());
            setShowInput(false);
            onUpdate();
        } catch (error) {
            console.error("Ошибка обновления задачи:", error);
        }
    };

    const handleCancel = () => {
        setShowInput(false);
        setInputValue(task.currentValue ?? 0);
    };

    const handleCompleteClick = async () => {
        const newValue = task.targetValue == inputValue ? 0 : task.targetValue;
        setInputValue(newValue);

        await completeTask(task.id, newValue, new Date(date + "T13:00:00").toISOString());
        onUpdate();
    };

    const toggleInput = () => {
        setShowInput(prev => !prev);
        setInputValue(task.currentValue ?? 0);
    };
    const progressPercent = task.targetValue > 0 
        ? Math.min(100, (task.currentValue / task.targetValue) * 100) 
        : 0;

    useEffect(() => {
        setInputValue(task.currentValue ?? 0);
    }, [task.currentValue]); 

    return (
        <div className={`task-card ${task.isCompleted ? 'completed' : ''}`}>
            <div className="top-border" style={{ backgroundColor: `#${task.color.value}` }} />
            <div className="card-content">
                <div className="task-icon" onClick={async () => await handleCompleteClick()}>
                    {task.emoji ? task.emoji.value : task.isCompleted ? "✅" : "⬜"}
                </div>
                <div className="card-center">
                    <div className="task-title">{task.title}</div>
                    
                    {task.trackingType === "Unit" && (
                        <>
                            <div className="progress">
                                <div className="text">
                                    {task.currentValue} / {task.targetValue} {task.unit?.shortName || ""}
                                </div>
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-line" 
                                    style={{ 
                                        width: `${progressPercent}%`,
                                        backgroundColor: `#${task.color.value}` 
                                    }} 
                                />
                            </div>
                            <div className="progress-buttons">
                                <button 
                                    type="button" 
                                    disabled={inputValue <= 0} 
                                    className="decrease" 
                                    onClick={async () => await handleDecrease()}
                                    style={{ color: `#${task.color.value}`, border: `1px solid #${task.color.value}` }}
                                >-</button>
                                <button 
                                    type="button" 
                                    className="increase" 
                                    onClick={async () => await handleIncrease()}
                                    style={{ background: `#${task.color.value}` }}
                                >+</button>

                                {!showInput ? (
                                    <button 
                                        type="button" 
                                        className="input" 
                                        onClick={toggleInput}
                                        style={{ color: `#${task.color.value}`, border: `1px solid #${task.color.value}` }}
                                    >⌨️ Ввести</button>
                                ) : (
                                    <>
                                        <input 
                                            className="input-value" 
                                            type="number" 
                                            placeholder="Значение" 
                                            value={inputValue} 
                                            min={0} 
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                if (!isNaN(val)) setInputValue(val);
                                            }}
                                            style={{ border: `1px solid #${task.color.value}` }}
                                        />
                                        <button 
                                            type="button" 
                                            className="confirm" 
                                            onClick={handleConfirm}
                                            style={{ background: `#${task.color.value}` }}
                                        >✓</button>
                                        <button 
                                            type="button" 
                                            className="cancel" 
                                            onClick={handleCancel}
                                            style={{ border: `1px solid #${task.color.value}` }}
                                        >✕</button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
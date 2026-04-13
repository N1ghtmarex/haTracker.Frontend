import { useState } from "react";
import type { Task } from "../../types/task";

export interface TaskCardProps {
    task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<number>(0);

    const handleConfirm = () => {
        task.currentValue = inputValue;
        setShowInput(false);
    }

    return(
        <>
        <div className="task-card">
            <div className="top-border" style={{ backgroundColor: `#${task.color.value }`}}></div>
            <div className="card-content">
                <div className="task-icon">
                    {task.emoji == null ?
                        task.isCompleted ? "✅" : "⬜" 
                            : task.emoji.value}
                </div>
                <div className="card-center">
                    <div className="task-title">
                        {task.title}
                    </div>
                    { task.trackingType == "Unit" && (
                        <>
                        <div className="progress">
                            <div className="text">{task.currentValue} / {task.targetValue} {task.unit.shortName}.</div>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-line"></div>
                        </div>
                        <div className="progress-buttons">
                            <button className="decrease" style={{color: `#${task.color.value}`, border: `1px solid #${task.color.value}`}}>-</button>
                            <button className="increase" style={{background: `#${task.color.value}`}}>+</button>

                            {   !showInput && (
                                <button className="input" style={{color: `#${task.color.value}`, border: `1px solid #${task.color.value}` }}
                                    onClick={() => setShowInput(true)}>⌨️ Ввести</button>
                            )
                            }
                            { showInput && (
                                <>
                                    <input className="input-value" type="number" placeholder="Значение" value={inputValue} 
                                        min={0} onChange={(e) => setInputValue(Number(e.target.value))}
                                        style={{border: `1px solid #${task.color.value}`}}>
                                    </input>
                                    <button className="confirm" onClick={() => handleConfirm()}
                                        style={{background: `#${task.color.value}`}}>✓</button>
                                    <button className="cancel" onClick={() => setShowInput(false)}
                                        style={{border: `1px solid ${task.color.value}`}}>✕</button>
                                </>
                            )
                            }
                            

                        </div>
                        </>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}
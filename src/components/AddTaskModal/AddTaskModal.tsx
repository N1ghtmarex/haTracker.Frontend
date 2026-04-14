import type { AddTaskModel } from "../../types/addTaskModel"
import { useEffect, useState } from "react"
import type { Emoji } from "../../types/emoji"
import { getEmojiList } from "../../services/emoji.service"
import { getColorList } from "../../services/color.service"
import type { Unit } from "../../types/unit"
import { getUnitList } from "../../services/unit.service"
import type { Color } from "../../types/color"
import { addTask } from "../../services/task.service"

export interface AddTaskModalProps {
    close: Function
    type: string,
    date: string
}

export function AddTaskModal({ close, type, date } : AddTaskModalProps) {
    const [title, setTitle] = useState<string>("");

    const [emojiList, setEmojiList] = useState<Emoji[]>([]);
    const [emoji, setEmoji] = useState<Emoji>();
    const [showIcons, setShowIcons] = useState<boolean>(false);

    const [colorList, setColorList] = useState<Emoji[]>([]);
    const [selectedColor, setSelectedColor] = useState<Color>();

    const [unitList, setUnitList] = useState<Unit[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string>("");
    const [selectedTargetValue, setSelectedTargetValue] = useState<number>(1);
    const [trackingType, setTrackingType] = useState<string>("Boolean");

    const getEmojis = async () => {
        const emojis = await getEmojiList();
    
        setEmojiList(emojis.value.items);
    };

    const getColors = async () => {
        const colors = await getColorList();
    
        setColorList(colors.value.items);
    };

    const getUnits = async () => {
        const units = await getUnitList();
    
        setUnitList(units.value.items);
    };

    const handleAddTask = async () => {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        const [y, m, d] = date.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d, currentHours, currentMinutes, 0, 0);

        const formattedDate = dateObj.toISOString();

        const request: AddTaskModel = {
            taskTypeId: type,
            title: title,
            emojiId: emoji?.id ?? null,
            colorId: selectedColor?.id ?? import.meta.env.VITE_DEFAULT_COLOR_ID,
            trackingType: trackingType,
            unitId: selectedUnit != "" ? selectedUnit : null,
            targetValue: selectedUnit != "" ? selectedTargetValue : 0,
            date: formattedDate
        };

        await addTask(request);

        await close();
    };

    useEffect(() => {
        getEmojis();
        getColors();
        getUnits();
    }, []);

    return(
        <>
        <div className="modal-outer">
            <div className="add-modal-container">
                <div className="form-group">
                    <div className="label">Название</div>
                    <input className="input" type="text" required placeholder="Название..." value={title} 
                        onChange={(e) => setTitle(e.target.value)}>
                    </input>
                </div>
                { type != import.meta.env.VITE_TASK_TYPE_ID && (
                    <>
                        <div className="form-group">
                            <div className="label">Иконка</div>
                            <div className="icon-input" onClick={() => setShowIcons(!showIcons)}>
                                <div className="icon-preview">{ emoji?.value }</div>
                                <div className="select-icon-placeholder">Нажмите чтобы выбрать иконку</div>
                            </div>
                            { showIcons && (
                                <div className="icons">
                                { emojiList.map((item) => (
                                    <button key={item.id} className={`emoji ${emoji?.id == item.id ? "selected" : ""}`} onClick={() => { setEmoji(item); setShowIcons(false);}}>
                                        { item.value }
                                    </button>
                                ))
                                }
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="form-group">
                    <div className="label">Цвет</div>
                    <div className="colors">
                    { colorList.map((item) => (
                        <button key={item.id} className={`color ${item.id == selectedColor?.id ? "selected" : ""}`}
                        style={{background: `#${item.value}`}} onClick={() => setSelectedColor(item)}></button>
                    ))
                    }
                    </div>
                </div>

                <div className="form-group">
                    <div className="label">Тип отметки</div>
                    <div className="tracking-type">
                        <button className={trackingType == "Boolean" ? "selected" : ""}
                                onClick={() => setTrackingType("Boolean")}>
                            ✅ Да / Нет
                        </button>
                        <button className={trackingType == "Unit" ? "selected" : ""}
                                onClick={() => setTrackingType("Unit")}>
                            📊 Единицы
                        </button>
                    </div>
                </div>

                { trackingType == "Unit" && (
                    <>
                        <div className="form-group">
                            <div className="label">Единица измерения</div>
                            <select className="units" value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                                <option value={""}>Выберите единицу измерения</option>
                                { unitList.map((unit) => (
                                    <option key={unit.id} value={unit.id}>{unit.name} ({unit.shortName}.)</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <div className="label">Цель</div>
                            <input className="target-value" type="number" min={1} value={selectedTargetValue}
                                onChange={(e) => setSelectedTargetValue(Number(e.target.value))}></input>
                        </div>
                    </>
                )}

                <div className="modal-buttons">
                    <button className="close-modal" onClick={() => close()}>Отмена</button>
                    <button className="add-modal" 
                    disabled={title == "" || (emoji == undefined && type != import.meta.env.VITE_TASK_TYPE_ID) || selectedColor == undefined || (trackingType == "Unit" && (selectedUnit == ""))}
                    onClick={handleAddTask}
                    >Создать</button>
                </div>
            </div>
        </div>
        </>
    )
}
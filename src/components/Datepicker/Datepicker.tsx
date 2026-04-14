import { useState, useMemo } from "react"

export interface DatepickerProps {
    currentDate: string,
    onClose: () => void,
    onSelect: (date: string) => void
}

export default function Datepicker({ currentDate, onClose, onSelect }: DatepickerProps) {
    const [initYear, initMonth] = useMemo(() => {
        const [y, m] = currentDate.split("-").map(Number);
        return [y, m - 1];
    }, [currentDate]);

    const [viewDate, setViewDate] = useState({ year: initYear, month: initMonth });

    const daysInMonth = useMemo(() => {
        return new Date(viewDate.year, viewDate.month + 1, 0).getDate();
    }, [viewDate]);

    const startOffset = useMemo(() => {
        const day = new Date(viewDate.year, viewDate.month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    }, [viewDate]);

    const daysGrid = useMemo(() => {
        const arr: (string | null)[] = [];
        for (let i = 0; i < startOffset; i++) arr.push(null);
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            arr.push(dateStr);
        }
        return arr;
    }, [startOffset, daysInMonth, viewDate]);

    const getToday = (): string => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const getMonthName = (): string => {
        const name = new Date(viewDate.year, viewDate.month).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const prevMonth = () => setViewDate(prev =>
        prev.month === 0 ? { year: prev.year - 1, month: 11 } : { ...prev, month: prev.month - 1 }
    );

    const nextMonth = () => setViewDate(prev =>
        prev.month === 11 ? { year: prev.year + 1, month: 0 } : { ...prev, month: prev.month + 1 }
    );

    function getDayNameShort(dateStr: string) {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "long" });
    }

    return (
        <div className="datepicker-outer" onClick={onClose}>
            <div className="datepicker-modal" onClick={e => e.stopPropagation()}>
                <div className="navigation">
                    <button className="previos" onClick={prevMonth}>‹</button>
                    <button className="date">{getMonthName()}</button>
                    <button className="next" onClick={nextMonth}>›</button>
                </div>
                <div className="days-grid">
                    {daysGrid.map((dateStr, idx) => {
                        if (!dateStr) return <div key={`empty-${idx}`} className="day empty" />;
                        
                        const isSelected = dateStr === currentDate;
                        const isTodayDate = dateStr === getToday();
                        const isFuture = dateStr > getToday();

                        return (
                            <button
                                key={dateStr}
                                className={`day ${isTodayDate ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isFuture ? 'future' : ''}`}
                                onClick={() => onSelect(dateStr)}
                            >
                                {parseInt(dateStr.split("-")[2], 10)}
                            </button>
                        );
                    })}
                </div>
                <button className="set-today" onClick={() => onSelect(getToday())}>Сегодня ({getDayNameShort(getToday())})</button>
            </div>
        </div>
    )
}
import {useEffect, useState} from "react";
import {Mode, TimeConfig} from "../global/types";

export interface TimerControlProps {
    mode: Mode,
    disabled?: boolean
    onChange?: (timeConfig: TimeConfig) => void
}


interface TimerMenuProps {
    title: string
    initialValue: number
    disabled?: boolean
    onChange: (num: number) => void
}

const TimerMenu = ({
                       title,
                       initialValue,
                       disabled,
                       onChange
                   }: TimerMenuProps) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue]);

    return (
        <div className="flex gap-2">
            <span className="grow font-bold text-blue-500">{title}</span>
            <div className="flex items-center justify-center gap-2">
                <label className="border rounded-md px-2 py-1 focus-within:border-blue-500 focus-within:border-2">
                    <input
                        readOnly={disabled ? disabled : false}
                        type="number"
                        className="text-center w-full focus:outline-none focus:border-none h-full disabled:bg-white"
                        min={0}
                        max={36000}
                        value={value}
                        onClick={(event) => {
                            if(disabled){
                                event.preventDefault()
                                event.currentTarget.blur()
                                alert("타이머가 작동 중엔 시간을 수정 할 수 없습니다.");
                            }
                        }}
                        onChange={(event) => {
                            const current = event.currentTarget.value;
                            const newValue = current ? parseInt(current) : 0;
                            if (newValue != value) {
                                setValue(newValue);
                                onChange(newValue);
                            }
                            event.currentTarget.value = newValue.toString()
                        }}
                    />
                </label>
                <span>초</span>
            </div>
        </div>
    )
}

const TimerControl = ({
                          mode,
                          onChange,
                          disabled
                      }: TimerControlProps) => {
    const [timeConfig, setTimeConfig] = useState(mode.option);

    useEffect(() => {
        setTimeConfig(mode.option);
    }, [mode]);

    return (
        <div className="flex flex-col gap-1 border-2 border-blue-300 px-2 py-1 rounded-md">
            <h3 className="font-bold pb-2 text-center text-blue-500 text-xl border-b">시간 설정</h3>
            <div className="py-2 flex flex-col gap-1">
                <TimerMenu
                    title="준비시간"
                    disabled={disabled}
                    onChange={(num) => {
                        const updated = {
                            prepareTime: num,
                            runTime: timeConfig.runTime
                        }
                        setTimeConfig(updated)
                        if (onChange) {
                            onChange(updated)
                        }
                    }} initialValue={mode.option.prepareTime}/>
                <TimerMenu
                    title="진행 시간"
                    disabled={disabled}
                    onChange={(num) => {
                        const updated = {
                            prepareTime: timeConfig.prepareTime,
                            runTime: num
                        }
                        setTimeConfig(updated)
                        if (onChange) {
                            onChange(updated)
                        }
                    }} initialValue={mode.option.runTime}/>
            </div>
        </div>
    )
}

export default TimerControl

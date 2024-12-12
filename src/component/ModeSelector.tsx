import {useMemo} from "react";
import {DefaultModes} from "../config/ModeConfig";
import {Mode} from "../global/types";

export interface ModeSelectorProps {
    onModeChange?: (mode: Mode) => void
}

const ModeSelector = ({
                          onModeChange
                      }: ModeSelectorProps) => {
    const modes = useMemo(() => {
        return DefaultModes.map((item, index) => {
            return <option value={index} key={index}>{item.name}</option>
        })
    }, []);


    return (
        <div className="w-full flex flex-col justify-center items-center gap-2">
            <h2 className="font-bold whitespace-nowrap break-keep text-2xl">모드</h2>
            <label className="px-2 py-1 rounded border-2 w-full focus-within:border-2 focus-within:border-blue-600">
                <select
                    id="modeSelection"
                    className="focus:outline-none focus:border-none w-full text-center"
                    onChange={(item) => {
                        if (onModeChange) {
                            const mode = DefaultModes[item.currentTarget.value];
                            onModeChange(mode)
                        }
                    }}>
                    {modes}
                </select>
            </label>
        </div>
    )
}

export default ModeSelector

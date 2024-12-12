import React, {useCallback, useEffect, useState} from 'react';
import ModeSelector from "./component/ModeSelector";
import {DefaultModes} from "./config/ModeConfig";
import TimerControl from "./component/TimerControl";
import {Mode} from "./global/types";
import Timer from "./component/Timer";

const App = () => {
    const [mode, setMode] = useState(DefaultModes[0]);
    const [isRunning, setIsRunning] = useState(false);
    const [timeConfig, setTimeConfig] = useState(mode.option);

    const renderPage = useCallback((mode: Mode) => {
        return <>{mode.name}</>
    }, [])

    return (
        <div className="w-full h-full p-2 font-sans flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-center pb-2.5">TOEFL UTILITIES</h1>
            <div className="flex flex-col gap-2">
                <ModeSelector onModeChange={(newMode) => {
                    setIsRunning(false)
                    setMode(newMode)
                    setTimeConfig(newMode.option)
                }}/>
                <TimerControl disabled={isRunning} mode={mode} onChange={(time) => {
                    setTimeConfig(time)
                }}/>
                <Timer
                    onStart={() => setIsRunning(true)}
                    timeConfig={timeConfig}
                    action={{
                        reset() {
                            setIsRunning(false);
                        },
                        ...mode.action
                    }}
                    comments={mode.comment}
                />
                {
                    renderPage(mode)
                }
            </div>
        </div>
    );
};

export default App;

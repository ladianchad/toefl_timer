import React, {useCallback, useEffect, useState} from 'react';
import ModeSelector from "./component/ModeSelector";
import {DefaultModes} from "./config/ModeConfig";
import TimerControl from "./component/TimerControl";
import {Mode} from "./global/types";
import Timer from "./component/Timer";
import Footer from "./component/Footer";

const App = () => {
    const [mode, setMode] = useState(DefaultModes[0]);
    const [isRunning, setIsRunning] = useState(false);
    const [timeConfig, setTimeConfig] = useState(mode.option);

    return (
        <div className="w-full h-full p-2 font-sans flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-center pb-2.5">TOEFL UTILITIES</h1>
            <div className="flex flex-col gap-2 grow">
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
                    mode.contents
                }
            </div>
            <span className="text-xs font-bold flex justify-end">* 녹음 기능은 추후 추가 하겠습니다.</span>
            <Footer/>
        </div>
    );
};

export default App;

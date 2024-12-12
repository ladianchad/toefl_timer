import {act, useCallback, useEffect, useMemo, useState} from "react";
import {ModeAction, ModeComment, TimeConfig} from "../global/types";

interface TimerProps {
    comments?: ModeComment,
    action?: ModeAction & {
        reset?: () => void,
    }
    timeConfig: TimeConfig
}

const Timer = ({
                   timeConfig,
                   action,
                   comments
               }: TimerProps) => {
    const [remain, setRemain] = useState(timeConfig.prepareTime ? timeConfig.prepareTime : timeConfig.runTime);
    const [comment, setComment] = useState(comments);
    const [startPoint, setStartPoint] = useState(timeConfig.prepareTime ? -1 : 1);
    const [currentState, setCurrentState] = useState(timeConfig.prepareTime ? -1 : 1);
    const [timer, setTimer] = useState<number>(null)

    useEffect(() => {
        setStartPoint(timeConfig.prepareTime ? -1 : 1);
        resetCounter(timeConfig);
    }, [timeConfig]);

    useEffect(() => {
        setComment(comments);
    }, [comments]);

    useEffect(() => {
        if (currentState == 1) {
            if (action?.beforeMiddle) {
                action.beforeMiddle().then(() => {
                    setCurrentState(c => c + 1)
                })
            } else {
                setCurrentState(c => c + 1)
            }
        } else if(startPoint != currentState && currentState == 2) {
            if(action?.middle){
                action.middle().then(() => {
                    setRemain(timeConfig.runTime)
                    startCount()
                })
            } else {
                setRemain(timeConfig.runTime)
                startCount()
            }
        } else if(currentState == 3){
            if(action?.end){
                action.end().then(() => {
                    setCurrentState(c => c +1);
                })
            }
        }
    }, [currentState]);

    const startCount = useCallback(() => {
        const timer = setInterval(() => {
            setRemain(val => {
                const update = val - 1
                if (update < 0) {
                    clearInterval(timer)
                    setTimer(null);
                    setCurrentState(c => c + 1)
                    return 0;
                }
                return update;
            });
        }, 1000);
        setTimer(timer);
    }, [timer]);

    const resetCounter = useCallback((timeConfig: TimeConfig) => {
        let state = -1;
        if (!timeConfig.prepareTime) {
            state = 1; // start render
        }
        if (timer != null) {
            clearInterval(timer)
            setTimer(null)
        }
        setRemain(timeConfig.prepareTime ? timeConfig.prepareTime : timeConfig.runTime);
        setCurrentState(state);
        if (action?.reset) {
            action.reset();
        }
    }, [timer]);

    const displayComment = useMemo(() => {
        if(currentState == -1){
            return comment?.beforeStart
        } else if(currentState == 0) {
            return comment?.start
        } else if(currentState == 1){
            return comment?.beforeMiddle
        } else if(currentState == 2){
            return comment?.middle
        } else if(currentState == 3){
            return comment?.end
        }
        return comment?.end
    }, [currentState])

    return (
        <div className={"w-full flex flex-col gap-2 p-2" + (remain < 10 && currentState != startPoint ? " text-red-500" : "")}>
            <h3 className="w-full text-center font-bold text-2xl">남은 시간</h3>
            <div className="flex items-center text-[5em] md:text-[8em] w-full text-center tracking-normal justify-center gap-2">
                <span className="w-36 md:w-44">{Math.floor(remain / 60).toString().padStart(2, "0")}</span>
                :
                <span className="w-36 md:w-44">{Math.floor(remain % 60).toString().padStart(2, "0")}</span>
            </div>

            <div className="flex">
                <span className="grow h-full flex items-end text-lg justify-start font-bold">{displayComment}</span>
                <label
                    className={"rounded-md font-bold w-fit text-white px-6 py-2 " + (currentState != startPoint ? "bg-red-600" : "bg-green-600")}
                >
                <span>{
                    currentState == startPoint ? "시작" : "초기화"
                }</span>
                    <button onClick={(event) => {
                        if (currentState == startPoint) {
                            if (action?.beforeStart && startPoint == -1) {
                                action.beforeStart().then(() => {
                                    startCount();
                                    setCurrentState(startPoint + 1)
                                });
                            } else if(action?.beforeMiddle && startPoint == 1) {
                                action.beforeMiddle().then(() => {
                                    startCount();
                                    setCurrentState(startPoint + 1)
                                })
                            } else {
                                startCount();
                                setCurrentState(startPoint + 1)
                            }
                        } else {
                            resetCounter(timeConfig);
                        }
                    }}/>
                </label>
            </div>

        </div>
    )
}

export default Timer

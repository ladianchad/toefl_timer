import {useCallback, useEffect, useMemo, useState} from "react";
import {ModeAction, ModeComment, TimeConfig} from "../global/types";
import {initSpeech} from "../utils/speech";
import {setUpBuzzer} from "../utils/buzzer";

interface TimerProps {
    comments?: ModeComment,
    action?: ModeAction,
    onAir?: () => void,
    reset?: () => void,
    smallClock?: boolean,
    timeConfig: TimeConfig
}

const Timer = ({
                   timeConfig,
                   action,
                   onAir,
                   reset,
                   comments,
                   smallClock
               }: TimerProps) => {
    const [remain, setRemain] = useState(timeConfig.prepareTime ? timeConfig.prepareTime : timeConfig.runTime);
    const [comment, setComment] = useState(comments);
    const [startPoint, setStartPoint] = useState(timeConfig.prepareTime ? -1 : 1);
    const [currentState, setCurrentState] = useState(timeConfig.prepareTime ? -1 : 1);
    const [timer, setTimer] = useState<number>(null);
    const [buzzer, setBuzzer] = useState<any>();
    const [utterance, setUtterance] = useState<any>();

    useEffect(() => {
        const update = timeConfig.prepareTime ? -1 : 1;
        setStartPoint(update);
        setCurrentState(update);
        resetCounter(timeConfig);
    }, [timeConfig]);

    useEffect(() => {
        setComment(comments);
    }, [comments]);

    useEffect(() => {
        if(currentState > 3 && reset){
            reset();
            return;
        } else if (startPoint != currentState && onAir) {
            onAir();
        }
        if (startPoint == -1 && currentState < 0) {
            return
        } else if (startPoint == 1 && currentState < 2) {
            return;
        }
        if(currentState == 0){
            if (action?.start) {
                action.start(buzzer, utterance).then(() => {
                    setRemain(timeConfig.prepareTime)
                    startCount()
                })
            } else {
                setRemain(timeConfig.prepareTime)
                startCount()
            }
        } else if (currentState == 1) {
            setRemain(timeConfig.runTime)
            if (action?.beforeMiddle) {
                action.beforeMiddle(buzzer, utterance).then(() => {
                    setCurrentState(c => c + 1)
                })
            } else {
                setCurrentState(c => c + 1)
            }
        } else if (currentState == 2) {
            if (action?.middle) {
                action.middle(buzzer, utterance).then(() => {
                    startCount()
                })
            } else {
                startCount()
            }
        } else if (currentState == 3) {
            if (action?.end) {
                action.end(buzzer, utterance).then(() => {
                    setCurrentState(c => c + 1);
                })
            } else {
                setCurrentState(c => c + 1);
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
        if (reset) {
            reset();
        }
    }, [timer]);

    const displayComment = useMemo(() => {
        if (currentState == -1) {
            return comment?.beforeStart
        } else if (currentState == 0) {
            return comment?.start
        } else if (currentState == 1) {
            return comment?.beforeMiddle
        } else if (currentState == 2) {
            return comment?.middle
        } else if (currentState == 3) {
            return comment?.end
        }
        return comment?.end
    }, [currentState])

    return (
        <div
            className={"w-full flex flex-col gap-2 p-2" + (remain < 10 && currentState != startPoint ? " text-red-500" : "")}>
            <div className={"w-full flex " + (smallClock ? " justify-between border-b" : " flex-col")}>
                <h3 className={"w-full font-bold " + (smallClock ? " text-xl" : " text-2xl text-center")}>{currentState < 1 ? "남은 준비 시간" : "남은 진행 시간"}</h3>
                <div
                    className={"flex items-center w-full text-center tracking-normal gap-3" + (smallClock ? " text-[2.5em] justify-end" : " text-[5em] md:text-[8em] justify-center")}>
                    <span>{Math.floor(remain / 60).toString().padStart(2, "0")}</span>
                    :
                    <span>{Math.floor(remain % 60).toString().padStart(2, "0")}</span>
                </div>
            </div>

            <div className="flex">
                <span
                    className={"grow h-full flex items-end text-lg justify-start font-bold text-gray-400"}>{displayComment}</span>
                <label
                    className={"rounded-md font-bold w-fit text-white px-6 py-2 " + (currentState != startPoint ? "bg-red-600" : "bg-green-600")}
                >
                <span className="break-keep">{
                    currentState == startPoint ? "시작" : "초기화"
                }</span>
                    <button onClick={() => {
                        let newUtterance = initSpeech();
                        let newBuzzer = setUpBuzzer();
                        setUtterance(newUtterance);
                        setBuzzer(newBuzzer);
                        if (!newUtterance || !newBuzzer) {
                            alert("해당 브라우저는 음향 생성이 불가능합니다.")
                        }
                        if (currentState == startPoint) {
                            if (action?.beforeStart && startPoint == -1) {
                                action.beforeStart(buzzer, utterance).then(() => {
                                    setCurrentState(startPoint + 1)
                                });
                            } else if (action?.beforeMiddle && startPoint == 1) {
                                action.beforeMiddle(buzzer, utterance).then(() => {
                                    setCurrentState(startPoint + 1)
                                })
                            } else {
                                setCurrentState(startPoint + 1)
                            }
                        } else {
                            resetCounter(timeConfig);
                            setBuzzer(null);
                            setUtterance(null);
                        }
                    }}/>
                </label>
            </div>

        </div>
    )
}

export default Timer

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ModeAction, ModeActionContext, ModeComment, ModeRequiredPermission, TimeConfig} from "../global/types";
import {initSpeech} from "../utils/speech";
import {setUpBuzzer} from "../utils/buzzer";
import {initialSpeechRecognition} from "../utils/speechRecognition";
import {getMediaStream, getMicrophone} from "../utils/record";

interface TimerProps {
    comments?: ModeComment,
    action?: ModeAction,
    permission?: ModeRequiredPermission,
    onAir?: () => void,
    reset?: () => void,
    smallClock?: boolean,
    timeConfig: TimeConfig
}

const Timer = ({
                   timeConfig,
                   action,
                   permission,
                   onAir,
                   reset,
                   comments,
                   smallClock
               }: TimerProps) => {
    const [remain, setRemain] = useState(timeConfig.prepareTime ? timeConfig.prepareTime : timeConfig.runTime);
    const [startPoint, setStartPoint] = useState(timeConfig.prepareTime ? -1 : 1);
    const [currentState, setCurrentState] = useState(timeConfig.prepareTime ? -1 : 1);
    const [timer, setTimer] = useState<number>(null);
    const [context, setContext] = useState<ModeActionContext>({});
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        getMediaStream().then(() => {
        })
    }, []);

    useEffect(() => {
        const update = timeConfig.prepareTime ? -1 : 1;
        setStartPoint(update);
        setCurrentState(update);
        resetCounter(timeConfig);
    }, [timeConfig]);

    useEffect(() => {
        buttonRef.current.disabled = false
        if (currentState > 3 && reset) {
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
        if (currentState == 0) {
            if (action?.start) {
                action.start(context).then(() => {
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
                action.beforeMiddle(context).then(() => {
                    setCurrentState(c => c + 1)
                })
            } else {
                setCurrentState(c => c + 1)
            }
        } else if (currentState == 2) {
            if (action?.middle) {
                action.middle(context).then(() => {
                    startCount()
                })
            } else {
                startCount()
            }
        } else if (currentState == 3) {
            if (action?.end) {
                action.end(context).then(() => {
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
        if (action.reset) {
            action.reset(context).then()
        }
    }, [timer]);

    const displayComment = useMemo(() => {
        if (currentState == -1) {
            return comments?.beforeStart
        } else if (currentState == 0) {
            return comments?.start
        } else if (currentState == 1) {
            return comments?.beforeMiddle
        } else if (currentState == 2) {
            return comments?.middle
        } else if (currentState == 3) {
            return comments?.end
        }
        return comments?.end
    }, [currentState, comments])

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
                    className={"rounded-md font-bold w-fit h-fit text-white px-6 py-2 " + (currentState != startPoint ? "bg-red-600" : "bg-green-600")}
                >
                <span className="break-keep">{
                    currentState == startPoint ? "시작" : "초기화"
                }</span>
                    <button ref={buttonRef} onClick={async () => {
                        buttonRef.current.disabled = true
                        if (currentState == startPoint) {
                            const utterance = context.utterance ? context.utterance : initSpeech();
                            const buzzer = context.buzzer ? context.buzzer : setUpBuzzer();
                            const recorder = permission?.mike ? getMicrophone(await getMediaStream()) : null
                            if (!utterance || !buzzer) {
                                alert("해당 브라우저는 음향 생성이 불가능합니다.")
                            }

                            const newContext: ModeActionContext = {
                                utterance: utterance,
                                buzzer: buzzer,
                                recorder: recorder
                            }
                            setContext(newContext);
                            if (action?.beforeStart && startPoint == -1) {
                                action.beforeStart(newContext).then(() => {
                                    setCurrentState(startPoint + 1)
                                });
                            } else if (action?.beforeMiddle && startPoint == 1) {
                                action.beforeMiddle(newContext).then(() => {
                                    setCurrentState(startPoint + 1)
                                })
                            } else {
                                setCurrentState(startPoint + 1)
                            }
                        } else {
                            resetCounter(timeConfig);
                            setContext({});
                        }
                    }}/>
                </label>
            </div>

        </div>
    )
}

export default Timer

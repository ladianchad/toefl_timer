import {Mode, ModeAction} from "../global/types";
import speech from "../utils/speech";
import sleep from "../utils/sleep";
import buzzer from "../utils/buzzer";
import React from "react";
import WritingArea from "../component/WritingArea";
import {startRecord} from "../utils/record";
import RecordedSection from "../component/RecordedSection";

const SpeechAction: ModeAction = {
    async beforeMiddle(context) {
        speech(context.utterance, "Speaking after beep...");
        await sleep(2000);
        await buzzer(context.buzzer, 1000)
    },
    async middle(context) {
        startRecord(context.recorder)
    },
    async end(context) {
        context.recorder.stop()
        speech(context.utterance, "Time is over.");
        await sleep(1000);
    },
    async reset(context) {
        context.recorder?.stop()
    }
}

export const DefaultModes: Mode[] = [
    {
        name: "말하기 유형 1 (준비 15 초, 말하기 45 초)",
        option: {
            prepareTime: 15,
            runTime: 45
        },
        action: SpeechAction,
        comment: {
            beforeStart: "Speaking 문제를 준비하세요.",
            beforeMiddle: "Speaking 준비 시간.",
            middle: "녹음중...",
            end: "수고하셨습니다."
        },
        contents: <RecordedSection key={"recordSection"}></RecordedSection>
    }, {
        name: "말하기 유형 2 (준비 30 초, 말하기 60 초)",
        option: {
            prepareTime: 30,
            runTime: 60
        },
        action: SpeechAction,
        comment: {
            beforeStart: "Speaking 문제를 준비하세요.",
            beforeMiddle: "Speaking 준비 시간.",
            middle: "녹음중...",
            end: "수고하셨습니다."
        },
        contents: <RecordedSection key={"recordSection"}></RecordedSection>
    }, {
        name: "쓰기 유형 1 (쓰기 20 분)",
        option: {
            prepareTime: 0,
            runTime: 1200
        },
        action: {
            async middle() {
                const writable = document.getElementById("writingSection")
                writable?.focus()
            },
            async end(context) {
                speech(context.utterance, "Time is over.");
                await sleep(1000);
            }
        },
        contents: <WritingArea/>,
        comment: {
            beforeMiddle: "Writing 문제를 준비하세요.",
            end: "수고하셨습니다."
        },
        smallClock: true
    }, {
        name: "쓰기 유형 2 (쓰기 10 분)",
        option: {
            prepareTime: 0,
            runTime: 600
        },
        action: {
            async middle() {
                const writable = document.getElementById("writingSection")
                writable?.focus()
            },
            async end(context) {
                speech(context.utterance, "Time is over.");
                await sleep(1000);
            }
        },
        contents: <WritingArea></WritingArea>,
        comment: {
            beforeMiddle: "Writing 문제를 준비하세요.",
            end: "수고하셨습니다."
        },
        smallClock: true
    }, {
        name: "읽기 시험 (36 분)",
        option: {
            prepareTime: 0,
            runTime: 2160
        },
        action: {
            async end(context) {
                speech(context.utterance, "Time is over.");
                await sleep(1000);
            }
        },
        comment: {
            beforeMiddle: "Reading 문제를 준비하세요.",
            end: "수고하셨습니다."
        }
    }, {
        name: "읽기 1문제 (18 분)",
        option: {
            prepareTime: 0,
            runTime: 1080
        },
        action: {
            async end(context) {
                speech(context.utterance, "Time is over.");
                await sleep(1000);
            }
        },
        comment: {
            beforeMiddle: "Reading 문제를 준비하세요.",
            end: "수고하셨습니다."
        }
    }
]

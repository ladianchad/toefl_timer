import React from "react";

export interface Mode {
    name: string
    option: TimeConfig
    action?: ModeAction
    comment?: ModeComment
    contents?: React.ReactNode
    reset?: ModeActionType,
    smallClock?: boolean
}

export interface TimeConfig {
    prepareTime: number,
    runTime: number
}


export interface ModeActionContext {
    buzzer?: unknown,
    utterance?: SpeechSynthesisUtterance,
    recorder?: MediaRecorder
}

export type ModeActionType = (context: ModeActionContext) => Promise<void>
export interface ModeAction {
    beforeStart?: ModeActionType
    start?: ModeActionType
    beforeMiddle?: ModeActionType
    middle?: ModeActionType
    end?: ModeActionType
    reset?: ModeActionType
}

export interface ModeComment {
    beforeStart?: string
    start?: string
    beforeMiddle?: string
    middle?: string
    end?: string
}

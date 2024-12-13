import React from "react";

export interface Mode {
    name: string
    option: TimeConfig
    action?: ModeAction
    comment?: ModeComment
    contents?: React.ReactNode
    smallClock?: boolean
}

export interface TimeConfig {
    prepareTime: number,
    runTime: number
}

export interface ModeAction {
    beforeStart?: (buzzer?: unknown, utterance?: SpeechSynthesisUtterance) => Promise<void>
    start?: (buzzer?: unknown, utterance?: SpeechSynthesisUtterance) => Promise<void>
    beforeMiddle?: (buzzer?: unknown, utterance?: SpeechSynthesisUtterance) => Promise<void>
    middle?: (buzzer?: unknown, utterance?: SpeechSynthesisUtterance) => Promise<void>
    end?: (buzzer?: unknown, utterance?: SpeechSynthesisUtterance) => Promise<void>
}

export interface ModeComment {
    beforeStart?: string
    start?: string
    beforeMiddle?: string
    middle?: string
    end?: string
}

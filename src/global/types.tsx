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
    beforeStart?: (buzzer?: any) => Promise<void>
    start?: (buzzer?: any) => Promise<void>
    beforeMiddle?: (buzzer?: any) => Promise<void>
    middle?: (buzzer?: any) => Promise<void>
    end?: (buzzer?: any) => Promise<void>
}

export interface ModeComment {
    beforeStart?: string
    start?: string
    beforeMiddle?: string
    middle?: string
    end?: string
}

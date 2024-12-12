import React from "react";

export interface Mode {
    name: string
    option: TimeConfig
    action?: ModeAction
    comment?: ModeComment
    contents?: React.ReactNode
}

export interface TimeConfig {
    prepareTime: number,
    runTime: number
}

export interface ModeAction {
    beforeStart?: () => Promise<void>
    start?: () => Promise<void>
    beforeMiddle?: () => Promise<void>
    middle?: () => Promise<void>
    end?: () => Promise<void>
}

export interface ModeComment {
    beforeStart?: string
    start?: string
    beforeMiddle?: string
    middle?: string
    end?: string
}

import {createContext, ReactNode, useEffect, useState} from "react";

interface MicrophoneContext {
    stream?: MediaStream
}

const MicrophoneContextInnerProvider = createContext<MicrophoneContext>({})

const MicrophoneContextProvider = ({
                                       children
                                   }: {
    children?: ReactNode
}) => {
    const [stream, setStream] = useState<MediaStream>();
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({audio: true}).then(mediaStream => {
            setStream(mediaStream);
        })
    }, []);
    return <MicrophoneContextInnerProvider value={{
        stream: stream
    }}>{children}</MicrophoneContextInnerProvider>
}
export default MicrophoneContextProvider

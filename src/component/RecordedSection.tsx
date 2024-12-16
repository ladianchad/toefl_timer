import {useEffect, useState} from "react";
import {RecordEndEvent} from "../utils/record";

const RecordedSection = () => {

    const [recordList, setRecordLists] = useState<{
        title: string,
        content: string
        key: number
    }[]>(JSON.parse(sessionStorage.getItem("audio_recorded") ?? "[]"));

    useEffect(() => {
        document.addEventListener("record_ended", (event: RecordEndEvent) => {
            const now = new Date()
            const pad = (num) => num.toString().padStart(2, "0"); // 숫자를 2자리로 패딩
            const hh = pad(now.getHours()); // 시
            const mm = pad(now.getMinutes()); // 분
            const ss = pad(now.getSeconds()); // 초
            const key = recordList.length + 1
            setRecordLists(prevState => {
                const updated = [{
                    title: `${hh}시 ${mm}분 ${ss}초`,
                    content: event.urlObject,
                    key: key
                }, ...prevState]
                sessionStorage.setItem("audio_recorded", JSON.stringify(updated))
                return updated
            })
        })
    }, []);

    return <div className="flex flex-col gap-1 border-2 border-gray-600 px-2 py-1 rounded-md">
        <h3 className="font-bold pb-2 text-center text-gray-500 text-xl border-b">녹음 리스트</h3>
        <div
            className={"flex flex-col w-full overflow-auto text-gray-200 font-bold gap-2 text-lg text-center min-h-36 max-h-48" + (recordList.length ? "" : " justify-center")}>
            {
                recordList.map((item) => {
                    return <div
                        key={item.key}
                        className="flex flex-wrap gap-2 bg-white shadow-md rounded-lg p-2 border border-gray-200"
                    >
                        <span className="break-keep min-w-24 text-lg p-2 font-semibold text-gray-800">
                            {item.title}
                        </span>
                        <label className="flex min-w-52 grow items-center space-x-4">
                            <audio
                                controls
                                src={item.content}
                                className="w-full focus:outline-none focus:ring focus:ring-blue-300 rounded-md"
                            ></audio>
                        </label>
                    </div>
                })
            }
            {
                recordList.length == 0 ? "아직 녹음 결과가 없습니다" : ""
            }
        </div>
    </div>
}

export default RecordedSection

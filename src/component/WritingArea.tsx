import {useState} from "react";

const WritingArea = () => {

    const [textCount, setTextCount] = useState(0)

    return (
        <div className="flex flex-col grow">
            <div className="flex justify-between items-end p-1 text-base font-semibold text-gray-500">
                <span className="items-end">* 여기에 작성하세요.</span>
                <span className="items-end">단어수 : {textCount}</span>
            </div>
            <label
                htmlFor="writingSection"
                className="w-full border-2 grow border-gray-400 focus-within:border-gray-400 border-dashed"
            >
            <textarea id="writingSection"
                      className="w-full h-full resize-y focus:outline-none focus:border-none p-2 resize-none"
                      spellCheck="false"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      onChange={(event) => {
                          const inputText = event.target.value;
                          const words = inputText.trim().split(/\s+/).filter(Boolean);
                          setTextCount(words.length)
                      }}
            />
            </label>
        </div>
    )
}

export default WritingArea

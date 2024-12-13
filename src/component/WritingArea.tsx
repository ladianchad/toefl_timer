const WritingArea = () => {

    return (
        <div className="flex flex-col">
            <h4 className="text-xs">* 여기에 작성하세요.</h4>
            <label
                htmlFor="writingSection"
                className="w-full border-2 border-gray-400 focus-within:border-gray-600 border-dashed"
            >
            <textarea id="writingSection"
                className="w-full h-full max-h-96 resize-y min-h-60 focus:outline-none focus:border-none p-2"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
            />
            </label>
        </div>
    )
}

export default WritingArea

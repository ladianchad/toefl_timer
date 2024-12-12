const WritingArea = () => {

    return (
        <div className="flex flex-col">
            <h4 className="text-xs">여기에 작성하세요</h4>
            <label
                className="w-full border-2 border-gray-600 border-dashed min-h-60"
            >
            <textarea id="writingSection"
                className="w-full h-full focus:outline-none focus:border-none p-2"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                inputMode="none"
            />
            </label>
        </div>
    )
}

export default WritingArea

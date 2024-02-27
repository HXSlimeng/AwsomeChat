import { Tag } from "@douyinfe/semi-ui";
import React, { useEffect, useRef, useState } from "react"


const Tips: React.FC<{ input: string, setInput: Function, className: any }> = function ({ input, setInput, className }) {
    const timer = useRef(0)
    const [tip, setTip] = useState("")

    useEffect(listenKeyboard, [input, tip])

    useEffect(getTipAfterInp, [input])

    function addTip2Inp() {
        setInput(input + tip)
    }
    function listenKeyboard() {
        let target = document.getElementById("customInp")
        let fun = (evt: KeyboardEvent) => {
            if (evt.key == "Tab") {
                evt.preventDefault()
                if (!tip.trim()) return;
                setInput(input + tip)
            }
        }
        target?.addEventListener("keydown", fun)
        return () => {
            target?.removeEventListener("keydown", fun)
        }
    }
    //模拟获取Tip
    function getTipAfterInp() {
        let currInpValid = Boolean(input.split("")[input.length - 1]?.trim());
        setTip("")

        if (timer) clearTimeout(timer.current)
        let timeout = currInpValid ? 1000 : 0;
        let currtip = currInpValid ? "提示" : ""
        /* @ts-ignore */
        timer.current = setTimeout(setTip.bind(this, currtip), timeout)
    }

    return <label className={className} >
        <span className="text-transparent">{input}</span>
        <span style={{ color: "var(--semi-color-text-3)" }}>{tip} </span>
        {tip.trim() ? <Tag size="small" onClick={addTip2Inp} className="pointer-events-auto cursor-pointer">Tab</Tag> : null}
    </label>
}

const CustomInput: React.FC<{ addQ: (message: string) => void, chatable: boolean }> = ({ addQ, chatable }) => {
    let [input, setInput] = useState("")
    let [rows, setRows] = useState<number>(3)
    const inputArea = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        let brNum = Array.from(input.matchAll(/\n/g));
        setRows(brNum.length + 1 > 3 ? brNum.length + 1 : 3)

        let fun = (async (evt: KeyboardEvent) => {
            if (evt.key == "Enter") {
                if (!evt.shiftKey && input.trim()) {
                    evt.preventDefault();
                    addQ(input)
                    setInput("")
                }
            }
        })
        inputArea.current?.addEventListener("keydown", fun)
        return () => inputArea.current?.removeEventListener("keydown", fun)
    }, [input])

    return (

        <form className="relative flex flex-grow" >
            <textarea id="customInp"
                rows={rows}
                autoComplete="off"
                value={input}
                onChange={(evt) => setInput(evt.target.value)}
                style={{ color: "var(--semi-color-text-1)", font: "inherit" }}
                ref={inputArea}
                wrap="hard"
                className="text-inherit w-full bg-transparent resize-none border-0  outline-none p-0 whitespace-pre-wrap break-words"
                placeholder="问你任何想问的问题！"
                disabled={!chatable}>
            </textarea>
            <Tips input={input} setInput={setInput} className="absolute left-0  pointer-events-none w-full whitespace-pre-wrap break-words "></Tips>
        </form>
    )
}

export default CustomInput
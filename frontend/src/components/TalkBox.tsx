import { List, Avatar, Typography, Spin, Button } from "@douyinfe/semi-ui"
import { IconAlertCircle } from "@douyinfe/semi-icons"
import { useContext, useRef } from "react"
import { utilsContext } from "@/provider/utils"
import Markdown from "react-markdown"
///@ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
///@ts-ignore
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export enum ConType {
    Q,
    A
}

export type TalkBoxProps = {
    avaUrl?: string,
    name?: string,
    content: string,
    type: ConType
    time: number
    fetching?: boolean
}

function TalkBoxWraper({ name, time, fetching, type, avaUrl }: TalkBoxProps, content: JSX.Element,) {
    const { Text } = Typography
    const { Item } = List
    const dayjs = useContext(utilsContext)
    let defaultInfo = useRef(
        new Map<ConType, Pick<TalkBoxProps, "avaUrl" | "name">>(
            [
                [ConType.Q, { avaUrl: "👨‍🦱", name: "You" }],
                [ConType.A, { avaUrl: "🤖", name: "Robot" }]
            ]
        )
    )

    let main = (
        <div className="contentMain">
            <Text type="tertiary">{name || defaultInfo.current.get(type)?.name}</Text>
            <div className="contentBox">
                {content}
                <div className="footerInfo">
                    <Text type="quaternary" size="small">{dayjs(time).format("YYYY MM-DD HH:mm:ss")}</Text>
                </div>
            </div>
        </div>
    )
    let header = (
        <Avatar size={"default"} contentMotion={fetching} border={true}>
            {avaUrl || defaultInfo.current.get(type)?.avaUrl}
        </Avatar>
    )
    let itemClass = type == ConType.Q ? "rightGraph" : "leftGraph";
    return <Item main={main} header={header} className={itemClass}></Item>;
}

const TalkBox: React.FC<TalkBoxProps> = function (props) {

    let content = <span>{props.content}</span>
    if (props.type == ConType.A) {

        if (props.content.trim()) {
            content = <Markdown children={props.content} components={{
                code(props) {
                    const { children, className, node, ...rest } = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                        <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            style={a11yDark}
                        />
                    ) : (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                    )
                }
            }} />
        } else {
            if (props.fetching) {
                content = <Spin></Spin>
            } else {
                content = <Button size="small" theme="borderless" type="warning" icon={<IconAlertCircle />}>貌似有点问题，点击重试</Button>
            }
        }
    }
    return TalkBoxWraper(props, content)
}

export default TalkBox
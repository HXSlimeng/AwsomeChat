import { List, Avatar, Typography, Space } from "@douyinfe/semi-ui"
import { useContext, useRef } from "react"
import { utilsContext } from "@/provider/utils"

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

const TalkBox: React.FC<TalkBoxProps> = function ({ fetching, avaUrl, name, content, type, time }) {
    const dayjs = useContext(utilsContext)
    let defaultInfo = useRef(
        new Map<ConType, Pick<TalkBoxProps, "avaUrl" | "name">>(
            [
                [ConType.Q, { avaUrl: "👨‍🦱", name: "You" }],
                [ConType.A, { avaUrl: "🤖", name: "Robot" }]
            ]
        )
    )

    const { Text } = Typography
    const { Item } = List
    const header =
        <Avatar size={"default"} contentMotion={fetching} border={true}>
            {avaUrl || defaultInfo.current.get(type)?.avaUrl}
        </Avatar>

    let mainClass, itemClass, graphClass = "talkGraph", contentStyle;

    if (type == ConType.Q) {
        graphClass += " quesGraph"
        mainClass = "flex flex-col items-end"
        itemClass = "listItemReverse"
        contentStyle = { marginLeft: "60px", whiteSpace: "pre-wrap" }
    } else {
        contentStyle = { marginRight: "60px", whiteSpace: "pre-wrap" }
    }

    const main =
        <div className={mainClass}>
            <Text type="tertiary">{name || defaultInfo.current.get(type)?.name}</Text>
            <div className={graphClass} style={contentStyle} >
                {content}
                <div className="text-right">
                    <Text type="quaternary" size="small">{dayjs(time).format("YYYY MM-DD HH:mm:ss")}</Text>
                </div>
            </div>
        </div>

    return <Item header={header} main={main} className={itemClass}></Item>
}

export default TalkBox
import { List, Avatar, Typography, Spin, Button, Tag, Banner, Tooltip, ButtonGroup, Toast } from "@douyinfe/semi-ui"
import { IconAlertCircle, IconCopy, IconEdit } from "@douyinfe/semi-icons"
import { useContext, useRef } from "react"
import { utilsContext } from "@/provider/utils"
import Markdown, { Components } from "react-markdown"
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter'
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

let defaultInfo = new Map<ConType, Pick<TalkBoxProps, "avaUrl" | "name">>(
    [
        [ConType.Q, { avaUrl: "👨‍🦱", name: "You" }],
        [ConType.A, { avaUrl: "🤖", name: "Robot" }]
    ]
)

const TalkBox: React.FC<TalkBoxProps> = function (props) {
    const { Text, Title, Paragraph } = Typography
    let content = <span>{props.content}</span>

    let formatComp: Partial<Components> = {
        //代码块
        code(props) {
            const { children, className, node, ...rest } = props as SyntaxHighlighterProps
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
                //代码块
                <div className="relative">
                    <ButtonGroup className="absolute right-2 top-2">
                        <Button icon={<IconCopy />} onClick={copyCode.bind(this, children)}></Button>
                        <Button icon={<IconEdit />}></Button>
                    </ButtonGroup>
                    <SyntaxHighlighter
                        {...rest}
                        showLineNumbers={true}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        style={a11yDark}
                    />
                </div>
            ) : (
                //行内代码
                <Text className={className} size="small" code>{children}</Text>
            )
        },
        //引用> 

        blockquote: ({ children }) => <Banner fullMode={false} type="info" icon={null} closeIcon={null}>{children}</Banner>,
        h1: (props) => <Title>{props.children}</Title>,
        h2: (props) => <Title heading={2}>{props.children}</Title>,
        h3: (props) => <Title heading={3}>{props.children}</Title>,
        h4: (props) => <Title heading={4}>{props.children}</Title>,
        h5: (props) => <Title heading={5}>{props.children}</Title>,
        p: (props) => <Paragraph spacing="extended" className="my-4">{props.children}</Paragraph>,
        ol: (props) => <ol className="indent-4">{props.children}</ol>,
        ul: (props) => <ul className="indent-8">{props.children}</ul>,
        li: (props) => <li>•{props.children}</li>
    }

    if (props.type == ConType.A) {

        if (props.content.trim()) {
            content = <Markdown children={`${props.content}`} components={formatComp} />
        } else {
            if (props.fetching) {
                //无内容显示加载
                content = <Spin></Spin>
            } else {
                //失败显示重试按钮
                content = <Button size="small" theme="borderless" type="warning" icon={<IconAlertCircle />}>貌似有点问题，点击重试</Button>
            }
        }
    }
    return TalkBoxWraper(props, content)

    async function copyCode(content: string | string[]) {
        content = Array.isArray(content) ? content.join("") : content;
        await navigator.clipboard.writeText(content)
        Toast.success("复制成功");
    }
}
function TalkBoxWraper(props: TalkBoxProps, domContent: JSX.Element,) {
    const { avaUrl, type, fetching } = props
    const { Item } = List

    let main = <TalkBoxMain domContent={domContent} {...props}></TalkBoxMain>

    let header = (
        <Avatar size={"default"} contentMotion={fetching} border={true}>
            {avaUrl || defaultInfo.get(type)?.avaUrl}
        </Avatar>
    )

    let itemClass = type == ConType.Q ? "rightGraph" : "leftGraph";

    return <Item main={main} header={header} className={itemClass}></Item>;
}

const TalkBoxMain: React.FC<TalkBoxProps & { domContent: JSX.Element }> = function ({ name, type, domContent, time }) {
    const { Text } = Typography
    const dayjs = useContext(utilsContext)
    return (
        <div className="contentMain">
            <Text type="tertiary">{name || defaultInfo.get(type)?.name}</Text>
            <div className="contentBox">
                {domContent}
                <div className="footerInfo">
                    <Text type="quaternary" size="small">{dayjs(time).format("YYYY MM-DD HH:mm:ss")}</Text>
                </div>
            </div>
        </div>
    )
}

export default TalkBox
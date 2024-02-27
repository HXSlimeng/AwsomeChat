import { Button, Card, Empty, Layout, List, Space, Typography } from "@douyinfe/semi-ui";
import TalkBox, { ConRole, TalkBoxProps } from "@/components/TalkBox";
import { useEffect, useMemo, useRef, useState } from "react";
import BoxInp from "@/components/BoxInp";
import { fetchMessage } from "@/api";
import { IllustrationNoContent, IllustrationNoContentDark } from "@douyinfe/semi-illustrations"
import { useDispatch, useSelector, useStore } from "react-redux";
import { getLLMtoken } from "@/store/features/llmSlice";
import { UnknownAction } from "redux";
import { RootType } from "@/store";
import { IconSend, IconPlus, IconPause } from "@douyinfe/semi-icons";
type LLMStreamInfo = {
    id: string,
    created: number,
    finish_reason: string,
    is_end: boolean,
    is_truncated: boolean,
    need_clear_history: boolean,
    object: string,
    result: string,
    sentence_id: number,
    usage: {
        completion_tokens: number,
        prompt_tokens: number,
        total_tokens: number
    }
}

function Wrapper({ children }: { children: any }) {
    return <Layout className="flex justify-center items-center">{children}</Layout>;
}

function EmptyContent() {
    const { Text } = Typography
    return (
        <Empty
            image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
            darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
            title="ChatUi"
            description="开始尝试第一次对话吧"
        >
        </Empty>
    )
}

export default function ChatBox() {
    const { Title } = Typography
    const [list, setList] = useState<TalkBoxProps[]>([]);
    const [genrating, setGenrating] = useState(false);
    const dispatch = useDispatch()
    const accessToken = useSelector<RootType>(state => state.llmSlice.accessToken)
    const hasToken = Boolean(accessToken)
    const chatable = useMemo(() => !genrating && hasToken, [genrating, hasToken])

    let textReader = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)

    useEffect(() => {
        dispatch(getLLMtoken({ client_secret: "WNRjQ1VcqsYg32jHbD55L7nVQl8ZBwZI", client_id: "n2KW7R48Mk1hXanza1cIhMc9" }) as unknown as UnknownAction);
    }, [])
    let LoadingCard =
        <Card shadows="hover" className="w-min absolute -top-3/4 z-10" style={{ left: "50%", marginLeft: "-55px" }} bodyStyle={{ textWrap: "nowrap", padding: "10px" }} >
            <div onClick={pauseGen} style={{ color: "rgba(var(--semi-orange-2), 1)" }} >
                <Space align="center" >
                    <IconPause></IconPause>
                    <div style={{ userSelect: "none" }}>正在生成...</div>
                </Space>
            </div>
        </Card>

    let ChatFooter = <Space className="w-full" style={{ position: "relative" }} >
        {genrating ? LoadingCard : ""}
        <Button theme="solid" type="primary" size="large" icon={<IconPlus />}></Button>
        <Card className="flex-grow flex" style={{ padding: "12px" }} bodyStyle={{ padding: "0", width: "100%", display: "flex" }} shadows="always">
            <BoxInp chatable={chatable} addQ={addConversation}></BoxInp>
            <Button theme="solid" className="self-end" disabled={!chatable} icon={<IconSend />}>发送</Button>
        </Card>
    </Space>

    return (
        <Wrapper>
            <Card className="relative w-5/6 mt-4 mb-4 cursor-auto"
                shadows="always"
                header={<Title heading={4} color="tertiary" content="ChatUi" >ChatUi</Title>}
                bodyStyle={{ padding: 0, height: 500, overflowY: "auto", position: "relative" }}
                footer={ChatFooter}
            >
                <List split={false}
                    emptyContent={<EmptyContent />}
                    dataSource={list}
                    className="overflow-y-auto"
                    renderItem={(item, i) => <TalkBox {...item} key={i}></TalkBox>} />
            </Card>
        </Wrapper >
    );
    async function addConversation(content: string) {
        if (genrating) return;
        setGenrating(true)
        let time = new Date().getTime()
        let newMessage = [...list, { content, role: ConRole.Q, name: "LM", time },]
        setList((list) => newMessage)
        getMessage(newMessage)
        setList((list) => [...list, { content: "", fetching: true, role: ConRole.A, time: new Date().getTime() }])
        // reloadEvtSource()
    }
    function newConversation() {

    }
    function endGen() {
        setGenrating(false)
        setList(list => list.map((v, i) => v.fetching ? { ...v, fetching: false } : v))
    }
    function pauseGen() {
        textReader.current?.cancel()
    }
    async function getMessage(newMessage: TalkBoxProps[] = []) {
        let messages = newMessage.map(({ content, role }) => ({ role, content }))
        const res = await fetchMessage({ messages, stream: true })

        let responseType = res.headers.get("Content-Type")?.toLocaleLowerCase()
        //application/json; charset=utf-8

        if (!res.body) return;
        textReader.current = res.body.getReader()
        readStream(textReader.current);
    }
    async function readStream(reader: ReadableStreamDefaultReader<Uint8Array>, unFinishedStr: string = '') {
        const { done, value } = await reader.read()
        if (done) {
            return endGen();
        }
        let unparsedStr = unFinishedStr + new TextDecoder("utf-8").decode(value)
        let infos = unparsedStr.split("data: ").filter(v => v.trim())
        let promises = infos.map((str) => {
            return async function (str) {
                try {
                    let result = JSON.parse(str).result
                    for (let i = 0; i < result.length; i++) {
                        const char = result[i];
                        setList(list => list.map(v => v.fetching ? { ...v, content: v.content + char } : v))
                        await sleep(20);
                    }
                } catch (error) {
                    unFinishedStr = "data: " + str
                }
            }(str)
        })
        await Promise.all(promises);
        readStream(reader, unFinishedStr || "")
    }
    async function sleep(time: number) {
        await new Promise((res) => setTimeout(res, time))
    }

}


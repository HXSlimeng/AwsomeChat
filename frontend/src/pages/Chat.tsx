import { Button, Card, Empty, Layout, List, Space } from "@douyinfe/semi-ui";
import TalkBox, { ConType, TalkBoxProps } from "@/components/TalkBox";
import { useRef, useState } from "react";
import BoxInp from "@/components/BoxInp";
import { IconPause } from "@douyinfe/semi-icons"
import { IllustrationNoContent, IllustrationNoContentDark } from "@douyinfe/semi-illustrations"

function Wrapper({ children }: { children: any }) {
    return <Layout className="flex justify-center items-center">{children}</Layout>;
}

function EmptyContent() {
    return (
        <Empty
            image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
            darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
            title="ChatUi"
            description="开始尝试第一次对话吧"
        >
            <div>
                <Button style={{ padding: '6px 24px', marginRight: 12 }} type="primary">
                    二级按钮
                </Button>
                <Button style={{ padding: '6px 24px' }} theme="solid" type="primary">
                    一级按钮
                </Button>
            </div>
        </Empty>
    )
}

export default function ChatBox() {
    const [list, setList] = useState<TalkBoxProps[]>([]);
    const [genrating, setGenrating] = useState(false);

    const evtSourceRef = useRef<EventSource | null>(null)

    let LoadingCard =
        <Card shadows="hover" className="w-min absolute bottom-20 z-10" style={{ left: "50%", marginLeft: "-55px" }} bodyStyle={{ textWrap: "nowrap", padding: "10px" }} >
            <div onClick={pauseGen}>
                <Space align="center" >
                    <IconPause></IconPause>
                    <div style={{ userSelect: "none" }}>正在生成...</div>
                </Space>
            </div>
        </Card>

    return (
        <Wrapper>
            <Card className="relative w-5/6 mt-4 mb-4 cursor-auto" shadows="always" bodyStyle={{ padding: 0, height: 500, overflowY: "auto" }} footer={<BoxInp addQ={addConversation} genrating={genrating} />}>
                {genrating ? LoadingCard : null}
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
        setList(list => [...list, { content, type: ConType.Q, name: "LM", time: new Date().getTime() }, { content: "", fetching: true, type: ConType.A, time: new Date().getTime() }])
        reloadEvtSource()
    }
    function pauseGen() {
        evtSourceRef.current?.close()
        setGenrating(false)
        setList(list => list.map((v, i) => v.fetching ? { ...v, fetching: false } : v))
    }
    function reloadEvtSource() {
        evtSourceRef.current = new EventSource("/api/events", { withCredentials: true })
        evtSourceRef.current.onmessage = (event) => {

            let token = event.data || ` `

            switch (event.data) {
                case "start":
                    break;
                case "end":
                    pauseGen()
                    break;
                default:
                    setList(list => list.map((v, i) =>
                        v.fetching
                            ? { ...v, content: v.content + token }
                            : v))
                    break;
            }
        }
        evtSourceRef.current.onerror = function (err) {
            alert("message")
            console.log(err);
        }
    }
}


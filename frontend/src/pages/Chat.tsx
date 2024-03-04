import { Button, Card, Empty, Layout, List, Modal, Row, Col, Space, Typography, Form, Toast, Tooltip } from "@douyinfe/semi-ui";
import TalkBox, { ConRole, TalkBoxProps } from "@/components/TalkBox";
import { createRef, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import BoxInp from "@/components/BoxInp";
import { fetchMessage } from "@/api";
import { IllustrationNoContent, IllustrationNoContentDark } from "@douyinfe/semi-illustrations"
import { useDispatch, useSelector, useStore } from "react-redux";
import { getLLMtoken } from "@/store/features/llmSlice";
import { UnknownAction } from "redux";
import { RootType } from "@/store";
import { IconSend, IconPlus, IconPause, IconSetting, IconHelpCircleStroked } from "@douyinfe/semi-icons";
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

const ConfiModal = forwardRef(({ initShow }: { initShow: boolean }, ref) => {
    const store = useStore<RootType>().getState().llmSlice.baseConfig
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(!initShow);
    const { Input } = Form
    const { Text } = Typography
    const inpForm = useRef<Form>(null)
    const showDialog = () => {
        setVisible(true);
    };
    const handleOk = async () => {
        const res = await inpForm.current?.formApi.validate()
        const { client_secret, client_id } = res as any
        const result = await dispatch(getLLMtoken({ client_secret, client_id }) as unknown as UnknownAction);
        if (result.error) {
            //@ts-ignore
            Toast.error(result.error.message)
        } else {
            setVisible(false);

        }
    };
    const handleCancel = () => {
        setVisible(false);
    };
    const handleAfterClose = () => {
    };

    useImperativeHandle(ref, () => ({
        showDialog
    }))
    let linkText = <Text>点击 <Text link={{ href: "https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application", target: "_blank" }}>获取Key</Text></Text>
    let helpTooltip = <Tooltip content={linkText} position="bottom">
        <IconHelpCircleStroked style={{ color: "var(--semi-color-primary)" }} />
    </Tooltip>

    return (
        <>
            <Modal
                title="配置"
                visible={visible}
                onOk={handleOk}
                afterClose={handleAfterClose} //>=1.16.0
                onCancel={handleCancel}
                closeOnEsc={true}
            >
                <Form ref={inpForm}>
                    <Input mode="password" rules={[{ required: true, message: "必填字段" }]} label="client_secret(Secret Key)" field="client_secret" initValue={store.client_secret} ></Input>
                    <Input mode="password" rules={[{ required: true, message: "必填字段" }]} label="client_id(API Key)" field="client_id" initValue={store.client_id}></Input>
                    <div className="flex items-center justify-end" >
                        怎么搞？
                        {helpTooltip}
                    </div>
                </Form>
            </Modal>
        </>
    );
})

function EmptyContent({ openSetting, hasToken }: { openSetting: () => void, hasToken: boolean }) {
    const { Text } = Typography
    return (
        <Empty
            image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
            darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
            title="ChatUi"
            description="开始尝试第一次对话吧"
        >
            {!hasToken ?
                <div >
                    <Text type="tertiary">请先进行配置</Text>
                    <Button icon={<IconSetting />} onClick={openSetting} size="small"></Button>
                </div> : ""
            }
        </Empty>
    )
}

export default function ChatBox() {
    const { Title } = Typography
    const [list, setList] = useState<TalkBoxProps[]>([]);
    const [genrating, setGenrating] = useState(false);
    const accessToken = useSelector<RootType>(state => state.llmSlice.accessToken)

    const hasToken = Boolean(accessToken)
    const chatable = useMemo(() => !genrating && hasToken, [genrating, hasToken])

    let textReader = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
    const configModalRef = useRef<{ showDialog: () => void }>()

    useEffect(() => {

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
    let ChatHeader =
        <Row type="flex" justify="space-between">
            <Col >
                <Title heading={4} color="tertiary" content="ChatUi" >ChatUi</Title>
            </Col>
            <Col>
                <Button icon={<IconSetting />} onClick={openDialog}>设置</Button>

            </Col>
        </Row>
    let ChatFooter =
        <Space className="w-full" style={{ position: "relative" }} >
            {genrating ? LoadingCard : ""}
            <ConfiModal ref={configModalRef} initShow={hasToken}></ConfiModal>
            <Button theme="solid" type="primary" size="large" icon={<IconPlus />} disabled={!chatable} onClick={newConversation}></Button>
            <Card className="flex-grow flex" style={{ padding: "12px" }} bodyStyle={{ padding: "0", width: "100%", display: "flex" }} shadows="always">
                <BoxInp chatable={chatable} addQ={addConversation}></BoxInp>
                <Button theme="solid" className="self-end" disabled={!chatable} icon={<IconSend />}>发送</Button>
            </Card>
        </Space>

    return (
        <Wrapper>
            <Card className="relative w-5/6 mt-4 mb-4 cursor-auto"
                shadows="always"
                header={ChatHeader}
                bodyStyle={{ padding: 0, height: 500, overflowY: "auto", position: "relative" }}
                footer={ChatFooter}
            >
                <List split={false}
                    emptyContent={<EmptyContent openSetting={openDialog} hasToken={hasToken} />}
                    dataSource={list}
                    className="overflow-y-auto"
                    renderItem={(item, i) => <TalkBox {...item} key={i}></TalkBox>} />
            </Card>
        </Wrapper >
    );
    function openDialog() {
        configModalRef.current?.showDialog()
    }
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
        setList([]);
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


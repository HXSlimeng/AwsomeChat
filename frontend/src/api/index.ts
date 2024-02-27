import { ConRole } from "@/components/TalkBox"
import { RootType } from "@/store"
import store from "@/store"
export type llmCfg = {
    client_id: string,
    client_secret: string,

}

export const getToken = (params: llmCfg) => {
    const { client_id, client_secret } = params
    return fetch(`/baidu/oauth/2.0/token?grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`, { method: "POST", })
}

export type LlmParams = {
    messages: { role: ConRole, content: string }[],
    stream: boolean
}

export const fetchMessage = async (body: LlmParams) => {
    const accessToken = store.getState().llmSlice.accessToken
    const res = await fetch(`/baidu/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${accessToken}`, { method: "post", body: JSON.stringify(body) })
    return res
}
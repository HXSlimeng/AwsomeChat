import { getToken, llmCfg } from "@/api";
import { createSlice, configureStore, createAsyncThunk } from "@reduxjs/toolkit";

export const getLLMtoken = createAsyncThunk("llmSlice/getToken", async (cfg: llmCfg, thunkAPI) => {
    const { client_secret, client_id } = cfg
    const res = await getToken({ client_id, client_secret })
    const result = await res.json()
    if (result.error) {
        throw new Error(result.error + '-' + result.error_description)
    } else {
        thunkAPI.dispatch(setConfig(cfg))
    }
    return result
})

const llmSlice = createSlice({
    name: "profile",
    initialState: {
        baseConfig: {
            client_secret: "",
            apiKey: "",
            client_id: "",
        },
        accessToken: null
    },
    reducers: {
        setConfig(state, { payload }) {
            state.baseConfig = payload
        },
        setToken(state, { payload }) {
            state.accessToken = payload
        }
    },
    extraReducers(builder) {
        builder.addCase(getLLMtoken.fulfilled, (state, action) => {
            state.accessToken = action.payload.access_token
        });
    },
})

export const { setConfig, setToken } = llmSlice.actions

export default llmSlice.reducer 

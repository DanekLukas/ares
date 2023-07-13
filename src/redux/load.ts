import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type Data = {
  ICO: string
  DIC: string
  OF: string
  DV: string
  NPF: string
  UC: string
  PB: string
  OC: string
}

export interface DataState {
  data: Data
  status: string
}

interface Pass {
  ico: string
}

const initialState: DataState = {
  data: { ICO: '', DIC: '', OF: '', DV: '', NPF: '', UC: '', PB: '', OC: '' },
  status: 'idle',
}

export async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

export const loadAsync = createAsyncThunk('load/total', async (state: Pass) => {
  const getData = async () => {
    const { data, error } = (await postData('/', {
      ico: state.ico,
    })) as { data?: Data; error?: number }
    return error === 0 ? data || initialState.data : initialState.data
  }
  return await getData()
  // The value we return becomes the `fulfilled` action payload
})

export const load = createSlice({
  name: 'load',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setData: (state, action: PayloadAction<Data>) => {
      state.data = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAsync.pending, (state: DataState) => {
        state.status = 'loading'
      })
      .addCase(loadAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.data = action.payload
      })
      .addCase(loadAsync.rejected, (state: DataState) => {
        state.status = 'failed'
      })
  },
})

export const selectData = (state: { load: DataState }) => {
  return { loadIcoRedux: state.load.data }
}

export const selectStatus = (state: { load: DataState }) => {
  return { statusRedux: state.load.status }
}

export default load.reducer

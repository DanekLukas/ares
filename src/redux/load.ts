import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

type Data = {
  ICO: string
  DIC: string
  OF: string
  DV: string
}

export interface DataState {
  data: Data
  status: string
}

interface Pass {
  ico: string
}

const initialState: DataState = { data: { ICO: '', DIC: '', OF: '', DV: '' }, status: 'idle' }

export const loadAsync = createAsyncThunk('load/total', async (state: Pass) => {
  const getData = async () => {
    const { data, error } = (
      await axios.post('/', {
        ico: state.ico,
      })
    ).data as { data?: Data; error?: number }
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

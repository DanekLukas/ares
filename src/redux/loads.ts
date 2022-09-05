import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

type Data = Array<{
  name: string
  addr: string
  ico: string
}>

export interface DataState {
  data: Data
  status: string
}

interface Pass {
  name: string
}

const initialState: DataState = { data: [], status: 'idle' }

export const loadsAsync = createAsyncThunk('loads/total', async (state: Pass) => {
  const getData = async () => {
    const { data, error } = (
      await axios.post('/', {
        name: state.name,
      })
    ).data as { data?: Data; error?: string }
    return error === '0' ? data || initialState.data : initialState.data
  }
  return await getData()
  // The value we return becomes the `fulfilled` action payload
})

export const loads = createSlice({
  name: 'loads',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setData: (state, action: PayloadAction<Data>) => {
      state.data = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadsAsync.pending, (state: DataState) => {
        state.status = 'loading'
      })
      .addCase(loadsAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.data = action.payload
      })
      .addCase(loadsAsync.rejected, (state: DataState) => {
        state.status = 'failed'
      })
  },
})

export const selectsData = (state: { loads: DataState }) => {
  return { loadsNameRedux: state.loads.data }
}

export const selectsStatus = (state: { loads: DataState }) => {
  return { statusRedux: state.loads.status }
}

export default loads.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const loading = createSlice({
  name: 'loading',
  initialState: {
    isPageLoading: false,
    isLoading: false,
  },
  reducers: {
    setPageLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isPageLoading: action.payload,
    }),
    setLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
  },
})

export const { setPageLoading, setLoading } = loading.actions
export default loading.reducer

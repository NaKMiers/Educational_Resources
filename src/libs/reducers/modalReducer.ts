import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const loading = createSlice({
  name: 'loading',
  initialState: {
    isPageLoading: false,
    isLoading: false,
    openAuthentication: false,
    authenticated: false,
    openSidebar: true,
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
    setOpenAuthentication: (state, action: PayloadAction<boolean>) => ({
      ...state,
      openAuthentication: action.payload,
    }),
    setAuthenticated: (state, action: PayloadAction<boolean>) => ({
      ...state,
      authenticated: action.payload,
    }),
    setOpenSidebar: (state, action: PayloadAction<boolean>) => ({
      ...state,
      openSidebar: action.payload,
    }),
  },
})

export const { setPageLoading, setLoading, setOpenAuthentication, setAuthenticated, setOpenSidebar } =
  loading.actions
export default loading.reducer

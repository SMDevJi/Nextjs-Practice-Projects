import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
    id: string | null | undefined,
    username: string | null | undefined,
    email: string | null | undefined
}

const initialState: IUser = {
    id: null,
    username: null,
    email: null
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.id = action.payload.id
            state.username = action.payload.username
            state.email = action.payload.email
        },
        clearUser: (state) => {
            state.id = null
            state.username = null
            state.email = null
        }
    }
})


export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
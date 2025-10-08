import { configureStore } from '@reduxjs/toolkit'

// APIs
import { medicineInventoryApi } from './features/inventory/api/medicineInventoryApi'

export const store = configureStore({
  reducer: {
    [medicineInventoryApi.reducerPath]: medicineInventoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(medicineInventoryApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
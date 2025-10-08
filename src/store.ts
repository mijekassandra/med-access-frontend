import { configureStore } from '@reduxjs/toolkit'

// APIs
import { medicineInventoryApi } from './features/inventory/api/medicineInventoryApi'
import { healthReportsApi } from './features/reports/api/healthReportsApi'
import { announcementApi } from './features/announcements/api/announcementApi'
import { healthEducationApi } from './features/health-education/api/healthEducationApi'

export const store = configureStore({
  reducer: {
    [medicineInventoryApi.reducerPath]: medicineInventoryApi.reducer,
    [healthReportsApi.reducerPath]: healthReportsApi.reducer,
    [announcementApi.reducerPath]: announcementApi.reducer,
    [healthEducationApi.reducerPath]: healthEducationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      medicineInventoryApi.middleware,
      healthReportsApi.middleware,
      announcementApi.middleware,
      healthEducationApi.middleware
    ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
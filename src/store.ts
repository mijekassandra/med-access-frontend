import { configureStore } from '@reduxjs/toolkit'

// APIs
import { medicineInventoryApi } from './features/inventory/api/medicineInventoryApi'
import { healthReportsApi } from './features/reports/api/healthReportsApi'
import { announcementApi } from './features/announcements/api/announcementApi'
import { healthEducationApi } from './features/health-education/api/healthEducationApi'
import { authApi } from './features/auth/api/authApi'
import { userApi } from './features/user/api/userApi'
import { serviceApi } from './features/services/api/serviceApi'
import { medicalRecordsApi } from './features/medical-records/api/medicalRecordsApi'
import { appointmentApi } from './features/telemedicine/api/appointmentApi'

// Slices
import authReducer from './features/auth/slice/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [medicineInventoryApi.reducerPath]: medicineInventoryApi.reducer,
    [healthReportsApi.reducerPath]: healthReportsApi.reducer,
    [announcementApi.reducerPath]: announcementApi.reducer,
    [healthEducationApi.reducerPath]: healthEducationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [medicalRecordsApi.reducerPath]: medicalRecordsApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      medicineInventoryApi.middleware,
      healthReportsApi.middleware,
      announcementApi.middleware,
      healthEducationApi.middleware,
      authApi.middleware,
      userApi.middleware,
      serviceApi.middleware,
      medicalRecordsApi.middleware,
      appointmentApi.middleware
    ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
# User API Documentation

## Base URL
```
/api/users
```

---

## 1. Create User (Register)

### Endpoint
```
POST /api/users/register
```

### Access
**Public** - No authentication required

### Request Headers
```json
{
  "Content-Type": "application/json"
}
```

### Request Body Schema

#### Required Fields
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `username` | `string` | Required, unique, max 50 chars, trimmed | Username for login |
| `password` | `string` | Required, min 6 chars | User password |
| `firstName` | `string` | Required, max 50 chars, trimmed | User's first name |
| `lastName` | `string` | Required, max 50 chars, trimmed | User's last name |

#### Optional Fields - Basic Info
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `email` | `string` | Optional, unique, email format | User email address |
| `address` | `string` | Optional, max 200 chars, trimmed | User address |
| `phone` | `string` | Optional, phone format regex | User phone number |
| `gender` | `string` | Optional, enum: `'male'`, `'female'`, `'other'` | User gender |
| `dateOfBirth` | `string` (ISO date) | Optional | User date of birth |
| `role` | `string` | Optional, enum: `'user'`, `'admin'`, `'doctor'`, default: `'user'` | User role |

#### Optional Fields - Patient Info
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `contactPerson` | `string` | Optional, max 100 chars, trimmed | Emergency contact person |
| `age` | `number` | Optional, min 0, max 150 | User age |
| `sex` | `string` | Optional, trimmed | User sex |
| `bloodType` | `string` | Optional, max 10 chars, trimmed | User blood type |
| `religion` | `string` | Optional, max 100 chars, trimmed | User religion |
| `civilStatus` | `string` | Optional, max 50 chars, trimmed | Civil status (e.g., single, married) |
| `height` | `number` | Optional, min 0 | User height (in cm) |
| `occupation` | `string` | Optional, max 100 chars, trimmed | User occupation |

#### Optional Fields - Doctor Specific
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `specialization` | `string` | **Required if role is 'doctor'**, max 100 chars, trimmed | Doctor's medical specialization |
| `prcLicenseNumber` | `string` | **Required if role is 'doctor'**, max 50 chars, trimmed | PRC license number |

### Validation Rules
- If `role` is `'doctor'`, both `specialization` and `prcLicenseNumber` are **required**
- `username` must be unique
- `email` must be unique (if provided)
- `email` format: `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`
- `phone` format: `/^[\+]?[1-9][\d]{0,15}$/`

### Request Example

#### Basic User Registration
```json
{
  "username": "johndoe",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City",
  "gender": "male",
  "dateOfBirth": "1990-01-15"
}
```

#### Patient Registration with Additional Info
```json
{
  "username": "janedoe",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "phone": "+1234567891",
  "address": "456 Oak Ave, City",
  "gender": "female",
  "dateOfBirth": "1992-05-20",
  "contactPerson": "John Doe",
  "age": 32,
  "sex": "female",
  "bloodType": "O+",
  "religion": "Christian",
  "civilStatus": "single",
  "height": 165,
  "occupation": "Teacher"
}
```

#### Doctor Registration
```json
{
  "username": "dr.smith",
  "password": "password123",
  "firstName": "Robert",
  "lastName": "Smith",
  "email": "dr.smith@example.com",
  "phone": "+1234567892",
  "address": "789 Medical Plaza, City",
  "gender": "male",
  "role": "doctor",
  "specialization": "Cardiology",
  "prcLicenseNumber": "PRC-12345"
}
```

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "address": "123 Main St, City",
    "phone": "+1234567890",
    "gender": "male",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "profilePicture": "",
    "contactPerson": null,
    "age": null,
    "sex": null,
    "bloodType": null,
    "religion": null,
    "civilStatus": null,
    "height": null,
    "occupation": null,
    "role": "user",
    "isActive": true,
    "lastLogin": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "specialization": null,
    "prcLicenseNumber": null
  }
}
```

### Error Responses

#### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Username is required",
    "Password must be at least 6 characters"
  ]
}
```

#### 400 Bad Request - Duplicate User
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```
or
```json
{
  "success": false,
  "message": "Username already taken"
}
```

#### 400 Bad Request - Missing Doctor Fields
```json
{
  "success": false,
  "message": "Specialization is required for doctors"
}
```
or
```json
{
  "success": false,
  "message": "PRC License Number is required for doctors"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error during registration"
}
```

---

## 2. Update User

### Endpoint
```
PUT /api/users/:id
```

### Access
**Private** - Requires authentication
- User can update their own profile
- Admin can update any user profile

### Request Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | MongoDB ObjectId of the user to update |

### Request Body Schema

**All fields are optional** - Only include fields you want to update.

#### Updatable Fields - Basic Info
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `username` | `string` | Optional, unique, max 50 chars, trimmed | Username for login |
| `email` | `string` | Optional, unique, email format | User email address |
| `firstName` | `string` | Optional, max 50 chars, trimmed | User's first name |
| `lastName` | `string` | Optional, max 50 chars, trimmed | User's last name |
| `address` | `string` | Optional, max 200 chars, trimmed | User address |
| `phone` | `string` | Optional, phone format regex | User phone number |
| `gender` | `string` | Optional, enum: `'male'`, `'female'`, `'other'` | User gender |
| `dateOfBirth` | `string` (ISO date) | Optional | User date of birth |
| `profilePicture` | `string` | Optional | URL or path to profile picture |
| `role` | `string` | Optional, enum: `'user'`, `'admin'`, `'doctor'` | User role |
| `isActive` | `boolean` | Optional | Account active status |

#### Updatable Fields - Patient Info
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `contactPerson` | `string` | Optional, max 100 chars, trimmed | Emergency contact person |
| `age` | `number` | Optional, min 0, max 150 | User age |
| `sex` | `string` | Optional, trimmed | User sex |
| `bloodType` | `string` | Optional, max 10 chars, trimmed | User blood type |
| `religion` | `string` | Optional, max 100 chars, trimmed | User religion |
| `civilStatus` | `string` | Optional, max 50 chars, trimmed | Civil status |
| `height` | `number` | Optional, min 0 | User height (in cm) |
| `occupation` | `string` | Optional, max 100 chars, trimmed | User occupation |

#### Updatable Fields - Doctor Specific
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `specialization` | `string` | Optional, max 100 chars, trimmed | Doctor's medical specialization (required if role is 'doctor') |
| `prcLicenseNumber` | `string` | Optional, max 50 chars, trimmed | PRC license number (required if role is 'doctor') |

### Validation Rules
- If `role` is `'doctor'`, both `specialization` and `prcLicenseNumber` must be provided and non-empty
- `username` must be unique (if provided)
- `email` must be unique (if provided)
- All validation rules from registration apply to updated values

### Request Examples

#### Update Basic Info
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567899",
  "address": "789 New Street, City"
}
```

#### Update Patient Info
```json
{
  "age": 35,
  "bloodType": "A+",
  "height": 170,
  "occupation": "Engineer",
  "civilStatus": "married"
}
```

#### Update Doctor Info
```json
{
  "specialization": "Pediatrics",
  "prcLicenseNumber": "PRC-67890"
}
```

#### Partial Update (Multiple Fields)
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe.new@example.com",
  "phone": "+1234567891",
  "address": "456 Updated Ave, City",
  "age": 33,
  "bloodType": "O+",
  "height": 168,
  "occupation": "Software Developer"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "fullName": "John Smith",
    "address": "789 New Street, City",
    "phone": "+1234567899",
    "gender": "male",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "profilePicture": "",
    "contactPerson": null,
    "age": 35,
    "sex": null,
    "bloodType": "A+",
    "religion": null,
    "civilStatus": "married",
    "height": 170,
    "occupation": "Engineer",
    "role": "user",
    "isActive": true,
    "lastLogin": "2024-01-20T08:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z",
    "specialization": null,
    "prcLicenseNumber": null
  }
}
```

### Error Responses

#### 400 Bad Request - Invalid User ID
```json
{
  "success": false,
  "message": "Invalid user ID format"
}
```

#### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "First name cannot be more than 50 characters",
    "Email already exists"
  ]
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to update this user"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error updating user"
}
```

---

## RTK Query Integration Examples

### TypeScript Types for Frontend

```typescript
// user.types.ts
export interface UserRegistrationRequest {
  // Required
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  
  // Optional - Basic
  email?: string;
  address?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string; // ISO date string
  role?: 'user' | 'admin' | 'doctor';
  
  // Optional - Patient Info
  contactPerson?: string;
  age?: number;
  sex?: string;
  bloodType?: string;
  religion?: string;
  civilStatus?: string;
  height?: number;
  occupation?: string;
  
  // Optional - Doctor (Required if role is 'doctor')
  specialization?: string;
  prcLicenseNumber?: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  profilePicture?: string;
  role?: 'user' | 'admin' | 'doctor';
  isActive?: boolean;
  contactPerson?: string;
  age?: number;
  sex?: string;
  bloodType?: string;
  religion?: string;
  civilStatus?: string;
  height?: number;
  occupation?: string;
  specialization?: string;
  prcLicenseNumber?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  profilePicture: string;
  contactPerson?: string;
  age?: number;
  sex?: string;
  bloodType?: string;
  religion?: string;
  civilStatus?: string;
  height?: number;
  occupation?: string;
  role: 'user' | 'admin' | 'doctor';
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  specialization?: string;
  prcLicenseNumber?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export type UserRegistrationResponse = ApiResponse<UserProfile>;
export type UserUpdateResponse = ApiResponse<UserProfile>;
```

### RTK Query API Slice

```typescript
// userApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  UserRegistrationRequest,
  UserUpdateRequest,
  UserRegistrationResponse,
  UserUpdateResponse,
} from './types/user.types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/users',
    prepareHeaders: (headers, { getState }) => {
      // Get token from state (adjust based on your auth setup)
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Register User
    registerUser: builder.mutation<UserRegistrationResponse, UserRegistrationRequest>({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Update User
    updateUser: builder.mutation<UserUpdateResponse, { id: string; data: UserUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useUpdateUserMutation,
} = userApi;
```

### Usage in React Components

```typescript
// RegisterUserForm.tsx
import { useRegisterUserMutation } from '../api/userApi';
import type { UserRegistrationRequest } from '../types/user.types';

function RegisterUserForm() {
  const [registerUser, { isLoading, error, isSuccess }] = useRegisterUserMutation();

  const handleSubmit = async (formData: UserRegistrationRequest) => {
    try {
      const result = await registerUser(formData).unwrap();
      console.log('User registered:', result.data);
    } catch (err: any) {
      console.error('Registration failed:', err.data?.errors || err.data?.message);
    }
  };

  return (
    // Your form JSX here
  );
}

// UpdateUserForm.tsx
import { useUpdateUserMutation } from '../api/userApi';
import type { UserUpdateRequest } from '../types/user.types';

function UpdateUserForm({ userId }: { userId: string }) {
  const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();

  const handleSubmit = async (formData: UserUpdateRequest) => {
    try {
      const result = await updateUser({ id: userId, data: formData }).unwrap();
      console.log('User updated:', result.data);
    } catch (err: any) {
      console.error('Update failed:', err.data?.errors || err.data?.message);
    }
  };

  return (
    // Your form JSX here
  );
}
```

### Form Validation Example

```typescript
// validation.ts
import { UserRegistrationRequest, UserUpdateRequest } from './types/user.types';

export const validateUserRegistration = (data: UserRegistrationRequest): string[] => {
  const errors: string[] = [];

  // Required fields
  if (!data.username || data.username.trim().length === 0) {
    errors.push('Username is required');
  }
  if (data.username && data.username.length > 50) {
    errors.push('Username cannot be more than 50 characters');
  }
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.push('First name is required');
  }
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  // Email validation
  if (data.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.push('Please enter a valid email');
  }

  // Phone validation
  if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone)) {
    errors.push('Please enter a valid phone number');
  }

  // Doctor-specific validation
  if (data.role === 'doctor') {
    if (!data.specialization || data.specialization.trim().length === 0) {
      errors.push('Specialization is required for doctors');
    }
    if (!data.prcLicenseNumber || data.prcLicenseNumber.trim().length === 0) {
      errors.push('PRC License Number is required for doctors');
    }
  }

  // Age validation
  if (data.age !== undefined) {
    if (data.age < 0) errors.push('Age cannot be negative');
    if (data.age > 150) errors.push('Age seems invalid');
  }

  // Height validation
  if (data.height !== undefined && data.height < 0) {
    errors.push('Height cannot be negative');
  }

  return errors;
};
```

---

## Notes

1. **Password Field**: The password field is never returned in API responses for security reasons.

2. **Date Format**: Use ISO 8601 date strings (e.g., `"1990-01-15"` or `"1990-01-15T00:00:00.000Z"`).

3. **Role Default**: If `role` is not provided during registration, it defaults to `'user'`.

4. **Doctor Validation**: When updating a user to `role: 'doctor'`, ensure both `specialization` and `prcLicenseNumber` are provided.

5. **Authentication**: The update endpoint requires authentication. Include the JWT token in the `Authorization` header as `Bearer <token>`.

6. **Authorization**: Users can only update their own profile unless they are an admin.

7. **Field Trimming**: String fields are automatically trimmed (leading/trailing whitespace removed).

8. **Select Fields**: The `password` field is excluded from queries by default (`select: false` in schema).

9. **Virtual Field**: `fullName` is a virtual field computed as `${firstName} ${lastName}` and is included in responses.

10. **Timestamps**: `createdAt` and `updatedAt` are automatically managed by Mongoose.


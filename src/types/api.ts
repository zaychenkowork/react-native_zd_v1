// API response types
// Example:
//

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type UserResponse = {
  id: number;
  email: string;
  fullName: string;
};

export type UpdateUserRequest = {
  id: number;
  fullName: string;
};

export type ErrorResponse = {
  message: string;
  status: number;
};

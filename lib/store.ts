import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gender: "male" | "female"
}

interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
  searchQuery: string
  currentPage: number
  itemsPerPage: number

  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  updateUser: (user: User) => void
  deleteUser: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setCurrentPage: (page: number) => void
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set) => ({
      users: [],
      loading: false,
      error: null,
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 5,

      setUsers: (users) => set({ users }),
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (user) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === user.id ? user : u)),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: "users-store",
    },
  ),
)

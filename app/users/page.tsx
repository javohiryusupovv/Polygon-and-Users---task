"use client";

import { useEffect, useState } from "react";
import { useUsersStore, type User } from "@/lib/store";
import type { UserFormData } from "@/lib/schemas/userSchema";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, MoveLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { UsersTable } from "@/components/users/users-table";
import { Pagination } from "@/components/users/pagination";
import { UserFormModal } from "@/components/users/user-form-modal";
import { SearchBar } from "@/components/users/search-bar";
import {
  addUserToDB,
  deleteUserFromDB,
  getAllUsers,
  updateUserInDB,
} from "@/lib/db/db";
import { DeleteConfirmationModal } from "@/components/users/delete-confirmation-modal";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const {
    users,
    loading,
    error,
    setUsers,
    addUser,
    updateUser,
    deleteUser,
    setLoading,
    setError,
  } = useUsersStore();
  const [successMessage, setSuccessMessage] = useState("");

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const router = useRouter()

  // Load users from IndexedDB on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const dbUsers = await getAllUsers();
        setUsers(dbUsers);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [setUsers, setLoading, setError]);

  // Show success message temporarily
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleCreateUser = async (data: UserFormData) => {
    try {
      setLoading(true);
      setError(null);

      const newUser: User = {
        id: uuidv4(),
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        gender: data.gender,
      };

      await addUserToDB(newUser);
      addUser(newUser);
      setFormModalOpen(false);
      setSuccessMessage("User created successfully!");
    } catch (err) {
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      setError(null);

      const updatedUser: User = {
        ...selectedUser,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        gender: data.gender,
      };

      await updateUserInDB(updatedUser);
      updateUser(updatedUser);
      setFormModalOpen(false);
      setSelectedUser(null);
      setSuccessMessage("User updated successfully!");
    } catch (err) {
      setError("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      setError(null);

      await deleteUserFromDB(userToDelete.id);
      deleteUser(userToDelete.id);
      setDeleteModalOpen(false);
      setUserToDelete(null);
      setSuccessMessage("User deleted successfully!");
    } catch (err) {
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl min-h-screen bg-background p-4 md:p-6">
      <Button onClick={()=> router.push("/")} className="mb-5"><MoveLeft/> Back menyu</Button>
      <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Users Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage users in your system
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar />
            </div>
            <Button
              onClick={() => {
                setSelectedUser(null);
                setFormModalOpen(true);
              }}
              disabled={loading}
              className="bg-green-400 transition-all duration-200 hover:bg-green-400/70"
            >
              + Create User
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading && users.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <>
            <UsersTable onEdit={handleEditClick} onDelete={handleDeleteClick} />

            {/* Pagination */}
            <div className="mt-6">
              <Pagination />
            </div>
          </>
        )}

        {/* Modals */}
        <UserFormModal
          open={formModalOpen}
          onOpenChange={setFormModalOpen}
          user={selectedUser || undefined}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          isLoading={loading}
        />

        <DeleteConfirmationModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          user={userToDelete}
          onConfirm={handleDeleteUser}
          isLoading={loading}
        />
      </>
    </div>
  );
}

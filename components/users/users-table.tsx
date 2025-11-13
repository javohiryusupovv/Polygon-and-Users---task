"use client";

import { useUsersStore, type User } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface UsersTableProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({ onEdit, onDelete }: UsersTableProps) {
  const { users, searchQuery, currentPage, loading, itemsPerPage } =
    useUsersStore();

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        {/* HEADER DOIM KORINADI */}
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Birth Date</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>

        {/* BODY — loading bo'lsa skeleton, bo'lmasa data */}
        <TableBody>
          {loading ? (
            <>
              {Array.from({ length: 2 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{formatDate(user.birthDate)}</TableCell>
                <TableCell className="capitalize">{user.gender}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(user)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                {searchQuery
                  ? "No users found matching your search"
                  : "No users yet. Create one to get started!"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

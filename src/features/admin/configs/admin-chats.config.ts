import type { ColumnDef } from "@tanstack/react-table"

export type User = {
  id: string
  name: string
  email: string
}

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]
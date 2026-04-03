import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../ui/checkbox";
import { CheckCircle, X } from "lucide-react";
import type { MainCategoryResponse } from "@/types/response/genres/mainCategoryResponse";
import IconWithTooltip from "@/components/common/IconWithTooltip";

const columns: ColumnDef<MainCategoryResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("is_active");

      return (
        <div className="capitalize">
          {status ? (
            <IconWithTooltip
              icon={<CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
              tooltip="Active"
            />
          ) : (
            <IconWithTooltip
              icon={<X className="mr-2 h-4 w-4 text-red-500" />}
              tooltip="Inactive"
            />
          )}
        </div>
      );
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const category = row.original;

  //     return (
  //       <AlertDialog>
  //         <AlertDialogTrigger asChild>
  //           <Button variant="outline" size="sm" className="cursor-pointer">
  //             Edit{" "}
  //           </Button>
  //         </AlertDialogTrigger>
  //         <AlertDialogContent>
  //           <AlertDialogHeader>
  //             <AlertDialogTitle className="flex items-center gap-2">
  //               <FolderPlus className="h-5 w-5" />
  //               Create New Category
  //             </AlertDialogTitle>
  //             <AlertDialogDescription>
  //               Add a new category to organize your content
  //             </AlertDialogDescription>
  //           </AlertDialogHeader>
  //           <Separator />
  //           <MainCategoryForm
  //             mode="edit"
  //             defaultValues={{
  //               id: category.id.toString(),
  //               name: category.name,
  //               key: category.key,
  //               is_active: category.is_active,
  //             }}
  //           />
  //           <AlertDialogCancel>Cancel</AlertDialogCancel>
  //         </AlertDialogContent>
  //       </AlertDialog>
  //     );
  //   },
  // },
];

export default columns;

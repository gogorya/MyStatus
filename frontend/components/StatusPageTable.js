// UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Next.js utilities
import Link from "next/link";

export default function Page({ props }) {
  return (
    <div className="border rounded-lg w-full">
      {props.rows.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              {props.columns.map((col, index) => {
                return (
                  <TableHead key={index} className={col.class}>
                    {col.name}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {props.rows.map((row, rindex) => {
              return (
                <TableRow key={rindex}>
                  <TableCell>{row.name}</TableCell>

                  <TableCell>
                    <Link
                      href={`/${row.slug}`}
                      target="_blank"
                      className={
                        row.active
                          ? "hover:underline relative"
                          : "pointer-events-none"
                      }
                    >
                      {row.slug}
                      <span
                        className={
                          row.active
                            ? "text-gray-600 dark:text-gray-400 text-base absolute top-[-2px]"
                            : "hidden"
                        }
                      >
                        &nbsp;&#8599;
                      </span>
                    </Link>
                  </TableCell>

                  <TableCell>
                    {row.monitors.map((monitor) => monitor.name).join(", ")}
                  </TableCell>

                  <TableCell className="text-right">
                    {row.active ? "Yes" : "No"}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu model={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          +
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                props.handleEdit(row._id);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          {props.dialogContent}
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                props.handleDelete(row._id);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="flex justify-center p-2">
          <span className="text-sm">No Status Pages available</span>
        </div>
      )}
    </div>
  );
}

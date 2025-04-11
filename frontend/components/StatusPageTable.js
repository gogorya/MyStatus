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

export default function StatusPageTable({ props }) {
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
                      className={row.active ? undefined : "pointer-events-none"}
                    >
                      <span
                        className={row.active ? "hover:underline" : undefined}
                      >
                        {row.slug}
                      </span>
                      <span
                        className={
                          row.active
                            ? "text-gray-600 dark:text-gray-400 text-base ml-1"
                            : "hidden"
                        }
                      >
                        &#8599;
                      </span>
                    </Link>
                  </TableCell>

                  <TableCell>
                    {row.monitors.map((monitor) => monitor.name).join(", ")}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end">
                      {row.active ? (
                        <>
                          <div className="mr-3 w-2 h-2 rounded-md bg-green-400"></div>
                          <span>Yes</span>
                        </>
                      ) : (
                        <span>No</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu model={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">&#8285;</Button>
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

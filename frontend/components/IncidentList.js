// Components
import IncidentStatusList from "@/components/IncidentStatusList";
import DeleteConfirmation from "@/components/DeleteConfirmation";

// UI components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

// Clerk utilities
import { SignedIn } from "@clerk/nextjs";

export default function IncidentList({ props }) {
  return (
    <div className="w-full">
      {props.incidents.length ? (
        <div className="space-y-4">
          {props.incidents.map((incident) => {
            return (
              <div
                key={incident._id}
                className="flex flex-col border p-2 rounded-lg w-full space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <Label>{incident.name}</Label>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      &nbsp;&#8594;&nbsp;{incident.monitor.name}
                    </span>
                  </div>

                  <div className="flex items-center">
                    {incident.statusHistory[0].status !== "Resolved" && (
                      <div className="mr-3 w-2 h-2 rounded-md bg-green-400"></div>
                    )}
                    <SignedIn>
                      {props.dialogContent && (
                        <DropdownMenu model={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">&#8285;</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Dialog>
                              <DialogTrigger asChild>
                                {incident.statusHistory[0].status !==
                                  "Resolved" && (
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      props.handleEdit(incident);
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                )}
                              </DialogTrigger>
                              {props.dialogContent}
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DeleteConfirmation
                                props={{
                                  handleDelete: props.handleDelete,
                                  _id: incident._id,
                                  item: `Incident: ${incident.name}`,
                                }}
                              />
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </SignedIn>
                  </div>
                </div>

                <IncidentStatusList
                  props={{ statusHistory: incident.statusHistory }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center p-2">
          <span className="text-sm">No Incidents available</span>
        </div>
      )}
    </div>
  );
}

// UI components
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export default function DeleteConfirmation({ props }) {
  const handleDeleteClick = () => {
    props.handleDelete(props._id);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>Are you sure you want to delete:</DialogDescription>
        <div>
          <Label>{props.item}</Label>
        </div>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"secondary"}>Close</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={handleDeleteClick} variant="destructive">
            Delete
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

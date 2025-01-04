// ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";

export default function Dashboard({ props, children }) {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>{props.title}</CardTitle>
            <CardDescription>{props.description}</CardDescription>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={props.handleCreate}>Create</Button>
              </DialogTrigger>
              {props.dialogContent}
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

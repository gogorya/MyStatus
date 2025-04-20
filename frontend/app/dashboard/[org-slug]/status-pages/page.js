"use client";

// Components
import Dashboard from "@/components/Dashboard";
import StatusPageTable from "@/components/StatusPageTable";

// UI components
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Next.js
import Form from "next/form";

// Hooks
import { useState, useEffect } from "react";

// Library
import {
  monitorsApiEndpoint,
  statusPagesApiEndpoint,
} from "@/lib/apiEndpoints";
import { fetchApi, generateSlug } from "@/lib/utils";

export default function Page() {
  // States
  const [statusPage, setStatusPage] = useState({
    name: "",
    slug: "",
    active: true,
    _id: null,
    monitors: [],
  });
  const [statusPages, setStatusPages] = useState([]);

  // Fetch Status Pages data when the component mounts
  useEffect(() => {
    const fetchStatusPages = async () => {
      const res = await fetchApi.get(statusPagesApiEndpoint);
      if (res && res.data) setStatusPages(res.data.statusPages);
    };
    fetchStatusPages();
  }, []);

  // Handle state changes
  const handleStatusChange = () => {
    setStatusPage({ ...statusPage, active: !statusPage.active });
  };
  const handleNameChange = (e) => {
    if (statusPage._id == null) {
      const name = e.target.value;
      const slug = generateSlug(name);
      setStatusPage({ ...statusPage, name, slug });
    }
  };

  // Handle button operations
  const handleCreate = async () => {
    try {
      const res = await fetchApi.get(monitorsApiEndpoint);
      if (res.data) {
        const monitorsWithBoolean = res.data.monitors.map((monitor) => ({
          ...monitor,
          selected: false,
        }));
        setStatusPage({
          name: "",
          slug: "",
          active: true,
          _id: null,
          monitors: monitorsWithBoolean,
        });
      }
    } catch (error) {
      console.error("Failed to fetch monitors:", error);
    }
  };

  const handleEdit = async (_id) => {
    const statusPageToEdit = statusPages.find(
      (statusPage) => statusPage._id === _id
    );
    try {
      const res = await fetchApi.get(monitorsApiEndpoint);
      if (res.data) {
        const monitorsWithBoolean = res.data.monitors.map((monitor) => ({
          ...monitor,
          selected: statusPageToEdit.monitors.some(
            (m) => m._id === monitor._id
          ),
        }));
        setStatusPage({
          name: statusPageToEdit.name,
          slug: statusPageToEdit.slug,
          active: statusPageToEdit.active,
          _id: statusPageToEdit._id,
          monitors: monitorsWithBoolean,
        });
      }
    } catch (error) {
      console.error("Failed to fetch monitors:", error);
    }
  };

  const handleDelete = async (_id) => {
    try {
      const res = await fetchApi.delete(`${statusPagesApiEndpoint}/${_id}`);
    } catch (error) {
      console.error(error);
    }
    setStatusPages((prevItems) => prevItems.filter((item) => item._id !== _id));
  };

  const handleSave = async () => {
    const data = {
      name: statusPage.name,
      slug: statusPage.slug,
      active: statusPage.active,
      monitors: statusPage.monitors
        .filter((monitor) => monitor.selected)
        .map(({ name, link, active, selected, ...rest }) => rest),
    };
    if (statusPage._id != null) {
      delete data.name;
      delete data.slug;
    }
    try {
      const res =
        statusPage._id == null
          ? await fetchApi.post(statusPagesApiEndpoint, data)
          : await fetchApi.patch(
              `${statusPagesApiEndpoint}/${statusPage._id}`,
              data
            );
      if (res && res.data) {
        if (statusPage._id != null) {
          setStatusPages((prevItems) =>
            prevItems.map((item) =>
              item._id === statusPage._id ? { ...res.data.statusPage } : item
            )
          );
        } else {
          setStatusPages((prevItems) => [...prevItems, res.data.statusPage]);
        }
      } else if (res && res.error === "Slug already exists") {
        toast("Slug for the page already exists", {
          description: "Please create with a new one",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Dialog content for creating or editing a Status Page
  const dialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {statusPage._id == null ? "Create " : "Edit "}Status Page
        </DialogTitle>
        <DialogDescription>Slug needs to be unique</DialogDescription>
      </DialogHeader>

      <div>
        <Form className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Name</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="airplane-mode">Active</Label>
                <Switch
                  checked={statusPage.active}
                  onCheckedChange={handleStatusChange}
                />
              </div>
            </div>
            <Input
              type="text"
              placeholder="My Status Page"
              onChange={handleNameChange}
              value={statusPage.name}
              disabled={statusPage._id != null}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              type="text"
              placeholder="my-status-page"
              value={statusPage.slug}
              disabled={true}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Monitors</Label>
            <div className="space-y-1">
              {statusPage.monitors.map((monitor, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    checked={monitor.selected}
                    onCheckedChange={() => {
                      const updatedMonitors = [...statusPage.monitors];
                      updatedMonitors[index].selected =
                        !updatedMonitors[index].selected;
                      setStatusPage({
                        ...statusPage,
                        monitors: updatedMonitors,
                      });
                    }}
                  />
                  <Label>{monitor.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </Form>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={statusPage.name === ""}
          >
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );

  // Props
  const dashboardProps = {
    title: "Status Pages",
    description: "Overview",
    dialogContent: dialogContent,
    handleCreate: handleCreate,
  };
  const tableProps = {
    columns: [
      { name: "Name", class: "w-40" },
      { name: "Slug", class: "w-40" },
      { name: "Monitors", class: "w-80" },
      { name: "Active", class: "text-right" },
    ],
    rows: statusPages,
    dialogContent: dialogContent,
    handleEdit: handleEdit,
    handleDelete: handleDelete,
  };

  return (
    <div>
      <Dashboard props={dashboardProps}>
        <StatusPageTable props={tableProps} />
      </Dashboard>
    </div>
  );
}

"use client";

// components
import Dashboard from "@/components/Dashboard";
import StatusPageTable from "@/components/StatusPageTable";

// ui components
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

// hooks
import Form from "next/form";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

// lib
import { getDataAction } from "../../../actions";
import {
  getMonitors,
  getStatusPages,
  createStatusPage,
  updateStatusPage,
  deleteStatusPage,
} from "@/lib/apiEndpoints";
import { generateSlug } from "@/lib/utils";
import { axiosPost } from "@/lib/utils";

export default function Page() {
  // states
  const [statusPage, setStatusPage] = useState({
    name: "",
    slug: "",
    active: true,
    _id: null,
    monitors: [],
  });
  const [statusPages, setStatusPages] = useState([]);

  useEffect(() => {
    const fetchStatusPages = async () => {
      const res = await getDataAction(getStatusPages);
      if (res.data) setStatusPages(res.data.statusPages);
    };
    fetchStatusPages();
  }, []);

  // handle state changes
  const handleActiveStatus = () => {
    setStatusPage({ ...statusPage, active: !statusPage.active });
  };
  const handleNameChange = (e) => {
    if (statusPage._id == null) {
      const name = e.target.value;
      const slug = generateSlug(name);
      setStatusPage({ ...statusPage, name, slug });
    }
  };
  const handleCreate = async () => {
    try {
      const res = await getDataAction(getMonitors);
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
      const res = await getDataAction(getMonitors);
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

  const { getToken } = useAuth();

  // handle delete
  const handleDelete = async (_id) => {
    try {
      const token = await getToken();
      const data = { _id };
      const res = await axiosPost(deleteStatusPage, token, data);
    } catch (error) {
      console.error(error);
    }
    setStatusPages((prevItems) => prevItems.filter((item) => item._id !== _id));
  };

  // handle save
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
      data._id = statusPage._id;
      delete data.name;
      delete data.slug;
    }
    try {
      const token = await getToken();
      const res = await axiosPost(
        statusPage._id == null ? createStatusPage : updateStatusPage,
        token,
        data
      );
      if (statusPage._id != null) {
        setStatusPages((prevItems) =>
          prevItems.filter((item) => item._id !== statusPage._id)
        );
      }
      setStatusPages((prevItems) => [...prevItems, res.data.statusPage]);
    } catch (error) {
      console.error(error);
    }
  };

  const dialogContent = () => {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {statusPage._id == null ? "Create " : "Edit "}Status Page
          </DialogTitle>
          <DialogDescription>Slug needs to be unique</DialogDescription>
        </DialogHeader>
        <div>
          <Form>
            <Label>Name</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="airplane-mode">Active</Label>
              <Switch
                checked={statusPage.active}
                onCheckedChange={handleActiveStatus}
              />
            </div>
            <Input
              type="text"
              placeholder="My Status Page"
              onChange={handleNameChange}
              value={statusPage.name}
              disabled={statusPage._id != null}
            />
            <Label>Slug</Label>
            <Input
              type="text"
              placeholder="my-status-page"
              value={statusPage.slug}
              disabled={true}
            />
            {statusPage.monitors.map((monitor, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  checked={monitor.selected}
                  onCheckedChange={() => {
                    const updatedMonitors = [...statusPage.monitors];
                    updatedMonitors[index].selected =
                      !updatedMonitors[index].selected;
                    setStatusPage({ ...statusPage, monitors: updatedMonitors });
                  }}
                />
                <Label>{monitor.name}</Label>
              </div>
            ))}
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={handleSave}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  };

  // props
  const dashboardProps = {
    title: "Status Pages",
    description: "Overview",
    dialogContent: dialogContent(),
    handleCreate: handleCreate,
  };
  const tableProps = {
    columns: [
      { name: "Name", class: "w-40" },
      { name: "Slug", class: "w-48" },
      { name: "Monitors", class: "" },
      { name: "Active", class: "text-right" },
    ],
    rows: statusPages,
    dialogContent: dialogContent(),
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

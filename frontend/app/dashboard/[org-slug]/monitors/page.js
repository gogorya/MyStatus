"use client";

// Components
import Dashboard from "@/components/Dashboard";
import MonitorTable from "@/components/MonitorTable";

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

// Next.js
import Form from "next/form";

// Hooks
import { useState, useEffect } from "react";

// Library
import { monitorsApiEndpoint } from "@/lib/apiEndpoints";
import { fetchApi, checkLink } from "@/lib/utils";

export default function Page() {
  // States
  const [monitor, setMonitor] = useState({
    name: "",
    link: "",
    active: true,
    _id: null,
  });
  const [monitors, setMonitors] = useState([]);
  const [isLinkValid, setIsLinkValid] = useState(false);

  // Fetch Monitors data when the component mounts
  useEffect(() => {
    const fetchMonitors = async () => {
      const res = await fetchApi.get(monitorsApiEndpoint);
      if (res && res.data) setMonitors(res.data.monitors);
    };
    fetchMonitors();
  }, []);

  // Handle state changes
  const handleStatusChange = () => {
    setMonitor({ ...monitor, active: !monitor.active });
  };
  const handleNameChange = (e) => {
    setMonitor({ ...monitor, name: e.target.value });
  };
  const handleLinkChange = (e) => {
    setMonitor({ ...monitor, link: e.target.value });
    if (checkLink(e.target.value)) setIsLinkValid(true);
    else setIsLinkValid(false);
  };

  // Handle button operations
  const handleCreate = () => {
    setMonitor({ name: "", link: "", active: true, _id: null });
  };

  const handleEdit = (_id) => {
    const monitorToEdit = monitors.find((monitor) => monitor._id === _id);
    if (monitorToEdit) {
      if (checkLink(monitorToEdit.link)) setIsLinkValid(true);
      else setIsLinkValid(false);
      setMonitor({
        name: monitorToEdit.name,
        link: monitorToEdit.link,
        active: monitorToEdit.active,
        _id: monitorToEdit._id,
      });
    }
  };

  const handleDelete = async (_id) => {
    try {
      const res = await fetchApi.delete(`${monitorsApiEndpoint}/${_id}`);
    } catch (error) {
      console.error(error);
    }
    setMonitors((prevItems) => prevItems.filter((item) => item._id !== _id));
  };

  const handleSave = async () => {
    const data = {
      name: monitor.name,
      link: monitor.link,
      active: monitor.active,
    };
    try {
      const res =
        monitor._id == null
          ? await fetchApi.post(monitorsApiEndpoint, data)
          : await fetchApi.patch(`${monitorsApiEndpoint}/${monitor._id}`, data);
      if (monitor._id != null) {
        setMonitors((prevItems) =>
          prevItems.filter((item) => item._id !== monitor._id)
        );
      }
      setMonitors((prevItems) => [...prevItems, res.data.monitor]);
    } catch (error) {
      console.error(error);
    }
  };

  // Dialog content for creating or editing a Monitor
  const dialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {monitor._id == null ? "Create " : "Edit "}Monitor
        </DialogTitle>
        <DialogDescription>Please ensure link is proper</DialogDescription>
      </DialogHeader>

      <div>
        <Form className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Name</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="airplane-mode">Active</Label>
                <Switch
                  checked={monitor.active}
                  onCheckedChange={handleStatusChange}
                />
              </div>
            </div>
            <Input
              type="text"
              placeholder="My website"
              onChange={handleNameChange}
              value={monitor.name}
            />
          </div>
          <div className="space-y-2">
            <Label>Link</Label>
            <Input
              type="text"
              placeholder="https://mywebsite.com"
              onChange={handleLinkChange}
              value={monitor.link}
            />
          </div>
        </Form>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={
              monitor.name === "" || monitor.link === "" || !isLinkValid
            }
          >
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );

  // Props
  const dashboardProps = {
    title: "Monitors",
    description: "Overview",
    dialogContent: dialogContent,
    handleCreate: handleCreate,
  };
  const tableProps = {
    columns: [
      { name: "Name", class: "w-40" },
      { name: "Link", class: "" },
      { name: "Active", class: "text-right" },
    ],
    rows: monitors,
    dialogContent: dialogContent,
    handleEdit: handleEdit,
    handleDelete: handleDelete,
  };

  return (
    <div>
      <Dashboard props={dashboardProps}>
        <MonitorTable props={tableProps} />
      </Dashboard>
    </div>
  );
}

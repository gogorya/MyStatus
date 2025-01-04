"use client";

// components
import Dashboard from "@/components/Dashboard";
import Table from "@/components/Table";

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

// hooks
import Form from "next/form";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

// lib
import { getMonitorsAction } from "../../../actions";
import {
  createMonitor,
  updateMonitor,
  deleteMonitor,
} from "@/lib/apiEndpoints";
import { axiosPost } from "@/lib/utils";

export default function Page() {
  // states
  const [monitor, setMonitor] = useState({
    name: "",
    link: "",
    active: true,
    _id: null,
  });
  const [monitors, setMonitors] = useState([]);

  useEffect(() => {
    const getMonitors = async () => {
      const res = await getMonitorsAction();
      if (res.data) setMonitors(res.data.monitors);
    };
    getMonitors();
  }, []);

  // handle state changes
  const handleActiveStatus = () => {
    setMonitor({ ...monitor, active: !monitor.active });
  };
  const handleNameChange = (e) => {
    setMonitor({ ...monitor, name: e.target.value });
  };
  const handleLinkChange = (e) => {
    setMonitor({ ...monitor, link: e.target.value });
  };
  const handleCreate = () => {
    setMonitor({ name: "", link: "", active: true, _id: null });
  };
  const handleEdit = (_id) => {
    const monitorToEdit = monitors.find((monitor) => monitor._id === _id);
    if (monitorToEdit) {
      setMonitor({
        name: monitorToEdit.name,
        link: monitorToEdit.link,
        active: monitorToEdit.active,
        _id: monitorToEdit._id,
      });
    }
  };

  const { getToken } = useAuth();

  // handle delete
  const handleDelete = async (_id) => {
    try {
      const token = await getToken();
      const data = { _id };
      const res = await axiosPost(deleteMonitor, token, data);
    } catch (error) {
      console.error(error);
    }
    setMonitors((prevItems) => prevItems.filter((item) => item._id !== _id));
  };

  // handle save
  const handleSave = async () => {
    const data = {
      name: monitor.name,
      link: monitor.link,
      active: monitor.active,
    };
    if (monitor._id != null) {
      data._id = monitor._id;
    }
    try {
      const token = await getToken();
      const res = await axiosPost(
        monitor._id == null ? createMonitor : updateMonitor,
        token,
        data
      );
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

  const dialogContent = () => {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {monitor._id == null ? "Create " : "Edit "}Monitor
          </DialogTitle>
          <DialogDescription>Please ensure link is proper</DialogDescription>
        </DialogHeader>
        <div>
          <Form>
            <Label>Name</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="airplane-mode">Active</Label>
              <Switch
                checked={monitor.active}
                onCheckedChange={handleActiveStatus}
              />
            </div>
            <Input
              type="text"
              placeholder="My website"
              onChange={handleNameChange}
              value={monitor.name}
            />
            <Label>Link</Label>
            <Input
              type="text"
              placeholder="https://mywebsite.com"
              onChange={handleLinkChange}
              value={monitor.link}
            />
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
    title: "Monitors",
    description: "Overview",
    dialogContent: dialogContent(),
    handleCreate: handleCreate,
  };
  const tableProps = {
    columns: [
      { name: "Name", class: "w-40" },
      { name: "Link", class: "" },
      { name: "Active", class: "text-right" },
    ],
    rows: monitors,
    dialogContent: dialogContent(),
    handleEdit: handleEdit,
    handleDelete: handleDelete,
  };

  return (
    <div>
      <Dashboard props={dashboardProps}>
        <Table props={tableProps} />
      </Dashboard>
    </div>
  );
}

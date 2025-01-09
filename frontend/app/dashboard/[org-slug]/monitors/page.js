"use client";

// components
import Dashboard from "@/components/Dashboard";
import MonitorTable from "@/components/MonitorTable";

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
import { getDataAction } from "../../../actions";
import {
  getMonitors,
  createMonitor,
  updateMonitor,
  deleteMonitor,
} from "@/lib/apiEndpoints";
import { checkLink } from "@/lib/utils";
import { axiosPost } from "../../../actions";

export default function Page() {
  // states
  const [monitor, setMonitor] = useState({
    name: "",
    link: "",
    active: true,
    _id: null,
  });
  const [monitors, setMonitors] = useState([]);
  const [isLinkValid, setIsLinkValid] = useState(false);

  useEffect(() => {
    const fetchMonitors = async () => {
      const res = await getDataAction(getMonitors);
      if (res && res.data) setMonitors(res.data.monitors);
    };
    fetchMonitors();
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
    if (checkLink(e.target.value)) setIsLinkValid(true);
    else setIsLinkValid(false);
  };
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
          <Form className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Name</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="airplane-mode">Active</Label>
                  <Switch
                    checked={monitor.active}
                    onCheckedChange={handleActiveStatus}
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
        <MonitorTable props={tableProps} />
      </Dashboard>
    </div>
  );
}

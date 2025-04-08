"use client";

// Components
import Dashboard from "@/components/Dashboard";
import IncidentList from "@/components/IncidentList";
import IncidentStatusList from "@/components/IncidentStatusList";

// UI components
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Next.js
import Form from "next/form";

// Hooks
import { useState, useEffect } from "react";

// Library
import { monitorsApiEndpoint, incidentsApiEndpoint } from "@/lib/apiEndpoints";
import { fetchApi } from "@/lib/utils";

export default function Page() {
  // States
  const [incident, setIncident] = useState({
    name: "",
    monitorId: "",
    status: "",
    message: "",
    _id: null,
  });
  const [monitors, setMonitors] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);

  // Fetch Incidents data when the component mounts
  useEffect(() => {
    const fetchIncidents = async () => {
      const res = await fetchApi.get(incidentsApiEndpoint);
      if (res && res.data) setIncidents(res.data.incidents);
    };
    fetchIncidents();
  }, []);

  // Handle state changes
  const handleNameChange = (e) => {
    setIncident({ ...incident, name: e.target.value });
  };
  const handleStatusMessageChange = (e) => {
    setIncident({ ...incident, message: e.target.value });
  };

  // Handle button operations
  const handleCreate = async () => {
    try {
      const res = await fetchApi.get(monitorsApiEndpoint);
      if (res.data) {
        const activeMonitors = res.data.monitors.filter(
          (monitor) => monitor.active === true
        );
        setIncident({
          name: "",
          monitorId: "",
          status: "",
          message: "",
          _id: null,
        });
        setMonitors(activeMonitors);
      }
    } catch (error) {
      console.error("Failed to fetch monitors:", error);
    }
  };

  const handleEdit = (incident) => {
    setIncident({
      name: incident.name,
      monitorId: incident.monitor._id,
      status: "",
      message: "",
      _id: incident._id,
    });
    setStatusHistory(incident.statusHistory);
  };

  const handleDelete = async (_id) => {
    try {
      const res = await fetchApi.delete(`${incidentsApiEndpoint}/${_id}`);
    } catch (error) {
      console.error(error);
    }
    setIncidents((prevItems) => prevItems.filter((item) => item._id !== _id));
  };

  const handleSave = async () => {
    const data = {
      name: incident.name,
      monitorId: incident.monitorId,
      status: incident.status,
      message: incident.message,
    };
    try {
      const res =
        incident._id == null
          ? await fetchApi.post(incidentsApiEndpoint, data)
          : await fetchApi.patch(
              `${incidentsApiEndpoint}/${incident._id}`,
              data
            );
      if (incident._id != null) {
        setIncidents((prevItems) =>
          prevItems.filter((item) => item._id !== incident._id)
        );
      }
      setIncidents((prevItems) => [res.data.incident, ...prevItems]);
    } catch (error) {
      console.error(error);
    }
  };

  // Dialog content for creating or editing an Incident
  const dialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {incident._id == null ? "Create " : "Edit "}Incident
        </DialogTitle>
        <DialogDescription>
          Status cannot be changed once Resolved
        </DialogDescription>
      </DialogHeader>

      <div>
        <Form className="space-y-4">
          <div className="space-y-2">
            <div>
              <Label>Name</Label>
            </div>
            <Input
              type="text"
              placeholder="Incident"
              onChange={handleNameChange}
              value={incident.name}
            />
          </div>

          <div className="space-y-2 grid grid-cols-[1fr_6fr] items-baseline">
            <Label>Monitor</Label>
            <Select
              disabled={incident._id != null}
              onValueChange={(value) => {
                setIncident({ ...incident, monitorId: value });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    incident._id == null ? "Monitors" : incident.monitorId
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {monitors.map((monitor) => {
                  return (
                    <SelectItem
                      key={monitor._id}
                      value={monitor._id.toString()}
                    >
                      {monitor.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_6fr] items-baseline">
              <Label>Status</Label>
              <Select
                onValueChange={(value) => {
                  setIncident({ ...incident, status: value });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status Options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"Investigating"}>Investigating</SelectItem>
                  <SelectItem value={"Identified"}>Identified</SelectItem>
                  <SelectItem value={"Monitoring"}>Monitoring</SelectItem>
                  <SelectItem value={"Resolved"}>Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              className="max-h-40"
              placeholder="Description"
              onChange={handleStatusMessageChange}
              value={incident.message}
            />
          </div>

          <Separator />

          {incident._id && (
            <div className="space-y-2 overflow-y-scroll max-h-80">
              <Label>Updates</Label>
              <IncidentStatusList props={{ statusHistory: statusHistory }} />
            </div>
          )}
        </Form>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={
              incident._id
                ? incident.name === "" ||
                  (incident.status !== "" && incident.message === "") ||
                  (incident.message !== "" && incident.status === "")
                : incident.name === "" ||
                  incident.monitorId === "" ||
                  incident.status === "" ||
                  incident.message === ""
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
    title: "Incidents",
    description: "Overview",
    dialogContent: dialogContent,
    handleCreate: handleCreate,
  };
  const listProps = {
    incidents: incidents,
    dialogContent: dialogContent,
    handleEdit: handleEdit,
    handleDelete: handleDelete,
  };

  return (
    <div>
      <Dashboard props={dashboardProps}>
        <IncidentList props={listProps} />
      </Dashboard>
    </div>
  );
}

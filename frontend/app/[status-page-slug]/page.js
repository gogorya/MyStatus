"use client";

// Components
import Dashboard from "@/components/Dashboard";
import IncidentList from "@/components/IncidentList";

// UI components
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Hooks
import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";

// Library
import { statusPagesPublicApiEndpoint } from "@/lib/apiEndpoints";
import { fetchPublic } from "@/lib/utils";

export default function Page() {
  const params = useParams();

  // States
  const [monitorsData, setMonitorsData] = useState([]);
  const [incidentsData, setIncidentsData] = useState([]);
  const [pageExists, setPageExists] = useState(true);

  const getAndSetData = async () => {
    const slug = params["status-page-slug"];

    try {
      const res = await fetchPublic.get(
        `${statusPagesPublicApiEndpoint}/${slug}`
      );

      if (res && res.data) {
        const monitorsDataFormatted =
          res.data.statusPagePublic.monitorsData.map((monitor) => {
            let totSuccess = 0;
            let totFail = 0;
            const updatedMonitorData = monitor.data.map((it) => {
              totSuccess += it.success;
              totFail += it.fail;
              const uptime = (
                (it.success / (it.success + it.fail)) *
                100
              ).toFixed(2);
              return {
                ...it,
                uptime: isNaN(uptime) ? "0.0" : uptime,
              };
            });
            const uptime = (
              (totSuccess / (totSuccess + totFail)) *
              100
            ).toFixed(2);
            return {
              ...monitor,
              data: updatedMonitorData,
              uptime: isNaN(uptime) ? "0.0" : uptime,
              operational: monitor.lastThreeRequests.some(
                (value) => value === true
              ),
            };
          });

        const monitorsDataByDate = monitorsDataFormatted.map((monitor) => {
          const mp = new Map();
          monitor.data.map((it) => {
            const date = new Date(it.date);
            mp.set(`${date.getUTCDate()}/${date.getUTCMonth()}`, it);
          });

          const updatedMonitorData = Array.from({ length: 30 }).map(
            (_, index) => {
              const date = new Date(Date.now() - index * (24 * 60 * 60 * 1000));
              const key = `${date.getUTCDate()}/${date.getUTCMonth()}`;

              return mp.has(key) ? mp.get(key) : null;
            }
          );

          return {
            ...monitor,
            data: updatedMonitorData,
          };
        });

        setMonitorsData(monitorsDataByDate);
        setIncidentsData(res.data.statusPagePublic.incidentsData);

        toast("Data refreshed", {
          description: "The current data is up to date",
        });
      } else {
        setPageExists(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Status Page data when the component mounts
  useEffect(() => {
    getAndSetData();
  }, []);

  // If the Status Page does not exist, redirect to notFound page
  if (!pageExists) notFound();

  const refreshButton = (
    <Button variant="outline" onClick={getAndSetData}>
      <span>&#8635;</span>
    </Button>
  );
  const checkMark = (
    <div className="flex items-center justify-center h-6 w-6 rounded-xl bg-green-400">
      &#10004;
    </div>
  );
  const crossMark = (
    <div className="flex items-center justify-center h-6 w-6 rounded-xl bg-red-400">
      &#10005;
    </div>
  );

  return (
    <Dashboard
      props={{
        title: "Services",
        description: "Overview of all services",
        buttonClass: "hidden",
        refreshButton: refreshButton,
      }}
    >
      <div className="w-full space-y-6">
        {monitorsData.length ? (
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex items-center w-full space-x-4">
              <Label>Monitors</Label>

              <span className="text-gray-600 dark:text-gray-400">|</span>

              <div className="flex">
                {monitorsData.every((value) => value.operational === true) ? (
                  <>
                    {checkMark}
                    <span className="ml-1">All services are operational</span>
                  </>
                ) : (
                  <>
                    {crossMark}
                    <span className="ml-1">Some services are down</span>
                  </>
                )}
              </div>
            </div>

            {monitorsData.map((monitorData) => (
              <div key={monitorData._id} className="flex items-center">
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 space-y-2 w-full mr-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-base">
                      {monitorData.monitor.name}
                    </Label>
                    <div className="text-base">
                      <span>{monitorData.uptime}</span>
                      <span className="font-light">%</span>
                    </div>
                  </div>

                  <div className="flex gap-0.5 sm:gap-2 md:gap-3 justify-between flex-row-reverse">
                    {monitorData.data.map((data, index) =>
                      data == null ? (
                        <div
                          key={`empty-${index}`}
                          className="h-8 flex-1 bg-gray-200 dark:bg-gray-800 rounded-sm"
                        ></div>
                      ) : (
                        <div key={`data-${index}`} className="flex-1">
                          <HoverCard>
                            <HoverCardTrigger>
                              <div
                                className={`h-8 ${
                                  data.uptime >= 99
                                    ? "bg-green-400"
                                    : data.uptime >= 98
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                                } rounded-sm`}
                              ></div>
                            </HoverCardTrigger>
                            <HoverCardContent className="max-w-max">
                              <div className="text-xs space-y-1">
                                <div className="flex justify-between gap-3 text-base">
                                  <span>
                                    {new Date(data.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
                                    :
                                  </span>
                                  <span>
                                    {data.uptime}
                                    <span className="font-light">%</span>
                                  </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                  <span>Failed:</span>
                                  <span className="text-red-500">
                                    {data.fail}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Succeeded:</span>
                                  <span className="text-green-500">
                                    {data.success}
                                  </span>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>30 days ago</span>
                    <span>Today</span>
                  </div>
                </div>

                <div>{monitorData.operational ? checkMark : crossMark}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center p-2">
            <span className="text-sm">No Monitors available</span>
          </div>
        )}

        <Separator />

        <div className="space-y-4">
          <div>
            <Label>Incidents</Label>
          </div>

          {incidentsData.length ? (
            <IncidentList props={{ incidents: incidentsData }} />
          ) : (
            <div className="flex justify-center p-2">
              <span className="text-sm">No Incidents available</span>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
}

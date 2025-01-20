"use client";

// Components
import Dashboard from "@/components/Dashboard";

// UI components
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Hooks
import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";

// Library
import { getDataPublicAction } from "../actions";
import { getStatusPageData } from "@/lib/apiEndpoints";

export default function Page() {
  const params = useParams();

  // States
  const [monitorsData, setMonitorsData] = useState([]);
  const [pageExists, setPageExists] = useState(true);

  // Fetch Status Page data when the component mounts
  useEffect(() => {
    const fetchStatusPage = async () => {
      const slug = params["status-page-slug"];

      try {
        const res = await getDataPublicAction(getStatusPageData, slug);

        if (res && res.data) {
          const updatedData = res.data.statusPagePublic.map((monitor) => {
            let totSuccess = 0;
            let totFail = 0;
            const updatedMonitorData = monitor.data.map((it) => {
              totSuccess += it.success;
              totFail += it.fail;
              const uptime = (
                (it.success / (it.success + it.fail)) *
                100
              ).toFixed(1);
              return {
                ...it,
                uptime: isNaN(uptime) ? "0.0" : uptime,
              };
            });
            const uptime = (
              (totSuccess / (totSuccess + totFail)) *
              100
            ).toFixed(1);
            return {
              ...monitor,
              data: updatedMonitorData,
              uptime: isNaN(uptime) ? "0.0" : uptime,
            };
          });

          setMonitorsData(updatedData);
        } else {
          setPageExists(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatusPage();
  }, []);

  // If the Status Page does not exist, redirect to notFound page
  if (!pageExists) notFound();

  return (
    <Dashboard
      props={{
        title: "Services",
        description: "Overview of all services",
        buttonClass: "hidden",
      }}
    >
      {monitorsData.length ? (
        <div className="flex flex-col space-y-4 w-full">
          {monitorsData.map((monitorData) => (
            <div
              key={monitorData.id}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 space-y-2"
            >
              <div className="flex justify-between items-center">
                <Label className="text-base">{monitorData.name}</Label>
                <div className="text-base">
                  <span>{monitorData.uptime}</span>
                  <span className="font-light">%</span>
                </div>
              </div>

              <div className="flex gap-0.5 sm:gap-2 md:gap-3 justify-between">
                {Array.from({ length: 30 - monitorData.data.length }).map(
                  (_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="h-8 flex-1 bg-gray-200 dark:bg-gray-800 rounded-sm"
                    ></div>
                  )
                )}

                {monitorData.data.map((data, index) => (
                  <div key={`data-${index}`} className="flex-1">
                    <HoverCard>
                      <HoverCardTrigger>
                        <div
                          className={`h-8 ${
                            data.uptime >= 98
                              ? "bg-green-400"
                              : data.uptime >= 95
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          } rounded-sm`}
                        ></div>
                      </HoverCardTrigger>
                      <HoverCardContent className="max-w-max">
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between gap-3 text-base">
                            <span>
                              {new Date(data.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
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
                            <span className="text-red-500">{data.fail}</span>
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
                ))}
              </div>

              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center p-2">
          <span className="text-sm">No Services available</span>
        </div>
      )}
    </Dashboard>
  );
}

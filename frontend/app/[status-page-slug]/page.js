"use client";

// ui components
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// components
import Dashboard from "@/components/Dashboard";

// hooks
import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";

// lib
import { getDataPublicAction } from "../actions";
import { getStatusPageData } from "@/lib/apiEndpoints";

export default function Page() {
  const params = useParams();
  const [monitorsData, setMonitorsData] = useState([]);
  const [pageExists, setPageExists] = useState(true);

  useEffect(() => {
    const fetchStatusPage = async () => {
      const slug = params["status-page-slug"];
      try {
        const res = await getDataPublicAction(getStatusPageData, slug);
        if (res.data.ok) setMonitorsData(res.data.statusPagePublic);
        else setPageExists(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStatusPage();
  }, []);

  if (!pageExists) notFound();

  return (
    <Dashboard
      props={{
        title: "Services",
        description: "Overview of all services",
        buttonClass: "hidden",
      }}
    >
      <div className="flex flex-col space-y-4 w-full">
        {monitorsData.map((monitorData) => (
          <div
            key={monitorData.id}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 space-y-1"
          >
            <Label className="text-base">{monitorData.name}</Label>
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
                      <div className="h-8 bg-green-400 rounded-sm"></div>
                    </HoverCardTrigger>
                    <HoverCardContent className="max-w-max">
                      <div className="">
                        {new Date(data.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        <Separator className="mt-2 mb-2" />
                        <div className="flex flex-col space-y-2 text-sm">
                          <div className="flex justify-between">
                            <p className="text-green-500">Success:</p>
                            <p>{data.success}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-red-600">Failure:</p>
                            <p> {data.fail}</p>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <p>30 days ago</p>
              <p>Today</p>
            </div>
          </div>
        ))}
      </div>
    </Dashboard>
  );
}

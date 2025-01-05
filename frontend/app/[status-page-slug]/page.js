"use client";
// ui components
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// hooks
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// lib
import { getDataPublicAction } from "../actions";
import { getStatusPageData } from "@/lib/apiEndpoints";

export default function Page() {
  const params = useParams();
  const [monitorsData, setMonitorsData] = useState([]);
  useEffect(() => {
    const fetchStatusPage = async () => {
      const slug = params["status-page-slug"];
      const res = await getDataPublicAction(getStatusPageData, slug);
      console.log(res.data.statusPagePublic);
      setMonitorsData(res.data.statusPagePublic);
    };
    fetchStatusPage();
  }, []);

  return (
    <Card className="h-screen">
      {monitorsData.map((monitorData) => (
        <div key={monitorData.id} className="p-4">
          <Label className="text-lg">{monitorData.name}</Label>
          <div className="flex justify-between">
            {monitorData.data.map((data, index) => (
              <HoverCard className="p-8">
                <HoverCardTrigger>
                  <div className="h-8 w-4 p-0 bg-lime-300 rounded-sm"></div>
                </HoverCardTrigger>
                <HoverCardContent className="p-2 max-w-max">
                  <div className="p-1">
                    {new Date(data.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    <Separator />
                    <div className="flex flex-col p-1">
                      <Label className="text-lime-600 p-1">{`Success: ${data.success}`}</Label>
                      <Label className="text-red-600 p-1">{`Failure: ${data.fail}`}</Label>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
            {Array.from({ length: 30 - monitorData.data.length }).map(
              (_, index) => (
                <div
                  key={`empty-${index}`}
                  className="h-8 w-4 p-0 bg-gray-300 rounded-sm"
                ></div>
              )
            )}
          </div>
          <Separator className="mt-4" />
        </div>
      ))}
    </Card>
  );
}

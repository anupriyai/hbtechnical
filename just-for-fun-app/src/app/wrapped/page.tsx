"use client";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import StatCard from "../components/StatCard";
import GenrePieChart from "../components/GenrePieChart";
import RatingHistogram from "../components/RatingHistogram";
import TotalMinutesWatched from "../components/TotalMinutesWatched";
import { TvIcon, FireIcon, StarIcon } from "@heroicons/react/24/solid";

const SHEET_2_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQG-VDV6Ze0RTQcFP22p7hPcWVZCumyQrSqJFzI0InaJmGPAPbr8ehQoBauDQOE6ypmsHpIa5qpC1AJ/pub?output=csv&gid=856476277";
const SHEET_1_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQG-VDV6Ze0RTQcFP22p7hPcWVZCumyQrSqJFzI0InaJmGPAPbr8ehQoBauDQOE6ypmsHpIa5qpC1AJ/pub?output=csv&gid=0";

interface WatchHistoryEntry {
  Title: string;
  "Date Watched": string;
}

interface KDramaStats {
  totalDramas: number;
  bingeWatchRecord: { date: string; count: number };
  mostWatchedShow: { title: string; count: number };
}

export default function KDramaStatsPage() {
  const [stats, setStats] = useState<KDramaStats>({
    totalDramas: 0,
    bingeWatchRecord: { date: "", count: 0 },
    mostWatchedShow: { title: "", count: 0 },
  });

  useEffect(() => {
    fetch(SHEET_2_URL)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<WatchHistoryEntry>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            console.log("Fetched Data from Sheet 2:", result.data);
        
            const rawData = result.data as WatchHistoryEntry[];
            if (!rawData || rawData.length === 0) {
              console.error("Sheet 2 data is empty or malformed!");
              return;
            }
        
            const watchHistory = rawData.map((row) => ({
              title: row.Title.split(":")[0].trim(),
              date: row["Date Watched"].trim(),
            }));

            const uniqueDramas = new Set(watchHistory.map((d) => d.title));

            const bingeCounts: Record<string, number> = {};
            watchHistory.forEach((entry) => {
              bingeCounts[entry.date] = (bingeCounts[entry.date] || 0) + 1;
            });

            const bingeRecord = Object.entries(bingeCounts).reduce(
              (max, [date, count]) => (count > max.count ? { date, count } : max),
              { date: "", count: 0 }
            );

            const showCounts: Record<string, number> = {};
            watchHistory.forEach((entry) => {
              showCounts[entry.title] = (showCounts[entry.title] || 0) + 1;
            });

            const mostWatched = Object.entries(showCounts).reduce(
              (max, [title, count]) => (count > max.count ? { title, count } : max),
              { title: "", count: 0 }
            );

            setStats({
              totalDramas: uniqueDramas.size,
              bingeWatchRecord: bingeRecord,
              mostWatchedShow: mostWatched,
            });
          },
        });
      })
      .catch((error) => console.error("Error fetching CSV:", error));
  }, []);

  return (
    <div className="font-inconsolata min-h-screen text-white flex flex-col items-center ">
      <h1 className="text-4xl font-bold mb-8">my k-drama wrapped!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <StatCard
          label="Total K-Dramas Watched"
          value={stats.totalDramas}
          description="Unique dramas you've watched."
          icon={<TvIcon className="h-8 w-8 text-indigo-400" />}
        />

        <StatCard
          label="Binge-Watch Record"
          value={`${stats.bingeWatchRecord.count} episodes`}
          description={`on ${stats.bingeWatchRecord.date}`}
          icon={<FireIcon className="h-8 w-8 text-indigo-500" />}
        />

        <StatCard
          label="Most Watched Show"
          value={stats.mostWatchedShow.title}
          description={`${stats.mostWatchedShow.count} episodes`}
          icon={<StarIcon className="h-8 w-8 text-indigo-500" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mt-12">
        <GenrePieChart />
        <RatingHistogram />
        <TotalMinutesWatched />
      </div>
    </div>
  );
}
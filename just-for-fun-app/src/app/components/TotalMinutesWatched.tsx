"use client";
import { useEffect, useState } from "react";
import { fetchKDramaData, KDrama } from "@/utils/fetchKDramaData";

export default function TotalMinutesWatched() {
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processData() {
      try {
        const dramas: KDrama[] = await fetchKDramaData();

        if (!dramas || !Array.isArray(dramas) || dramas.length === 0) {
          console.error("No valid K-Drama data found.");
          setError("No data available.");
          return;
        }

        let minutes = 0;
        dramas.forEach((drama) => {
          const episodes = Number(drama?.Episodes ?? 0);
          const avgDuration = Number(drama?.["Avg Duration"] ?? 0);
          minutes += episodes * avgDuration;
        });

        setTotalMinutes(minutes);
      } catch (err) {
        console.error("Error processing K-Drama data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    processData();
  }, []);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-900/50 p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-lg font-bold mb-4">Total Watch Time</h2>
      <p className="text-2xl font-semibold">{totalMinutes.toLocaleString()} minutes</p>
    </div>
  );
}

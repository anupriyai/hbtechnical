"use client";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { fetchKDramaData, KDrama } from "../../utils/fetchKDramaData";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart components
Chart.register(ArcElement, Tooltip, Legend);

export default function GenrePieChart() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function processData() {
      try {
        const dramas: KDrama[] = await fetchKDramaData();
        if (!dramas || dramas.length === 0) {
          console.warn("⚠ No data found for genres.");
          setLoading(false);
          return;
        }

        const genreCounts: Record<string, number> = {};

        dramas.forEach((drama) => {
          if (drama.Genres) {
            drama.Genres.split(", ").forEach((genre) => {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
          }
        });

        setData({
          labels: Object.keys(genreCounts),
          datasets: [
            {
              data: Object.values(genreCounts),
              backgroundColor: [
                "#6366F1", "#EF4444", "#F97316", "#10B981", "#3B82F6", "#8B5CF6",
              ],
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching genre data:", error);
        setLoading(false);
      }
    }

    processData();
  }, []);

  return (
    <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-900/50 p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-lg font-bold mb-4">Most Watched Genres</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : data ? (
        <Pie data={data} />
      ) : (
        <p className="text-red-500">No genre data available.</p>
      )}
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { fetchKDramaData, KDrama } from "../../utils/fetchKDramaData";

// Register chart components
Chart.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

export default function RatingHistogram() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processData() {
      try {
        const dramas: KDrama[] = await fetchKDramaData();
        if (!dramas || dramas.length === 0) {
          console.warn("⚠ No rating data available.");
          setError("No rating data available.");
          setLoading(false);
          return;
        }

        const ratingCounts: Record<number, number> = {};

        dramas.forEach((drama) => {
          if (drama.Rating) {
            const rating = parseFloat(drama.Rating);
            if (!isNaN(rating)) {
              const roundedRating = Math.round(rating);
              ratingCounts[roundedRating] = (ratingCounts[roundedRating] || 0) + 1;
            }
          }
        });

        if (Object.keys(ratingCounts).length === 0) {
          console.warn("⚠ No valid ratings found.");
          setError("No valid ratings found.");
          setLoading(false);
          return;
        }

        setChartData({
          labels: Object.keys(ratingCounts).map((r) => `${r}/10`),
          datasets: [
            {
              label: "Number of Dramas",
              data: Object.values(ratingCounts),
              backgroundColor: "#36A2EB",
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching rating data:", err);
        setError("Failed to load rating data.");
        setLoading(false);
      }
    }

    processData();
  }, []);

  return (
    <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-900/50 p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-white text-xl mb-4">Rating Distribution</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : chartData ? (
        <Bar data={chartData} />
      ) : (
        <p className="text-gray-400">No data available.</p>
      )}
    </div>
  );
}
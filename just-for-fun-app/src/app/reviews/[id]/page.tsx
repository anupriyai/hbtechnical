"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Papa from "papaparse";

interface KDrama {
  Title: string;
  "Year Released": string;
  Genres: string;
  Review: string;
  "Image URL": string;
  Tags?: string;
  "Trailer URL"?: string;
  Seasons?: string;
  Director?: string;
  "Main Cast"?: string;
  Rating?: string;
}

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQG-VDV6Ze0RTQcFP22p7hPcWVZCumyQrSqJFzI0InaJmGPAPbr8ehQoBauDQOE6ypmsHpIa5qpC1AJ/pub?output=csv";

const getEmbedUrl = (url: string) => {
  const videoId = url.split("v=")[1]?.split("&")[0];
  return `https://www.youtube.com/embed/${videoId}`;
};

export default function KDramaDetailsPage() {
  const { id } = useParams();
  const [drama, setDrama] = useState<KDrama | null>(null);

  useEffect(() => {
    fetch(CSV_URL)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<KDrama>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const dramas = result.data as KDrama[];
            const foundDrama = dramas.find(
              (d) => d.Title.replace(/\s+/g, "-").toLowerCase() === id
            );

            if (foundDrama) {
              setDrama(foundDrama);
            }
          },
        });
      });
  }, [id]);

  if (!drama) {
    return <div className="text-center text-white text-lg">Loading...</div>;
  }

  return (
    <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-900/50 p-6 rounded-lg shadow-lg">

      <h1 className="font-inconsolata text-4xl font-bold">{drama.Title}</h1>
      <p className="font-inconsolata text-gray-400 text-lg">{drama["Year Released"]}</p>

      <div className="font-inconsolata flex flex-col lg:flex-row mt-6 gap-6">
        <div className="w-full lg:w-1/3">
          <img
            src={drama["Image URL"] || "https://via.placeholder.com/300"}
            alt={drama.Title}
            className="rounded-lg shadow-md w-full h-auto"
          />
        </div>

        <div className="font-inconsolata w-full lg:w-2/3">
          {drama["Trailer URL"] ? (
            <iframe
            src={getEmbedUrl(drama["Trailer URL"])}
            className="w-full h-72 lg:h-96 rounded-lg shadow-lg"
            allow="autoplay; encrypted-media"
          ></iframe>
          ) : (
            <p className="text-gray-500">no trailer available.</p>
          )}
        </div>
      </div>

      <div className="font-inconsolata mt-6">
        <div className="flex flex-wrap gap-2">
          {drama.Seasons && (
            <span className="bg-indigo-300 px-3 py-1 rounded-lg text-sm text-indigo-900">
              {drama.Seasons} Season(s)
            </span>
          )}
          {drama.Director && (
            <span className="bg-green-300 px-3 py-1 rounded-lg text-sm text-green-900">
              Director: {drama.Director}
            </span>
          )}
          {drama["Main Cast"] && (
            <span className="bg-yellow-300 px-3 py-1 rounded-lg text-sm text-yellow-900">
              Stars: {drama["Main Cast"]}
            </span>
          )}
          {drama.Genres &&
            drama.Genres.split(",").map((genre) => (
              <span
                key={genre.trim()}
                className="bg-blue-300 px-3 py-1 rounded-lg text-sm text-blue-900"
              >
                {genre.trim()}
              </span>
            ))}
          {drama.Tags &&
            drama.Tags.split(",").map((tag) => (
              <span
                key={tag.trim()}
                className="bg-red-200 px-3 py-1 rounded-lg text-sm text-red-900"
              >
                {tag.trim()}
              </span>
            ))}
        </div>
      </div>

      <div className="font-inconsolata mt-6 bg-gray-900/40 backdrop-blur-md p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">my rating</h2>
        <p className="text-yellow-300 text-lg font-bold">
          {drama.Rating || "N/A"}
        </p>
      </div>

      <div className="mt-4 bg-gray-900/40 backdrop-blur-md p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">my review</h2>
        <p className="text-gray-300">{drama.Review || "No review available."}</p>
      </div>
    </div>
  );
}

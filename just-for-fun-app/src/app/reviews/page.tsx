"use client"; // ✅ Ensure this is a client component

import { useState, useEffect } from "react";
import Papa from "papaparse";
import KDramaCard from "../components/KDramaCard";

interface KDrama {
  Title: string;
  "Year Released": string;
  Genres: string;
  Review: string;
  "Image URL": string;
  Tags?: string;
}

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQG-VDV6Ze0RTQcFP22p7hPcWVZCumyQrSqJFzI0InaJmGPAPbr8ehQoBauDQOE6ypmsHpIa5qpC1AJ/pub?output=csv";

export default function ReviewsPage() {
  const [kdramas, setKdramas] = useState<KDrama[]>([]);
  const [filteredDramas, setFilteredDramas] = useState<KDrama[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2024]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTag, setSearchTag] = useState<string>("");

  useEffect(() => {
    fetch(CSV_URL)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<KDrama>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const rawData = result.data as KDrama[];

            if (!rawData || rawData.length === 0) {
              console.error("CSV data is empty or malformed!");
              return;
            }

            setKdramas(rawData);
            setFilteredDramas(rawData);

            // Extract unique genres
            const uniqueGenres = new Set<string>();
            rawData.forEach((d) => {
              if (d.Genres) {
                d.Genres.split(/,\s*/).forEach((genre) => uniqueGenres.add(genre.trim()));
              }
            });

            setGenres(Array.from(uniqueGenres));

            // Extract unique years
            const uniqueYears = [...new Set(rawData.map((d) => d["Year Released"]).filter((y) => y))];
            setYears(uniqueYears);

            // Extract tags
            const tagCount: Record<string, number> = {};
            rawData.forEach((d) => {
              if (d.Tags) {
                d.Tags.split(/,\s*/).forEach((tag) => {
                  const trimmedTag = tag.trim();
                  tagCount[trimmedTag] = (tagCount[trimmedTag] || 0) + 1;
                });
              }
            });

            const sortedTags = Object.entries(tagCount)
              .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
              .map(([tag]) => tag);

            setAllTags(sortedTags);
            setTags(sortedTags.slice(0, 10));
            setFilteredTags(sortedTags.slice(0, 10));
          },
        });
      });
  }, []);

  // **Filtering Logic**
  useEffect(() => {
    let filtered = kdramas;

    // **Genre Filtering**
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((drama) =>
        drama.Genres?.split(/,\s*/).some((genre) => selectedGenres.includes(genre.trim()))
      );
    }

    // **Year Range Filtering**
    filtered = filtered.filter(
      (drama) =>
        Number(drama["Year Released"]) >= yearRange[0] &&
        Number(drama["Year Released"]) <= yearRange[1]
    );

    // **Tag Filtering**
    if (selectedTags.length > 0) {
      filtered = filtered.filter((drama) =>
        drama.Tags?.split(/,\s*/).some((tag) => selectedTags.includes(tag.trim()))
      );
    }

    setFilteredDramas(filtered);
  }, [selectedGenres, yearRange, selectedTags, kdramas]);

  // **Search Tag Filtering**
  useEffect(() => {
    if (searchTag.trim() === "") {
      setFilteredTags(tags.slice(0, 10));
    } else {
      const searchedTags = allTags
        .filter((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()))
        .slice(0, 10);

      setFilteredTags(searchedTags);
    }
  }, [searchTag, allTags]);

  return (
    <div className="font-inconsolata flex min-h-screen">
      {/* SIDEBAR FILTERS */}
      <aside className="w-1/4 bg-gray-900 text-white p-6 min-h-screen rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-indigo-400">filters</h2>


        <div className="mb-4">
        <h3 className="text-lg font-semibold text-indigo-300">genres</h3>


        {genres.length === 0 ? (
            <p className="text-gray-400">Loading genres...</p>
        ) : (
            <div className="grid grid-cols-2 gap-2 mt-2">
            {genres.map((genre) => (
                <label key={genre} className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    className="form-checkbox bg-gray-800 border-gray-600"
                    value={genre}
                    checked={selectedGenres.includes(genre)}
                    onChange={(e) => {
                    const value = e.target.value;
                    setSelectedGenres((prev) =>
                        prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
                    );
                    }}
                />
                <span className="text-white">{genre}</span>
                </label>
            ))}
            </div>
        )}
        </div>


        <div className="mb-4">
            <h3 className="text-lg font-semibold text-indigo-300">year range: {yearRange[0]} - {yearRange[1]}</h3>
            <input
            type="range"
            min="2000"
            max="2024"
            value={yearRange[0]}
            className="w-full"
            onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
            />
            <input
            type="range"
            min="2000"
            max="2024"
            value={yearRange[1]}
            className="w-full"
            onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
            />
        </div>


        <div className="mb-4">
            <h3 className="text-lg font-semibold text-indigo-300">tags</h3>
            <input
                type="text"
                placeholder="Search tags..."
                className="w-full p-2 mt-2 bg-gray-800 border border-gray-600 rounded"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
            />


            <div className="grid grid-cols-2 gap-2 mt-2">
                {filteredTags.map((tag) => (
                <label key={tag} className="flex items-center space-x-2">
                    <input
                    type="checkbox"
                    className="form-checkbox bg-gray-800 border-gray-600"
                    value={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedTags((prev) =>
                        prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
                        );
                    }}
                    />
                    <span className="text-white">{tag}</span>
                </label>
                ))}
            </div>
        </div>
        </aside>

      {/* MAIN CONTENT */}
      <main className="w-3/4 p-6">
        <h1 className="text-3xl font-bold mb-4">my k-drama reviews</h1>

        {/* DISPLAY FILTERED KDRAMAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDramas.length > 0 ? (
            filteredDramas.map((drama, index) => (
                <KDramaCard
                key={index} // ✅ React key
                id={drama.Title.replace(/\s+/g, "-").toLowerCase()} // ✅ Ensure this is passed properly
                title={drama.Title}
                imageUrl={drama["Image URL"]}
                genres={drama.Genres}
                year={drama["Year Released"]}
                review={drama.Review || "No review available yet."}
              />
            ))
          ) : (
            <p className="text-gray-500">no k-dramas match your filters 😢</p>
          )}
        </div>
      </main>
    </div>
  );
}

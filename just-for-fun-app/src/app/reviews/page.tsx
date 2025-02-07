"use client";
import { useState, useEffect } from "react";
import Papa from "papaparse";

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
            console.log("Parsed CSV Data:", rawData);

            if (!rawData || rawData.length === 0) {
              console.error("CSV data is empty or malformed!");
              return;
            }

            setKdramas(rawData);
            setFilteredDramas(rawData);

            const uniqueGenres = new Set<string>();
            rawData.forEach((d) => {
                if (d.Genres) {
                d.Genres.split(/,\s*/).forEach((genre) => uniqueGenres.add(genre.trim()));
                }
            });

            console.log("Extracted Genres:", Array.from(uniqueGenres));

            setGenres(Array.from(uniqueGenres));

            const uniqueYears = [...new Set(rawData.map((d) => d["Year Released"]).filter((y) => y))];

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

useEffect(() => {
    let filtered = kdramas;

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((drama) =>
        drama.Genres?.split(/,\s*/).some((genre) => selectedGenres.includes(genre.trim()))
      );
    }

    filtered = filtered.filter(
      (drama) =>
        Number(drama["Year Released"]) >= yearRange[0] &&
        Number(drama["Year Released"]) <= yearRange[1]
    );

    if (selectedTags.length > 0) {
      filtered = filtered.filter((drama) =>
        drama.Tags?.split(/,\s*/).some((tag) => selectedTags.includes(tag.trim()))
      );
    }
  
    setFilteredDramas(filtered);
  }, [selectedGenres, yearRange, selectedTags, kdramas]);
  
  useEffect(() => {
    if (searchTag.trim() === "") {
      setFilteredTags(tags.slice(0, 10));
    } else {
      const searchedTags = allTags
        .filter((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()))
        .sort((a, b) => {
          if (a.toLowerCase().startsWith(searchTag.toLowerCase()) && !b.toLowerCase().startsWith(searchTag.toLowerCase())) {
            return -1;
          }
          if (!a.toLowerCase().startsWith(searchTag.toLowerCase()) && b.toLowerCase().startsWith(searchTag.toLowerCase())) {
            return 1;
          }
          return a.localeCompare(b);
        })
        .slice(0, 10);
  
      setFilteredTags(searchedTags);
    }
  }, [searchTag, allTags]);
  

  return (
    <div className="font-inconsolata flex min-h-screen">
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

      <main className="w-3/4 p-6">
        <h1 className="text-3xl font-bold mb-4">my k-drama reviews</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDramas.length > 0 ? (
            filteredDramas.map((drama, index) => (
              <div key={index} className="bg-white bg-opacity-70 shadow-md rounded-lg p-4">
                <img
                  src={drama["Image URL"] || "https://via.placeholder.com/300"}
                  alt={drama.Title}
                  className="rounded-md w-full h-48 object-cover"
                />
                <h2 className="text-xl font-semibold mt-2 bg-gradient-to-r from-[#162f6e] via-[#533d99] to-[#1b2b54] inline-block text-transparent bg-clip-text">
                  {drama.Title}
                </h2>
                <p className="text-gray-600">genre: {drama.Genres}</p>
                <p className="text-gray-500 text-sm">year: {drama["Year Released"]}</p>
                <p className="mt-2 text-gray-700">{drama.Review || "No review available yet."}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">no k-dramas match your filters :(</p>
          )}
        </div>
      </main>
    </div>
  );
}
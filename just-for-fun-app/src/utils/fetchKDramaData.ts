import Papa from "papaparse";

export interface KDrama {
  Title: string;
  "Year Released": string;
  Genres: string;
  Review: string;
  "Image URL": string;
  Tags?: string;
  Rating?: string;
  Episodes?: number;
  "Avg Duration"?: number;
}

export async function fetchKDramaData(): Promise<KDrama[]> {
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQG-VDV6Ze0RTQcFP22p7hPcWVZCumyQrSqJFzI0InaJmGPAPbr8ehQoBauDQOE6ypmsHpIa5qpC1AJ/pub?output=csv&gid=0";

  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.statusText}`);

    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse<KDrama>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.data && Array.isArray(result.data)) {
            console.log("Successfully fetched K-Drama data:", result.data);
            resolve(result.data);
          } else {
            console.error("Invalid CSV data format:", result);
            resolve([]);
          }
        },
        error: (error: Error) => {
          console.error("CSV Parsing Error:", error);
          resolve([]); 
        },
      });
    });
  } catch (err) {
    console.error("Fetching K-Drama data failed:", err);
    return [];
  }
}

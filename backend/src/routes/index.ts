import type { Request, Response } from "express";
import fs from "fs";
import csvParser from "csv-parser";

export default async function index(_req: Request, res: Response) {
  try {
    const monthlyFatalities: { [month: string]: number } = {};

    const stream = fs.createReadStream(
      new URL("../../aircrashesFullData.csv", import.meta.url)
    );

    stream
      .pipe(csvParser())
      .on("data", (row) => {
        const month = row["Month"];
        const fatalities = Number(row["Sum of Fatalities (air)"]);

        // Check if the month is already in the object
        if (monthlyFatalities[month]) {
          // If it exists, add the fatalities to the existing total
          monthlyFatalities[month] += fatalities;
        } else {
          // If it doesn't exist, initialize it with the fatalities
          monthlyFatalities[month] = fatalities;
        }
      })
      .on("end", () => {
        // Convert the object to arrays for x (months) and y (fatalities)
        const x = Object.keys(monthlyFatalities);
        const y = Object.values(monthlyFatalities);

        res.status(200).json({
          x,
          y,
        });
      })
      .on("error", (error) => {
        res.status(500).json({ error: "An error occurred" });
      });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}

import type { Request, Response } from "express";
import fs from "fs";
import fastcsv from "fast-csv";

export default async function data(req: Request, res: Response) {
  try {
    let xAxis = String(req.query.x);
    let yAxis = String(req.query.y);

    const data: { x: any[]; y: any[] } = { x: [], y: [] };

    const stream = fs.createReadStream(
      new URL("../../aircrashesFullData.csv", import.meta.url)
    );

    fastcsv
      .parseStream(stream, { headers: true })
      .on("data", (row) => {
        if (xAxis in row && yAxis in row) {
          data.x.push(row[xAxis]);
          data.y.push(row[yAxis]);
        }
      })
      .on("end", () => {
        res.status(200).json(data);
      })
      .on("error", (_) => {
        res.status(500).json({ error: "An error occurred" });
      });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}

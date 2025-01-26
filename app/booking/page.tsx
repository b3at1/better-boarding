"use client";
import React, { useState } from "react";
import Palette from "@/components/palette";
import { JobResult } from "../api/finish/route";

function getJobResult(jobId: string): Promise<JobResult | null> {
    return fetch("/api/finish?jobId=" + jobId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        return null;
      }
      return data.result as JobResult;
    });
  }

export default function BookingPage() {
    const rows = 18;
    const seatsPerRow = 6;
    const initialSeats = Array.from({ length: rows }, () =>
        Array(seatsPerRow).fill(0)
    );
    const initialSeatColors = Array.from(
        { length: rows * seatsPerRow },
        () => "lightgray"
    );

    const [seats, setSeats] = useState(initialSeats);
    const [seatColors, setSeatColors] = useState(initialSeatColors);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleColorSelect = (color: string, index: number) => {
        setSelectedColor(color);
        setSelectedIndex(index + 1);
    };

    const handleSeatClick = (rowIndex: number, seatIndex: number) => {
        if (!selectedColor) return;
        if (jobId !== null) return;

        const updatedSeats = seats.map((row, rIndex) =>
            row.map((seat, sIndex) => {
                if (rIndex === rowIndex && sIndex === seatIndex) {
                    return seat === selectedIndex ? 0 : selectedIndex;
                }
                return seat;
            })
        );

        const updatedSeatColors = seatColors.map((color, index) => {
            const seatIndexFlat = rowIndex * seatsPerRow + seatIndex;
            if (index === seatIndexFlat) {
                return updatedSeats[rowIndex][seatIndex] === 0
                    ? "lightgray"
                    : selectedColor;
            }
            return color;
        });

        setSeats(updatedSeats);
        setSeatColors(updatedSeatColors);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const seatsJson = JSON.stringify(seats);
        console.log("Seats submitted:", seatsJson);

        // TODO: fix api endpoint
        const response = await fetch('https://better-boarding-workers-611279150412.us-central1.run.app/process', {
        // const response = await fetch('http://localhost:5000/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '9JSwAoO8l33t0mr3mQ'
            },
            body: seatsJson,
        });

        const { jobId } = await response.json();
        setJobId(jobId);
        pollJobResult(jobId);
    };

    const pollJobResult = (jobId: string) => {
        const interval = setInterval(async () => {
            const result = await getJobResult(jobId);
            console.log("Polling job result:", result);
            if (result) {
                // 0-index to 1-index result, then convert all non-selected seats to 0
                result.result = result.result.map((row, rowIndex) =>
                    row.map((group, seatIndex) =>
                        group + 1
                    )
                );

                setJobResult(result);
                clearInterval(interval);
                setLoading(false);
            }
        }, 3000); // Poll every 3 seconds
    };

    const [jobId, setJobId] = useState<string | null>(null);
    const [jobResult, setJobResult] = useState<JobResult | null>(null);

    return (
        <div className="container font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-4xl font-bold mb-6">
                {" "}
                Boarding Grouping Selection
            </h1>
            <div className="airplane">
                {seats.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`row ${rowIndex < 8 ? "front" : "back"}`}
                    >
                        {row.map((seat, seatIndex) => (
                            <button
                                key={seatIndex}
                                className={`seat ${seat ? "selected" : ""}`}
                                style={{
                                    backgroundColor:
                                        seatColors[
                                            rowIndex * seatsPerRow + seatIndex
                                        ],
                                }}
                                onClick={() =>
                                    handleSeatClick(rowIndex, seatIndex)
                                }
                            ></button>
                        ))}
                    </div>
                ))}
            </div>
            {jobResult ? (
                <>
                <div className="airplane">
                    {jobResult.result.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`row ${rowIndex < 8 ? "front" : "back"}`}
                        >
                            {row.map((group, seatIndex) => (
                                <div
                                    key={seatIndex}
                                    className={`seat ${group ? "selected" : ""}`}
                                    style={{
                                        backgroundColor: group
                                            ? "green"
                                            : "lightgray",
                                    }}
                                >
                                    {group}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="time-taken">
                    <h2>Estimated Boarding Time</h2>
                    <p>{jobResult.timeTaken} seconds</p>
                </div>
                </>
            ) : (
                <>
                    <Palette onColorSelect={handleColorSelect} />
                    <button
                        className="bg-green-500 text-white cursor-pointer rounded-md p-4"
                        onClick={jobId ? undefined : handleSubmit}
                        disabled={jobId !== null}
                    >
                        Submit
                    </button>
                    {loading && <p>Loading...</p>}
                </>
            )}
            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: auto;
                }
                .airplane {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background-color: #f0f0f0;
                    border-radius: 20% 10% 10% 20%;
                    padding: 15px;
                    padding-left: 6rem;
                    padding-right: 4rem;
                    margin: auto;
                    margin-top: 15px;
                    margin-bottom: 15px;
                    max-width: 80%;
                }
                .row {
                    display: flex;
                    flex-direction: column;
                    margin: 0 5px;
                }
                .seat {
                    width: 30px;
                    height: 30px;
                    margin: 5px 0;
                    background-color: lightgray;
                    border: 1px solid #ccc;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 15px;
                }
                .seat.selected {
                    background-color: green;
                }
                .submit-button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: blue;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .seat:nth-child(3) {
                    margin-bottom: 20px; /* Add gap for the center aisle */
                }
                .row:nth-child(8) .seat {
                    margin-right: 20px;
                }
            `}</style>
        </div>
    );
}

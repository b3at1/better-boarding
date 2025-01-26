'use client';
import React, { useState } from 'react';

export default function BookingPage() {
    const rows = 18;
    const seatsPerRow = 6;
    const initialSeats = Array.from({ length: rows }, () => Array(seatsPerRow).fill(false));

    const [seats, setSeats] = useState(initialSeats);

    const handleSeatClick = (rowIndex: number, seatIndex: number) => {
        const updatedSeats = seats.map((row, rIndex) =>
            row.map((seat, sIndex) => (rIndex === rowIndex && sIndex === seatIndex ? !seat : seat))
        );
        setSeats(updatedSeats);
    };

    const handleSubmit = () => {
        // TODO: Handle submit logic here
        console.log('Seats submitted:', seats);
    };

    return (
        <div className="container font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-4xl font-bold mb-6"> Boarding Grouping Selection</h1>
            <div className="airplane">
                {seats.map((row, rowIndex) => (
                    <div key={rowIndex} className={`row ${rowIndex < 8 ? 'front' : 'back'}`}>
                        {row.map((seat, seatIndex) => (
                            <button
                                key={seatIndex}
                                className={`seat ${seat ? 'selected' : ''}`}
                                onClick={() => handleSeatClick(rowIndex, seatIndex)}
                            >
                                {rowIndex + 1}{String.fromCharCode(65 + seatIndex)}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            <button className="bg-green-500 text-white cursor-pointer rounded-md p-4" onClick={handleSubmit}>Submit</button>
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
                    padding: 20px;
                    padding-left: 6rem;
                    padding-right: 4rem;
                    margin: auto;
                    margin-top: 20px;
                    margin-bottom: 20px;
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
};

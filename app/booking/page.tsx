'use client';
import React, { useState } from 'react';
import Palette, { PaletteProps } from '@/components/palette';

export default function BookingPage() {
    const rows = 18;
    const seatsPerRow = 6;
    const initialSeats = Array.from({ length: rows }, () => Array(seatsPerRow).fill(0));
    const initialSeatColors = Array.from({ length: rows * seatsPerRow }, () => 'lightgray');

    const [seats, setSeats] = useState(initialSeats);
    const [seatColors, setSeatColors] = useState(initialSeatColors);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const handleColorSelect = (color: string, index: number) => {
        setSelectedColor(color);
        setSelectedIndex(index + 1);
    };

    const handleSeatClick = (rowIndex: number, seatIndex: number) => {
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
                return updatedSeats[rowIndex][seatIndex] === 0 ? 'lightgray' : selectedColor;
            }
            return color;
        });

        setSeats(updatedSeats);
        setSeatColors(updatedSeatColors);
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
                                style={{ backgroundColor: seatColors[rowIndex * seatsPerRow + seatIndex] }}
                                onClick={() => handleSeatClick(rowIndex, seatIndex)}
                            >
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            <Palette onColorSelect={handleColorSelect} />
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

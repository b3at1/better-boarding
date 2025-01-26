import React, { useState, useEffect } from "react";

export interface PaletteProps {
    onColorSelect: (color: string, index: number) => void;
}

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const euclideanDist = (color1: string, color2: string) => {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
};

const invalidColor = (color: string, colors: string[]) => {
    return colors.some(
        (existingColor) =>
            existingColor === color || euclideanDist(color, existingColor) < 100
    );
};

const Palette: React.FC<PaletteProps> = ({ onColorSelect }) => {
    const [colors, setColors] = useState<string[]>([getRandomColor()]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    useEffect(() => {
        onColorSelect(colors[selectedIndex], selectedIndex);
    }, [selectedIndex, onColorSelect, colors]);

    useEffect(() => {
        const handleRightClick = (event: MouseEvent) => {
            event.preventDefault();
            if (selectedIndex < colors.length - 1) {
                setSelectedIndex((prevIndex) => prevIndex + 1);
            } else {
                let newColor = getRandomColor();
                while (colors.includes(newColor)) {
                    newColor = getRandomColor();
                }
                setColors((prevColors) => [...prevColors, newColor]);
                setSelectedIndex((prevIndex) => prevIndex + 1);
            }
        };

        document.addEventListener("contextmenu", handleRightClick);

        return () => {
            document.removeEventListener("contextmenu", handleRightClick);
        };
    }, [selectedIndex, colors]);

    const handleLeftClick = () => {
        setSelectedIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
    };

    const handleRightClick = () => {
        setSelectedIndex((prevIndex) =>
            prevIndex < colors.length - 1 ? prevIndex + 1 : prevIndex
        );
    };

    return (
        <div className="flex items-center my-4">
            <button
                onClick={handleLeftClick}
                disabled={selectedIndex === 0}
                className="mr-2 cursor-pointer p-2 text-4xl"
            >
                &lt;
            </button>
            <div className="flex flex-col items-center">
                <div className="flex overflow-x-auto whitespace-nowrap transition-all duration-200 mb-2">
                    <div
                        className="w-6 h-6 mx-1 rounded-md transition-all duration-200"
                        style={{
                            visibility:
                                selectedIndex > 0 ? "visible" : "hidden",
                            backgroundColor: colors[selectedIndex - 1],
                        }}
                    />
                    <div
                        className="w-10 h-10 mx-1 rounded-md transition-all duration-200"
                        style={{ backgroundColor: colors[selectedIndex] }}
                    />
                    <div
                        className="w-6 h-6 mx-1 rounded-md transition-all duration-200"
                        style={{
                            visibility:
                                selectedIndex < colors.length - 1
                                    ? "visible"
                                    : "hidden",
                            backgroundColor: colors[selectedIndex + 1],
                        }}
                    />
                </div>
                <div className="text-center text-lg">{selectedIndex + 1}</div>
            </div>
            <button
                onClick={handleRightClick}
                disabled={selectedIndex === colors.length - 1}
                className="ml-2 cursor-pointer p-2 text-4xl"
            >
                &gt;
            </button>
        </div>
    );
};

export default Palette;

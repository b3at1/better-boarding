'use client';
import React from 'react';

export default function CowButton() {
    const playSound = () => {
        const mooSound = document.getElementById('mooSound') as HTMLAudioElement;
        mooSound.currentTime = 0;
        mooSound.play();
    };

    return (
        <div>
            <style>{`
                body {
                    margin: 0;
                    padding: 0;
                    background: #7bc787;
                }
                ul {
                    position: absolute;
                    top: 50%;
                    left: 50%; 
                    transform: translate(-50%, -50%);
                    margin: 0;
                    padding: 0;
                    display: flex;
                }
                ul li {
                    list-style: none;
                }
                ul li a {
                    display: flex;
                    padding: 2px;
                    margin: 0 10px;
                    border-radius: 50%;
                    box-sizing: border-box;
                    text-decoration: none;
                    background: linear-gradient(0deg, #ccc, #eee);
                    transition: all 0.2s ease-in-out;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.35);
                }
                ul li a:hover:active {
                    transform: translateY(3px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                }
                ul li a .fa {
                    padding: 2px;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    line-height: calc(60px - 12px);
                    font-size: 24px;
                    color: #808080;
                    transition: .5s;
                }

                #circularButton {
                    scale: 5;
                }
            `}</style>
            <ul>
                <li>
                    <a href="#" id="circularButton" onClick={playSound}>
                        <div className="fa">
                            <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scale(0.98)' }}>
                                <defs>
                                    <clipPath id="clipCircle">
                                        <circle cx="30" cy="30" r="25" />
                                    </clipPath>
                                    <linearGradient id="outgrad" x1="100%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#f0f0f0', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: '#b8b8b8', stopOpacity: 1 }} />
                                    </linearGradient>
                                    <linearGradient id="ingrad" x1="100%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#e0e0e0', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: '#f0f0f0', stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>
                                <circle cx="30" cy="30" r="26.5" fill="url(#outgrad)" />
                                <circle cx="30" cy="30" r="25" fill="url(#ingrad)" />
                                <image x="10" y="10" width="40" height="40" href="perfectCow.svg" clipPath="url(#clipCircle)" />
                            </svg>
                        </div>
                    </a>
                </li>
            </ul>
            <audio id="mooSound" src="moo.mp3"></audio>
        </div>
    );
}
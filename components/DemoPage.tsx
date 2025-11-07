import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Check } from './icons';
import { BingoCell, Clue } from '../types';

interface DemoPageProps {
  onNavigateHome: () => void;
}

const demoClues: Clue[] = [
    { companyName: "Google", clueText: "Known for its search engine and Android OS." },
    { companyName: "Apple", clueText: "Creator of the iPhone, iPad, and Mac." },
    { companyName: "Microsoft", clueText: "Developed the Windows operating system." },
    { companyName: "Amazon", clueText: "An e-commerce giant and cloud computing leader." },
    { companyName: "Meta", clueText: "Formerly Facebook, this company focuses on the metaverse." },
    { companyName: "Tesla", clueText: "Famous for its electric vehicles and CEO Elon Musk." },
    { companyName: "Netflix", clueText: "A popular streaming service for movies and TV shows." },
    { companyName: "NVIDIA", clueText: "A leading manufacturer of graphics processing units (GPUs)." },
    { companyName: "Adobe", clueText: "Software company known for Photoshop and Acrobat." },
    { companyName: "Salesforce", clueText: "A cloud-based software company specializing in CRM." },
    { companyName: "Oracle", clueText: "A multinational company known for its database software." },
    { companyName: "Intel", clueText: "One of the world's largest chip manufacturers." },
    { companyName: "IBM", clueText: "A long-standing tech giant also known as 'Big Blue'." },
    { companyName: "Sony", clueText: "A Japanese conglomerate famous for the PlayStation." },
    { companyName: "Samsung", clueText: "A South Korean multinational known for its electronics." },
    { companyName: "Nintendo", clueText: "A video game company that created Mario and Zelda." },
    { companyName: "Spotify", clueText: "A major music streaming service from Sweden." },
    { companyName: "X", clueText: "A microblogging and social networking service, formerly Twitter." },
    { companyName: "Shopify", clueText: "An e-commerce platform for online stores." },
    { companyName: "Zoom", clueText: "A popular video conferencing software." },
    { companyName: "Uber", clueText: "A ride-hailing service that has expanded into food delivery." },
    { companyName: "Airbnb", clueText: "An online marketplace for lodging and tourism activities." },
    { companyName: "SpaceX", clueText: "An aerospace manufacturer founded by Elon Musk." },
    { companyName: "OpenAI", clueText: "An AI research and deployment company behind ChatGPT." },
];

const createDemoGrid = (): BingoCell[][] => {
  const grid: BingoCell[][] = Array(5).fill(null).map(() => Array(5).fill(null));
  let clueIndex = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (i === 2 && j === 2) {
        grid[i][j] = { id: 12, clue: null, marked: true, isFreeSpace: true };
      } else {
        grid[i][j] = {
          id: i * 5 + j,
          clue: demoClues[clueIndex],
          marked: false,
          isFreeSpace: false,
        };
        clueIndex++;
      }
    }
  }
  return grid;
};

const demoSteps = [
    { instruction: "Welcome to the Techingo Demo! Let's learn how to play.", clue: "First, a clue is revealed below. Find the matching company on the grid and click it.", targetId: 1, action: 'mark' },
    { instruction: "Great job! Let's try another one.", clue: "This company is a leading manufacturer of graphics processing units (GPUs).", targetId: 7, action: 'mark' },
    { instruction: "You're getting the hang of it! Now, let's complete a 'Four Corners' win.", clue: "We've marked three corners for you. Click the final corner to complete the pattern!", targetId: 24, action: 'mark' },
    { instruction: "Perfect! Now let's get a BINGO with a diagonal line.", clue: "We've marked most of the diagonal. Click the last company to get BINGO!", targetId: 20, action: 'mark' },
    { instruction: "BINGO! You've got a winning pattern.", clue: "Click the glowing BINGO button to claim your victory!", targetId: null, action: 'bingo' },
    { instruction: "Congratulations! You've completed the demo.", clue: "You're now ready to join a real game. Good luck!", targetId: null, action: 'end' },
];


export const DemoPage: React.FC<DemoPageProps> = ({ onNavigateHome }) => {
    const [grid, setGrid] = useState<BingoCell[][]>(createDemoGrid());
    const [stepIndex, setStepIndex] = useState(0);
    const [shakeCellId, setShakeCellId] = useState<number | null>(null);

    const currentStep = demoSteps[stepIndex];

    useEffect(() => {
        if (stepIndex === 2) { // Four corners step
            setGrid(g => g.map(row => row.map(cell => {
                if (cell.id === 0 || cell.id === 4) {
                    return { ...cell, marked: true };
                }
                return cell;
            })));
        }
        if (stepIndex === 3) { // Diagonal step
             setGrid(g => g.map(row => row.map(cell => {
                if (cell.id === 0 || cell.id === 6 || cell.id === 18) {
                    return { ...cell, marked: true };
                }
                return cell;
            })));
        }
    }, [stepIndex]);

    const handleCellClick = (cellId: number) => {
        if (currentStep.action !== 'mark' || currentStep.targetId === null) return;

        if (cellId === currentStep.targetId) {
            setGrid(prevGrid =>
                prevGrid.map(row => row.map(cell =>
                    cell.id === cellId ? { ...cell, marked: true } : cell
                ))
            );
            setStepIndex(stepIndex + 1);
        } else {
            setShakeCellId(cellId);
            setTimeout(() => setShakeCellId(null), 500);
        }
    };
    
    const handleBingoClick = () => {
        if (currentStep.action === 'bingo') {
            setStepIndex(stepIndex + 1);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 selection:bg-primary-500/20">
            <button onClick={onNavigateHome} className="absolute top-4 left-4 flex items-center text-slate-600 hover:text-slate-900 transition-colors z-10">
                <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
            </button>
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Interactive Demo</h1>
                    <p className="text-slate-600 text-lg">{currentStep.instruction}</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-5 gap-2 p-2 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
                            {grid.flat().map((cell) => {
                                const isShaking = shakeCellId === cell.id;
                                const baseClasses = "aspect-square rounded-xl border-2 p-1 font-medium transition-all relative overflow-hidden flex flex-col items-center justify-center text-center";
                                const markedClasses = "bg-gradient-to-br from-accent-green to-accent-teal border-green-400 text-white shadow-lg scale-105 animate-flip";
                                const freeSpaceClasses = "bg-gradient-to-br from-accent-amber to-orange-500 border-yellow-400 text-white";
                                const clickableClasses = "bg-white border-slate-200 hover:border-primary-500 hover:shadow-md text-slate-700 cursor-pointer";
                                const shakeClasses = isShaking ? 'animate-shake' : '';

                                const cellClasses = `${baseClasses} ${shakeClasses} ${cell.marked ? (cell.isFreeSpace ? freeSpaceClasses : markedClasses) : clickableClasses}`;
                                
                                return (
                                    <button key={cell.id} onClick={() => handleCellClick(cell.id)} className={cellClasses}>
                                        {cell.isFreeSpace ? (
                                            <><Star className="w-8 h-8 mb-1" /><span className="text-sm font-bold">FREE</span></>
                                        ) : (
                                            <>
                                                <p className="text-xs md:text-sm leading-tight line-clamp-4">{cell.clue?.companyName}</p>
                                                {cell.marked && <div className="absolute inset-0 bg-white/20 flex items-center justify-center"><Check className="w-10 h-10 text-white" /></div>}
                                            </>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="lg:col-span-5 flex flex-col space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border">
                            <h3 className="font-bold text-lg mb-2 text-slate-800">Current Clue</h3>
                            <div className="bg-primary-50 p-4 rounded-lg min-h-[100px] flex items-center justify-center">
                               <p className="text-primary-900 text-center text-md">{currentStep.clue}</p>
                            </div>
                        </div>
                        {currentStep.action === 'bingo' && (
                             <button 
                                onClick={handleBingoClick}
                                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold py-6 px-6 rounded-2xl text-4xl flex items-center justify-center shadow-lg animate-glow transition-transform hover:scale-105"
                            >
                                BINGO!
                            </button>
                        )}
                        {currentStep.action === 'end' && (
                             <button 
                                onClick={onNavigateHome}
                                className="w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl text-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                            >
                                Play a Real Game
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

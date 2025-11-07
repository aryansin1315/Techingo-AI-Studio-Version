import React from 'react';
import { Settings, Crown, QrCode, Play, MousePointerSquare, Swords, PartyPopper, Laptop } from './icons';

interface LandingPageProps {
  onNavigate: (page: 'admin' | 'join' | 'demo') => void;
}

const ActionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    buttonIcon: React.ReactNode;
    onButtonClick: () => void;
    gradient: string;
}> = ({ icon, title, description, buttonText, buttonIcon, onButtonClick, gradient }) => (
    <div
        className="group relative bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl p-8 h-full shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col"
    >
        <div className="text-center">
            <div className={`w-20 h-20 ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-600 mb-6 flex-grow">{description}</p>
            <button
                onClick={onButtonClick}
                className="w-full bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-slate-800 transform hover:scale-105"
            >
                {buttonIcon}
                {buttonText}
            </button>
        </div>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const howItWorksSteps = [
    {
      icon: <MousePointerSquare className="w-10 h-10 text-accent-purple" />,
      title: '1. Create or Join',
      description: 'Admins create a game with an AI-powered topic. Players join instantly with a unique game code.',
    },
    {
      icon: <QrCode className="w-10 h-10 text-accent-teal" />,
      title: '2. Get Your Card',
      description: 'Receive your unique, randomized bingo card filled with clues related to the game topic.',
    },
    {
      icon: <Swords className="w-10 h-10 text-accent-amber" />,
      title: '3. Play in Real-Time',
      description: 'Clues are revealed one by one. Mark your card as you identify the answers and race against others.',
    },
    {
      icon: <PartyPopper className="w-10 h-10 text-accent-green" />,
      title: '4. Claim Bingo & Win!',
      description: 'Complete a line or pattern on your card, hit the BINGO button, and claim your victory!',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-25 text-slate-800">
      <section className="relative min-h-[70vh] flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50 to-accent-purple/10">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-primary bg-clip-text text-transparent mb-6 drop-shadow-sm">
            Techingo
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
            The ultimate interactive tech bingo platform for engaging gameplay, team building, and knowledge sharing in real-time.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ActionCard
                icon={<Crown className="w-10 h-10 text-white" />}
                title="Admin Portal"
                description="Create custom games, manage templates, and monitor live gameplay with powerful admin tools."
                buttonText="Enter Admin Portal"
                buttonIcon={<Settings className="w-5 h-5 mr-2" />}
                onButtonClick={() => onNavigate('admin')}
                gradient="bg-gradient-primary"
            />
            <ActionCard
                icon={<Laptop className="w-10 h-10 text-white" />}
                title="Demo Game"
                description="Try a quick, interactive demo to see how Techingo works before you play for real."
                buttonText="Try the Demo"
                buttonIcon={<Play className="w-5 h-5 mr-2" />}
                onButtonClick={() => onNavigate('demo')}
                gradient="bg-gradient-to-br from-accent-amber to-orange-500"
            />
            <ActionCard
                icon={<Play className="w-10 h-10 text-white" />}
                title="Join Game"
                description="Enter a game code to join an active bingo session and start playing instantly."
                buttonText="Join Game"
                buttonIcon={<QrCode className="w-5 h-5 mr-2" />}
                onButtonClick={() => onNavigate('join')}
                gradient="bg-gradient-success"
            />
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Techingo Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">A simple and engaging experience for everyone.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={step.title} className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
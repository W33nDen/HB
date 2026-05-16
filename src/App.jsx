import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Camera, Star, MessageCircle, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const IMAGES = [
  './img/2911a4f4-3ecd-4e0f-8e99-c17614c30466.jpg',
  './img/5ea8cbba-755a-4c5a-936c-3c2f35733334.jpg',
  './img/d0a37efe-211a-4781-ab53-d9d14aba05ff.jpg',
  './img/photo_2026-01-01_23-41-11.jpg',
  './img/photo_2026-05-16_21-00-38.jpg',
  './img/photo_2026-05-16_21-03-32.jpg',
  './img/photo_2026-05-16_21-04-20.jpg'
];

const VIDEOS = [
  './img/IMG_5539.MOV',
  './img/IMG_5176.MOV',
  './img/IMG_5532.MOV',
  './img/video.mp4'
];

const MEMORIES = [
  {
    icon: "📚",
    title: "Спільні сторінки",
    text: "Наші книжкові клуби та синхронне читання об'єднують нас навіть за тисячі кілометрів. Але скоро ми будемо читати поруч, в одній кімнаті."
  },
  {
    icon: "📖",
    title: "Kindle-girl",
    text: "Ти і твій Kindle — це окремий всесвіт. Обіцяю, в нашому домі в Сіттарді я облаштую для тебе найзатишніший куточок для читання з пледом."
  },
  {
    icon: "🍝",
    title: "Кулінарний приворот",
    text: "Візуалізую, як ти сидиш на кухні, а я готую тобі ідеальну пасту з креветками. Ти заслуговуєш на те, щоб тебе носили на руках."
  },
  {
    icon: "🏔️",
    title: "Денні-Говерла",
    text: "Бувають дні, коли весь світ проти. Але у тебе є свій Денні-Говерла. Я витримаю твої шторми і сльози. Я твій граніт. Завжди на твоєму боці. ❤️"
  },
  {
    icon: "🏡",
    title: "Сіттард",
    text: "Місце, де ніхто не вказуватиме, як жити. Тільки ти, я і повна свобода. Я будую цей фундамент для нас."
  }
];

// Interactive Pointer Glow (Follows Finger/Mouse)
const PointerGlow = () => {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  
  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <motion.div 
      className="fixed top-0 left-0 w-64 h-64 bg-neonPurple/20 rounded-full blur-[80px] pointer-events-none z-0 mix-blend-screen"
      animate={{ x: position.x - 128, y: position.y - 128 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
    />
  );
};

// Advanced Hold-to-Unlock Button
const HoldButton = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const controls = useAnimation();
  const intervalRef = useRef(null);

  const startHold = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    controls.start({ scale: 0.9 });
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current);
          onComplete();
          return 100;
        }
        if (navigator.vibrate && p % 20 === 0) navigator.vibrate(10);
        return p + 2; 
      });
    }, 20); // Fills in ~1 second
  };

  const endHold = () => {
    clearInterval(intervalRef.current);
    setProgress(0);
    controls.start({ scale: 1 });
  };

  return (
    <motion.div 
      className="relative w-48 h-48 rounded-full flex items-center justify-center cursor-pointer select-none touch-none mt-10"
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      onContextMenu={(e) => e.preventDefault()}
      animate={controls}
    >
      <svg className="absolute inset-0 w-full h-full transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]">
        <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
        <circle 
          cx="96" 
          cy="96" 
          r="88" 
          stroke="url(#gradient)" 
          strokeWidth="6" 
          fill="none" 
          strokeDasharray="553" 
          strokeDashoffset={553 - (progress / 100) * 553} 
          strokeLinecap="round" 
          className="transition-all duration-75"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff007f" />
            <stop offset="100%" stopColor="#00f0ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="glass w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,0,127,0.4)] bg-black/40">
         <Sparkles className="w-8 h-8 text-neonPink mb-1 animate-pulse" />
         <span className="text-white font-bold tracking-widest text-xs uppercase opacity-80">Hold</span>
         <span className="text-neonBlue text-[10px] mt-0.5 font-bold tracking-widest">to unlock</span>
      </div>
      <div className="absolute -bottom-8 text-white/40 text-xs tracking-widest uppercase animate-pulse">Затисни пальцем</div>
    </motion.div>
  );
};

// Flip Card
const FlipCard = ({ memory }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="perspective-1000 w-full h-56 cursor-pointer" onClick={() => {
      setIsFlipped(!isFlipped);
      if (navigator.vibrate) navigator.vibrate(25);
    }}>
      <motion.div
        className="w-full h-full relative transform-style-3d transition-transform duration-700 ease-out"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        <div className="absolute inset-0 backface-hidden glass rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-lg hover:shadow-[0_0_20px_rgba(255,0,127,0.3)] transition-shadow">
          <span className="text-5xl mb-4 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{memory.icon}</span>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-neonBlue tracking-wide">{memory.title}</h3>
          <div className="absolute bottom-4 text-[10px] uppercase text-white/30 tracking-widest">Тапни мене</div>
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180 glass rounded-3xl flex items-center justify-center p-6 text-center bg-[#0a0510]/90 border border-neonPink/40 shadow-[0_0_30px_rgba(255,0,127,0.4)]">
          <p className="text-sm md:text-base font-medium text-white/95 leading-relaxed drop-shadow-md">{memory.text}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Swipe Gallery
const SwipeGallery = () => {
  const [cards, setCards] = useState(IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold || info.offset.x > swipeThreshold) {
      if (navigator.vibrate) navigator.vibrate(40);
      setCards((prev) => {
        const newCards = [...prev];
        const swipedCard = newCards.shift();
        newCards.push(swipedCard);
        return newCards;
      });
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }
  };

  return (
    <div className="relative w-full aspect-[3/4] flex items-center justify-center mt-2">
      <div className="absolute top-4 right-4 z-50 glass px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-[0_0_15px_rgba(0,240,255,0.3)] tracking-widest bg-black/40 border-neonBlue/30">
        {currentIndex + 1} / {IMAGES.length}
      </div>

      <AnimatePresence>
        {cards.map((src, index) => {
          if (index > 2) return null; // Show top 3 for better 3D depth
          
          const isTop = index === 0;
          return (
            <motion.div
              key={src + index}
              className="absolute w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10"
              style={{ zIndex: IMAGES.length - index }}
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ 
                scale: 1 - (index * 0.05), 
                y: index * 15, 
                opacity: 1 - (index * 0.2),
                rotate: isTop ? 0 : index % 2 === 0 ? -3 : 3
              }}
              exit={{ x: -300, opacity: 0, rotate: -20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={isTop ? handleDragEnd : undefined}
              whileDrag={{ scale: 1.05, cursor: 'grabbing', rotate: 0 }}
            >
              <img src={src} alt="Gallery" className="w-full h-full object-cover pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030005]/90 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div className="absolute -bottom-6 left-0 w-full text-center z-40 text-[10px] text-white/50 animate-pulse pointer-events-none tracking-widest uppercase">
        Свайп вліво або вправо
      </div>
    </div>
  );
};

// TikTok Style Video Feed
const VideoFeed = () => {
  return (
    <div className="w-full h-[65vh] rounded-3xl overflow-hidden glass shadow-[0_0_40px_rgba(138,43,226,0.2)] border border-neonPurple/30 relative snap-y snap-mandatory overflow-y-scroll scroll-smooth hide-scrollbar mt-2">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 glass px-4 py-1.5 rounded-full text-[10px] font-bold text-white tracking-widest uppercase bg-black/50 animate-pulse pointer-events-none">
        Скроль вниз ↓
      </div>
      {VIDEOS.map((src, i) => (
        <VideoItem key={i} src={src} index={i} total={VIDEOS.length} />
      ))}
    </div>
  );
};

const VideoItem = ({ src, index, total }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        videoRef.current?.play().catch(()=>{});
      } else {
        videoRef.current?.pause();
      }
    }, { threshold: 0.6 });
    
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full h-full snap-center relative bg-black">
       <video 
         ref={videoRef} 
         src={src} 
         loop 
         muted 
         playsInline 
         className="w-full h-full object-cover" 
       />
       {/* Video Overlay Info */}
       <div className="absolute inset-0 bg-gradient-to-t from-[#030005] via-transparent to-transparent pointer-events-none" />
       
       <div className="absolute bottom-6 left-4 z-10 flex flex-col gap-1">
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-neonPink animate-pulse shadow-[0_0_10px_rgba(255,0,127,1)]" />
           <span className="text-[10px] font-bold text-white tracking-widest uppercase opacity-80">Memory #{index + 1}</span>
         </div>
       </div>

       <div className="absolute right-4 bottom-1/2 translate-y-1/2 z-10 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center bg-black/40 border border-white/10 shadow-lg">
            <Heart className="w-4 h-4 text-neonPink fill-neonPink" />
          </div>
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center bg-black/40 border border-white/10 shadow-lg">
             <span className="text-xs font-bold">{index + 1}/{total}</span>
          </div>
       </div>
    </div>
  );
};

// Falling Emojis Rain
const FallingEmojis = () => {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    // Generate emojis
    const newEmojis = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      emoji: ['❤️', '💋', '😘', '✨', '💖', '🎂'][Math.floor(Math.random() * 6)],
      x: Math.random() * 100, // vw
      delay: Math.random() * 3, // start delay
      duration: 3 + Math.random() * 5, // fall duration
      size: 20 + Math.random() * 30 // px size
    }));
    setEmojis(newEmojis);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {emojis.map((e) => (
        <motion.div
          key={e.id}
          initial={{ y: -100, x: `${e.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '120vh', opacity: [1, 1, 0], rotate: 360 }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            ease: "linear",
            repeat: 1 // repeats once
          }}
          className="absolute"
          style={{ fontSize: e.size, filter: 'drop-shadow(0px 0px 10px rgba(255,0,127,0.5))' }}
        >
          {e.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const [hearts, setHearts] = useState([]);

  const handleStart = () => {
    try {
      const heart = confetti.shapeFromText({ text: '❤️' });
      const kiss = confetti.shapeFromText({ text: '💋' });
      confetti({
        particleCount: 150,
        spread: 100,
        startVelocity: 50,
        origin: { y: 0.6 },
        shapes: [heart, kiss, 'circle'],
        scalar: 2,
        disableForReducedMotion: true
      });
    } catch(e) {
      confetti({
        particleCount: 250,
        spread: 120,
        startVelocity: 40,
        origin: { y: 0.6 },
        colors: ['#ff007f', '#8a2be2', '#00f0ff', '#ffffff'],
        disableForReducedMotion: true
      });
    }
    
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setStarted(true);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (navigator.vibrate) navigator.vibrate(30);
    
    const newHeart = { id: Date.now(), x: Math.random() * 60 - 30 };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#030005] relative overflow-hidden">
        <PointerGlow />
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center z-10"
        >
          <motion.h1 
            className="text-[120px] leading-none font-black mb-4 bg-clip-text text-transparent bg-gradient-to-br from-neonPink via-neonPurple to-neonBlue drop-shadow-[0_0_30px_rgba(255,0,127,0.8)]"
            animate={{ textShadow: ["0px 0px 20px #ff007f", "0px 0px 50px #8a2be2", "0px 0px 20px #ff007f"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            18
          </motion.h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight drop-shadow-lg">
            З ДНЕМ НАРОДЖЕННЯ,<br/> <span className="text-neonPink italic">КИЦЯ!</span> 🎂
          </h2>
          <p className="text-white/50 text-sm tracking-widest uppercase mb-12">Iryna's Magic Portal</p>
          
          <HoldButton onComplete={handleStart} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 flex flex-col items-center bg-[#030005] text-white relative overflow-hidden">
      <FallingEmojis />
      <PointerGlow />
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Hero Section */}
      <header className="w-full pt-12 pb-6 px-4 relative z-10 flex flex-col items-center">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-black text-center mb-2 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neonPink to-neonPurple drop-shadow-lg"
        >
          З ДНЕМ НАРОДЖЕННЯ! 🎂
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-neonBlue font-semibold tracking-widest text-[10px] uppercase mb-6"
        >
          Wife of my fire ❤️
        </motion.p>

        {/* Glowing Audio Player */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md glow-border rounded-2xl"
        >
          <div className="glass rounded-2xl overflow-hidden relative z-10 bg-[#0a0510]/80">
            <iframe 
              width="100%" 
              height="166" 
              scrolling="no" 
              frameBorder="no" 
              allow="autoplay; encrypted-media" 
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2321894501&color=%23ff007f&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"
            ></iframe>
          </div>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md px-6 flex-1 flex flex-col relative z-10 mt-2">
        <AnimatePresence mode="wait">
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col w-full"
            >
              <SwipeGallery />
            </motion.div>
          )}

          {activeTab === 'video' && (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col w-full"
            >
              <VideoFeed />
            </motion.div>
          )}

          {activeTab === 'memories' && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col gap-6 w-full pb-10"
            >
              {MEMORIES.map((memory, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <FlipCard memory={memory} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Pill Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="glass-pill px-8 py-3 rounded-full flex items-center gap-8 relative shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/20">
          <AnimatePresence>
            {hearts.map(h => (
              <motion.div
                key={h.id}
                initial={{ opacity: 1, y: 0, x: h.x, scale: 0.5 }}
                animate={{ opacity: 0, y: -60, scale: 2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-0 left-1/2 pointer-events-none text-neonPink drop-shadow-[0_0_10px_rgba(255,0,127,1)]"
              >
                <Heart size={20} fill="currentColor" />
              </motion.div>
            ))}
          </AnimatePresence>

          {[
            { id: 'gallery', icon: Camera, label: 'Фото' },
            { id: 'video', icon: Star, label: 'Відео' },
            { id: 'memories', icon: MessageCircle, label: 'Приколи' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center gap-1.5 transition-colors relative ${
                  isActive ? 'text-neonPink' : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className={`w-7 h-7 transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_15px_rgba(255,0,127,0.8)]' : ''}`} />
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-neonPink shadow-[0_0_10px_rgba(255,0,127,1)]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

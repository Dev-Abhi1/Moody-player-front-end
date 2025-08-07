import { useRef, useState, useEffect } from "react";

const MoodSongs = ({ songs }) => {
  const audioRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex !== null && audioRefs.current[currentIndex]) {
        const audio = audioRefs.current[currentIndex];
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent || 0);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePlay = (index) => {
    if (currentIndex !== null && audioRefs.current[currentIndex]) {
      audioRefs.current[currentIndex].pause();
    }
    audioRefs.current[index].play();
    setCurrentIndex(index);
  };

  const handlePause = (index) => {
    audioRefs.current[index].pause();
    setCurrentIndex(null);
  };

  const handleEnded = () => {
    if (currentIndex !== null && currentIndex < songs.length - 1) {
      handlePlay(currentIndex + 1);
    }
  };

  return (
    <section className="text-white">
      <div className="w-full p-4 relative">
        <div>
          <h1 className="text-4xl py-3 font-semibold">
            <span className="uppercase text-[#facc15]">{songs[0].mood}</span> - Mood Recommended Songs
          </h1>
        </div>
        <div className="w-full h-[400px] overflow-y-auto pr-2 mt-4 custom-scroll">
          {songs.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 bg-[#333] hover:bg-[#3a3a3a] rounded-xl px-6 py-4 mb-3 transition duration-300"
            >
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.artist}</p>

                {/* Progress Bar */}
                {currentIndex === index && (
                  <div className="w-full h-2 bg-gray-700 mt-3 rounded overflow-hidden">
                    <div
                      className="h-full bg-[#facc15] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="text-4xl flex items-center gap-4">
                {currentIndex === index ? (
                  <i
                    className="ri-pause-circle-fill cursor-pointer text-[#facc15] hover:scale-105 transition-transform duration-200"
                    onClick={() => handlePause(index)}
                  ></i>
                ) : (
                  <i
                    className="ri-play-circle-fill cursor-pointer text-white hover:text-[#facc15] hover:scale-105 transition-transform duration-200"
                    onClick={() => handlePlay(index)}
                  ></i>
                )}
                <audio
                  ref={(el) => (audioRefs.current[index] = el)}
                  src={item.audio}
                  onEnded={handleEnded}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoodSongs;

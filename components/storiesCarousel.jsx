import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { flushSync } from "react-dom";
import {
  HiOutlineSpeakerWave,
  HiOutlineSpeakerXMark,
  HiArrowDownTray,
  HiXMark,
} from "react-icons/hi2";

import { Button } from "./ui/button";

const TWEEN_FACTOR = 2;

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const StoriesCarousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const videoRefs = useRef([]);
  const [opacityValues, setOpacityValues] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [mutedSlide, setMutedSlide] = useState(true);
  const [videoRemainingTime, setVideoRemainingTime] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);

    const slideIndex = emblaApi.selectedScrollSnap(true);

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }

      const tweenValue = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
      return numberWithinRange(tweenValue, 0, 1);
    });
    setOpacityValues(styles);
    setSlideIndex(slideIndex);
  }, [emblaApi, setOpacityValues, setSlideIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    onScroll();
    emblaApi.on("scroll", () => {
      flushSync(() => onScroll());
    });
    emblaApi.on("reInit", onScroll);
  }, [emblaApi, onScroll]);

  useEffect(() => {
    // Play the video when it becomes the current slide
    let countdownInterval;

    videoRefs.current.forEach((video, index) => {
      if (video && index === slideIndex) {
        video.play().catch((error) => {
          console.error("Error playing video:", error);
        });

        countdownInterval = setInterval(() => {
          const remainingTime = video.duration - video.currentTime;

          // Convert remainingTime to mm:ss format
          const minutes = Math.floor(remainingTime / 60);
          const seconds = Math.floor(remainingTime % 60);

          // Format the time as mm:ss
          const formattedTime = `${minutes
            .toString()
            .padStart(1, "0")}:${seconds.toString().padStart(2, "0")}`;

          setVideoRemainingTime(formattedTime);
        }, 1000);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
    return () => {
      clearInterval(countdownInterval);
    };
  }, [slideIndex]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!emblaApi) return;

      switch (e.key) {
        case "ArrowLeft":
          emblaApi.scrollPrev();
          break;
        case "ArrowRight":
          emblaApi.scrollNext();
          break;
      }
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    // Add event listener for keyboard input
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [emblaApi, handleKeyDown]);

  return (
    <div className="overflow-hidden p-1 drop-shadow-md" ref={emblaRef}>
      <div
        className={`relative flex w-[80vw] max-w-[350px] touch-pan-y ${
          slides.length <= 2 ? "lg:w-[20vw]" : "lg:w-[40vw] lg:max-w-[700px]"
        }`}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.acrcloud_id}
            className="flex flex-col items-center justify-between"
            style={{
              ...(opacityValues && {
                opacity: opacityValues[index],
              }),
            }}
          >
            <div className="flex w-[80vw] max-w-[350px] items-center justify-start p-2 text-left text-base font-thin text-white lg:w-[20vw]">
              <h1 className="text-bpmPink">{`${slide.results.title}`}</h1>
            </div>
            <div
              className="relative mx-2.5 flex w-[80vw] max-w-[350px] flex-shrink-0 flex-grow-0 transform items-center justify-center lg:w-[20vw]"
              onClick={() =>
                index === slideIndex && setMutedSlide((muted) => !muted)
              }
            >
              {index === slideIndex && (
                <>
                  <div className="absolute left-5 top-5 z-10 rounded-full bg-backgroundBlack/50 p-1.5 text-lg text-white">
                    {mutedSlide ? (
                      <HiOutlineSpeakerXMark />
                    ) : (
                      <HiOutlineSpeakerWave />
                    )}
                  </div>
                  <div className="absolute right-5 top-5 z-10 rounded-md bg-backgroundBlack/50 px-1.5 py-1 text-base font-thin tracking-wide text-white">
                    {videoRemainingTime}
                  </div>
                  <div className="absolute left-5 top-full z-10 -translate-y-14 ">
                    <Button
                      size="icon"
                      className="bg-backgroundBlack/50 text-white hover:text-black"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <a
                        href={slide.download_url}
                        className="flex items-center justify-center gap-1 font-thin"
                        download
                      >
                        <HiArrowDownTray className="text-xl" />
                      </a>
                    </Button>
                  </div>
                </>
              )}
              <video
                ref={(video) => (videoRefs.current[index] = video)}
                key={index}
                className="carousel-video w-full rounded-lg object-cover"
                muted={mutedSlide}
                preload="auto"
                loop
              >
                <source src={slide.drive_url} />
              </video>
            </div>
          </div>
        ))}
      </div>
      <div
        className={`relative left-0 right-0 z-10 mx-auto mt-5 h-1 w-[80vw] max-w-[350px] overflow-hidden rounded-xl bg-navbarBlack2 ${
          slides.length <= 2 ? "lg:w-[20vw]" : "lg:w-[40vw] lg:max-w-[700px]"
        }`}
      >
        <div
          className="absolute -left-full bottom-0 top-0 w-full rounded-xl bg-bpmPink"
          style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
        />
      </div>
    </div>
  );
};

export default function StoriesCarouselPopup({ slides, options, onClick }) {
  return (
    <>
      <div className="fixed left-0 top-0 z-[999] flex h-screen w-screen animate-fade-in-popup items-center justify-center bg-dialogBlack/75 text-center backdrop-blur-[3px]">
        <StoriesCarousel slides={slides} options={options} />
        <button
          onClick={onClick}
          className="absolute right-6 top-6 text-3xl text-gray-400 drop-shadow-md transition-colors hover:text-white lg:right-10 lg:top-10 lg:text-4xl"
        >
          <HiXMark />
        </button>
      </div>
    </>
  );
}

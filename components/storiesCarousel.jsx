import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { flushSync } from "react-dom";
import {
  HiChevronRight,
  HiChevronLeft,
  HiXMark,
  HiArrowDownTray,
} from "react-icons/hi2";
import { Button } from "./ui/button";

const TWEEN_FACTOR = 2;

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const StoriesCarousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [opacityValues, setOpacityValues] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);

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
  }, [emblaApi, setOpacityValues]);

  useEffect(() => {
    if (!emblaApi) return;

    onScroll();
    emblaApi.on("scroll", () => {
      flushSync(() => onScroll());
    });
    emblaApi.on("reInit", onScroll);
  }, [emblaApi, onScroll]);

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
        className={`relative flex w-[100vw] touch-pan-y ${
          slides.length <= 2 ? "lg:w-[30vw]" : "lg:w-[70vw]"
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
            <div className="flex w-[100vw] items-center justify-start p-2 text-left text-base font-thin text-white lg:w-[30vw]">
              <h1 className="text-bpmPink">{`${slide.results.title}`}</h1>
            </div>
            <div className="relative mx-0 flex w-[100vw] flex-shrink-0 flex-grow-0 transform items-center justify-center lg:mx-3 lg:w-[30vw]">
              <div className="absolute bottom-full left-4 z-10 translate-y-14">
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
              <iframe
                width="640"
                height="480"
                src={slide.drive_url}
                key={index}
                className="carousel-video w-full rounded-lg object-cover"
                loading="eager"
              />
            </div>
          </div>
        ))}
      </div>
      <div
        className={`relative left-0 right-0 z-10 mx-auto mt-5 h-1 w-[100vw] overflow-hidden rounded-xl bg-navbarBlack2 ${
          slides.length <= 2 ? "lg:w-[30vw]" : "lg:w-[70vw]"
        }`}
      >
        <div
          className="absolute -left-full bottom-0 top-0 w-full rounded-xl bg-bpmPink"
          style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
        />
      </div>
      <div
        className="absolute right-1 top-1/2 z-10"
        onClick={() => emblaApi.scrollNext()}
      >
        <HiChevronRight className="text-3xl text-white drop-shadow-md transition-colors duration-200 hover:text-bpmPink lg:text-4xl" />
      </div>
      <div
        className="absolute left-1 top-1/2 z-10"
        onClick={() => emblaApi.scrollPrev()}
      >
        <HiChevronLeft className="text-3xl text-white drop-shadow-md transition-colors duration-200 hover:text-bpmPink lg:text-4xl" />
      </div>
    </div>
  );
};

export default function StoriesCarouselPopup({ slides, options, onClick }) {
  return (
    <>
      <div className="fixed left-0 top-0 z-[999] flex h-screen w-screen animate-fade-in-popup items-center justify-center bg-dialogBlack/50 text-center backdrop-blur-[3px]">
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

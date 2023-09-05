import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { flushSync } from "react-dom";
import {
  HiOutlineSpeakerWave,
  HiOutlineSpeakerXMark,
  HiArrowDownTray,
} from "react-icons/hi2";

import { Button } from "./ui/button";
import Link from "next/link";

const TWEEN_FACTOR = 2;

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const EmblaCarousel = (props) => {
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

  return (
    <div
      className='overflow-hidden rounded-lg drop-shadow-md p-5'
      ref={emblaRef}
    >
      <div
        className={`flex relative touch-pan-y w-[80dvw] max-w-[350px] ${
          slides.length <= 2 ? "lg:w-[20dvw]" : "lg:w-[40dvw] lg:max-w-[700px]"
        }`}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.metadata[0].acrid}
            className='flex flex-col justify-center items-center'
            style={{
              ...(opacityValues && {
                opacity: opacityValues[index],
              }),
            }}
          >
            <div className='w-[80dvw] lg:w-[20dvw] max-w-[350px] flex justify-center items-center text-white text-base font-thin mb-1 px-1'>
              <h1>
                {`${slide.metadata[0].title}`}
                <br />
                <span className='text-bpmPink'>{`${slide.metadata[0].artist}`}</span>
              </h1>
            </div>
            <div
              className='flex justify-center items-center relative transform flex-shrink-0 flex-grow-0 w-[80dvw] lg:w-[20dvw] max-w-[350px] mx-2.5'
              key={index}
              onClick={() =>
                index === slideIndex && setMutedSlide((muted) => !muted)
              }
            >
              {index === slideIndex && (
                <>
                  <div className='absolute z-10 top-5 left-5 text-white text-lg p-1.5 rounded-full bg-backgroundBlack/50'>
                    {mutedSlide ? (
                      <HiOutlineSpeakerXMark />
                    ) : (
                      <HiOutlineSpeakerWave />
                    )}
                  </div>
                  <div className='absolute z-10 top-5 right-5 text-white text-base font-thin tracking-wide px-1.5 py-1 rounded-md bg-backgroundBlack/50'>
                    {videoRemainingTime}
                  </div>
                  <div className='absolute z-10 top-full left-5 -translate-y-14 '>
                    <Button
                      size='icon'
                      className='bg-backgroundBlack/50 text-white hover:text-black'
                    >
                      <Link
                        href={slide.download_url}
                        className='flex gap-1 items-center justify-center font-thin'
                        download
                      >
                        <HiArrowDownTray className='text-xl' />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
              <video
                ref={(video) => (videoRefs.current[index] = video)}
                key={index}
                className='w-full object-cover rounded-lg carousel-video'
                muted={mutedSlide}
                preload='auto'
                loop
              >
                <source src={slide.drive_url} />
              </video>
            </div>
          </div>
        ))}
      </div>
      <div
        className={`z-10 bg-navbarBlack2 relative h-1 left-0 right-0 mt-2 mx-auto overflow-hidden rounded-xl w-[80dvw] max-w-[350px] ${
          slides.length <= 2 ? "lg:w-[20dvw]" : "lg:w-[40dvw] lg:max-w-[700px]"
        }`}
      >
        <div
          className='bg-bpmPink absolute w-full top-0 bottom-0 -left-full rounded-xl'
          style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
        />
      </div>
    </div>
  );
};

export default EmblaCarousel;

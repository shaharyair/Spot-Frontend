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
  const [slideInView, setSlideInView] = useState(0);
  const [mutedSlide, setMutedSlide] = useState(true);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);

    const slideIndex = parseInt(emblaApi.slidesInView(true));

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
    setSlideInView(slideIndex);
  }, [emblaApi, setOpacityValues, setSlideInView]);

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
    videoRefs.current.forEach((video, index) => {
      if (index === slideInView) {
        if (video && video.readyState >= 2) {
          video.play().catch((error) => {
            console.error("Error playing video:", error);
          });
        } else if (video) {
          video.addEventListener("canplay", () => {
            video.play().catch((error) => {
              console.error("Error playing video:", error);
            });
          });
        }
      } else if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [slideInView]);

  return (
    <div
      className='overflow-hidden rounded-lg drop-shadow-md p-5'
      ref={emblaRef}
    >
      <div
        className={`flex touch-pan-y w-full ${
          slides.length <= 2 ? "max-w-[350px]" : "max-w-[750px]"
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
            <div className='w-[82dvw] lg:w-[20dvw] max-w-[350px] flex justify-between items-center text-white text-base font-thin  mb-1'>
              <h1>
                {`${slide.metadata[0].title}`}
                <br />
                <span className='text-bpmPink'>{`${slide.metadata[0].artist}`}</span>
              </h1>
              <Button size='icon'>
                <Link
                  href='https://drive.google.com/uc?export=download&id=1HFLnfYmvFgP1rIEJfuarwzSKFqc2b61I'
                  // href=''
                  className='flex gap-1 items-center justify-center '
                  download
                >
                  <HiArrowDownTray className='text-xl' />
                </Link>
              </Button>
            </div>
            <div
              className='flex justify-center items-center relative transform flex-shrink-0 flex-grow-0 w-[82dvw] lg:w-[20dvw] max-w-[350px] mx-2.5'
              key={index}
              style={{
                ...(opacityValues && {
                  opacity: opacityValues[index],
                }),
              }}
              onClick={() => setMutedSlide((muted) => !muted)}
            >
              <div className='absolute z-[999] top-5 left-5 text-white text-lg p-1.5 rounded-full bg-backgroundBlack/50'>
                {mutedSlide ? (
                  <HiOutlineSpeakerXMark />
                ) : (
                  <HiOutlineSpeakerWave />
                )}
              </div>
              <video
                key={index}
                ref={(element) => (videoRefs.current[index] = element)}
                className='w-full object-cover rounded-lg carousel-video'
                autoPlay={index === slideInView}
                muted={mutedSlide}
                loop
              >
                <source src={slide.drive_url} />
              </video>
            </div>
          </div>
        ))}
      </div>
      <div className='z-10 bg-navbarBlack2 relative h-1 left-0 right-0 mt-2 mx-auto  max-w-[750px] overflow-hidden rounded-xl w-[98%]'>
        <div
          className='bg-bpmPink absolute w-full top-0 bottom-0 -left-full rounded-xl'
          style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
        />
      </div>
    </div>
  );
};

export default EmblaCarousel;

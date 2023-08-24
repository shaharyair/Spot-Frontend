import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { flushSync } from "react-dom";

const TWEEN_FACTOR = 4.5;

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const EmblaCarousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [opacityValues, setOpacityValues] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [slideInView, setSlideInView] = useState(0);

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
    const videos = document.querySelectorAll(".carousel-video");
    videos.forEach((video, index) => {
      if (index === slideInView) {
        video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [slideInView]);

  return (
    <div className='overflow-hidden' ref={emblaRef}>
      <div className='flex touch-pan-y w-full max-w-[750px] rounded-lg'>
        {slides.map((slide, index) => (
          <div
            key={index}
            className='flex flex-col justify-center items-center gap-2'
            style={{
              ...(opacityValues && {
                opacity: opacityValues[index],
              }),
            }}
          >
            <h1 className='text-white text-xl font-thin'>
              <span className='text-bpmPink'>Yust</span> - {`Track ${index}`}
            </h1>
            <div
              className='flex justify-center items-center transform flex-shrink-0 flex-grow-0 w-min-0 w-[85vw] max-w-[350px] mx-2'
              key={index}
              style={{
                ...(opacityValues && {
                  opacity: opacityValues[index],
                }),
              }}
            >
              <video
                className='w-full object-cover drop-shadow-md rounded-lg carousel-video'
                autoPlay={index === slideInView}
                muted={index !== slideInView}
                loop
              >
                <source src={slide} />
              </video>
            </div>
          </div>
        ))}
      </div>
      <div className=' z-10 bg-navbarBlack2 relative h-1 left-0 right-0 mt-1 mx-auto w-[750px] overflow-hidden rounded-xl'>
        <div
          className='bg-bpmPink absolute w-full top-0 bottom-0 -left-full rounded-xl'
          style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
        />
      </div>
    </div>
  );
};

export default EmblaCarousel;

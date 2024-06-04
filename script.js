const sectionEls = document.querySelectorAll(".animate");

const options = {
  rootMargin: "10%",
  threshold: 0.5,
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
console.log("prefersReducedMotion:", prefersReducedMotion);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const isLeftDoor = entry.target.classList.contains("door--left");
    const isRightDoor = entry.target.classList.contains("door--right");
    const isWaterflow = entry.target.classList.contains("waterflow");
    const isBoat = entry.target.classList.contains("boat");
    const isFish = entry.target.classList.contains("conveyor-fish-two");
    const isPackFish = entry.target.classList.contains("fish-package");
    const isPackFish2 = entry.target.classList.contains("fish-package2");
    const isHand = entry.target.classList.contains("hand");
    const isArm = entry.target.classList.contains("arm");

    // Add animation classes based on intersection status
    if (entry.isIntersecting) {
      if (isLeftDoor) {
        entry.target.classList.add("animation-left");
      }
      if (isRightDoor) {
        entry.target.classList.add("animation-right");
      }
      if (isWaterflow) {
        entry.target.classList.add("squiggle");
      }
      if (isFish) {
        entry.target.classList.add("conveyor-fish-two-animate");
      }
      if (isPackFish) {
        entry.target.classList.add("fish-package-animation");
      }
      if (isPackFish2) {
        entry.target.classList.add("fish-package2-animation");
      }
      if (isHand) {
        entry.target.classList.add("hand-animation");
      }
      if (isArm) {
        entry.target.classList.add("arm-animation");
      }
      if (isBoat) {
        gsap.from(".boat", { duration: 3, rotate: '-5%', repeat: -1 });
        gsap.to(".boat", { duration: 3, y: '10%', rotate: '5%', repeat: -1, yoyo: true });
      }
    }
  });
}, options);

sectionEls.forEach((el) => observer.observe(el));

// Function to animate boats along their paths
const animateBoat = (pathSelector, boatSelector, animationDuration, delay = 0, reverse = false) => {
  const path = document.querySelector(pathSelector);
  const boat = document.querySelector(boatSelector);

  const totalLength = path.getTotalLength();
  const position = { x: reverse ? totalLength : 0, y: 0 };

  // Initial position of the boat
  const initialPoint = path.getPointAtLength(position.x);
  boat.setAttribute('x', initialPoint.x - 25);
  boat.setAttribute('y', initialPoint.y - 25);

  // Create GSAP animation for the boat movement along the path
  const animationTween = gsap.to(position, {
    x: reverse ? 0 : totalLength,
    duration: animationDuration,
    onUpdate: () => {
      const point = path.getPointAtLength(position.x);
      boat.setAttribute('x', point.x - 25);
      boat.setAttribute('y', point.y - 25);
    },
    paused: true,
    delay: delay // staggered start
  });

  // Create an observer to play/pause the animation based on intersection
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animationTween.play();
      } else {
        animationTween.pause();
      }
    });
  }, { threshold: 0 });

  observer.observe(path);
};

// Function to animate the second boat with fade-in effect
const animateBoatWithFadeIn = (pathSelector, boatSelector, animationDuration, delay = 0, reverse = false) => {
  const path = document.querySelector(pathSelector);
  const boat = document.querySelector(boatSelector);
  
  boat.style.opacity = 0; // Ensure boat is hidden initially

  const totalLength = path.getTotalLength();
  const position = { x: reverse ? totalLength : 0, y: 0 };

  // Initial position of the boat
  const initialPoint = path.getPointAtLength(position.x);
  boat.setAttribute('x', initialPoint.x - 25);
  boat.setAttribute('y', initialPoint.y - 25);

  // Create a GSAP timeline for fade-in and movement animation
  const timeline = gsap.timeline({ paused: true, delay: delay });
  timeline.to(boat, { opacity: 1, duration: 1 }); // Shorter fade-in effect
  timeline.to(position, {
    x: reverse ? 0 : totalLength,
    duration: animationDuration,
    onUpdate: () => {
      const point = path.getPointAtLength(position.x);
      boat.setAttribute('x', point.x - 25);
      boat.setAttribute('y', point.y - 25);
    },
  });

  // Create an observer to play/pause the animation based on intersection
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.play();
      } else {
        timeline.pause();
      }
    });
  }, { threshold: 0 });

  observer.observe(path);
};

// Animate boats in section-five in the same direction with different delays
animateBoat('.back-path', '.boat-back', prefersReducedMotion ? 110 : 30, 0);
animateBoatWithFadeIn('.back-path', '.boat-back--second', prefersReducedMotion ? 110 : 35, 1.5); // Shorter delay for the second boat with fade-in

// Animate boats in section-seven in reverse direction with different delays
animateBoat('.path2', '.boat-china', prefersReducedMotion ? 100 : 30, 0, true);
animateBoatWithFadeIn('.path2', '.boat-china--second', prefersReducedMotion ? 100 : 30, 1.5, true); // Shorter delay for the second boat with fade-in

// Gsap for scene 1: Animate skies and water
const gsapDuration = prefersReducedMotion ? 8 : 16; // Adjust duration based on prefers-reduced-motion

if (!prefersReducedMotion) { // Check if prefers-reduced-motion is not set to reduce
  gsap.to([".sky-one", ".sky-three"], { duration: 8, x: '-4vw', repeat: -1, yoyo: true });
  gsap.to([".sky-two", ".sky-four"], { duration: 8, x: '-4vw', repeat: -1, yoyo: true, delay: 2 });
  gsap.to([".water-two", ".water-four"], { duration: 2, x: '-4vw', repeat: -1, yoyo: true });
  gsap.to([".water-one", ".water-three"], { duration: 2, x: '-4vw', repeat: -1, yoyo: true, delay: 1 });
} else {
  gsap.to([".sky-one", ".sky-three", ".sky-two", ".sky-four", ".water-one", ".water-three", ".water-two", ".water-four"], { duration: gsapDuration, x: '-4.8vw', repeat: -1, yoyo: true });
}

// Separate observer for section nine hand and arm animations
const sectionNineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const isHand = entry.target.classList.contains("hand");
    const isArm = entry.target.classList.contains("arm");

    // Add animation classes based on intersection status
    if (entry.isIntersecting) {
      if (isHand) {
        entry.target.classList.add("hand-animation");
      }
      if (isArm) {
        entry.target.classList.add("arm-animation");
      }
    }
  });
}, options);

// Observe hand and arm elements in section nine
document.querySelectorAll('.section-nine .animate').forEach((el) => sectionNineObserver.observe(el));

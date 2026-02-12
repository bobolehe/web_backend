// About heading animation
const aboutHeading = document.querySelector('.about__heading');

window.gsap.from(aboutHeading, {
    scrollTrigger: {
        trigger: aboutHeading,
        start: 'top 75%',
    },
    x: -100,
    ease: 'power4.inOut',
    opacity: 0,
    duration: 1,
});

const aboutContent = document.querySelector('.about__content');

window.gsap.from(aboutContent, {
    scrollTrigger: {
        trigger: aboutContent,
        start: 'top 75%',
    },
    x: 100,
    ease: 'power4.inOut',
    opacity: 0,
    duration: 1,
    delay: 0.25,
});

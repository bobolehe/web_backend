// Hero header animation
const heroContainerLanding = document.querySelector('.hero__container-content--landing');
const heroContainer = document.querySelector('.hero__container-content');
const heroHeading = document.querySelector('#hero__heading-content');
const landingSearch = document.getElementById('hj-landing-search');
const valuationLink = document.getElementById('hero__valuation-link');

const init = () => {
    if (heroContainerLanding) {
        window.gsap.from(heroContainerLanding, {
            autoAlpha: 0,
        });
    }

    if (landingSearch) {
        window.gsap.from(landingSearch, {
            opacity: 0,
            ease: 'power4.inOut',
            duration: 1,
            delay: 1.05,
        });
    }

    if (valuationLink) {
        window.gsap.from(valuationLink, {
            opacity: 0,
            ease: 'power4.inOut',
            duration: 1,
            delay: 1.05,
        });
    }

    if (heroContainer) {
        window.gsap.from(heroContainer, {
            autoAlpha: 0,
        });
    }

    window.gsap.from(heroHeading, {
        opacity: 0,
        x: -100,
        ease: 'power4.inOut',
        duration: 1.5,
    });

    // Hero button animation
    const heroButtons = window.gsap.utils.toArray('.hero_button');

    let duration = 1;

    heroButtons.forEach((button) => {
        window.gsap.from(
            button,
            {
                opacity: 0,
                y: 100,
                ease: 'power4.inOut',
                duration: duration,
                delay: 1,
                stagger: 1,
            },
            '0',
        );

        duration += 0.2;
    });
};

window.addEventListener('load', () => {
    init();
});

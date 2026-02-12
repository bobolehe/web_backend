const bannerImages = window.gsap.utils.toArray('.banner__full-width-image');
const bannerContentBlocks = window.gsap.utils.toArray('.banner__full-width-content');
const slideLeft = window.gsap.utils.toArray('.slide__left');

bannerImages.forEach((image, index) => {
    let xOffset = 100;

    if (index % 2 === 0) {
        xOffset = -100;
    }

    window.gsap.from(
        image,
        {
            scrollTrigger: {
                trigger: image,
                start: 'top 85%',
            },
            opacity: 0,
            x: xOffset,
            ease: 'power4.inOut',
            duration: 1,
            delay: 0.25,
            stagger: 1,
        },
        '0',
    );
});

bannerContentBlocks.forEach((block, index) => {
    let xOffset = -100;

    if (index % 2 === 0) {
        xOffset = 100;
    }

    window.gsap.from(
        block,
        {
            scrollTrigger: {
                trigger: block,
                start: 'top 85%',
            },
            opacity: 0,
            x: xOffset,
            ease: 'power4.inOut',
            duration: 1,
            delay: 0.5,
            stagger: 1,
        },
        '0',
    );
});

slideLeft.forEach((element) => {
    let xOffset = 100;

    window.gsap.from(
        element,
        {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
            },
            opacity: 0,
            x: xOffset,
            ease: 'power4.inOut',
            duration: 1,
            delay: 0.25,
            stagger: 1,
        },
        '0',
    );
});

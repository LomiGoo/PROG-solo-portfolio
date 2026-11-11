const homeSection = document.querySelector('.home-section');
const aboutSection = document.querySelector('.about-section');
const worksSection = document.querySelector('.works-section');
const experiencePage = document.querySelector('.experience-page');
const reflectionSection = document.querySelector('.reflection-page');
const showAboutButton = document.querySelector('button[data-show-about]');
document.querySelector('#current-year').textContent = new Date().getFullYear();
const pageCarousel = document.querySelector('.page-carousel');
const pageCarouselTrack = document.querySelector('.page-carousel-track');
const pageCarouselSet = document.querySelector('.page-carousel-set');
const navigationLinks = document.querySelectorAll('.navbar-links a');
let pageCarouselOffset = 0;
let lastPageCarouselTime = 0;

pageCarouselTrack.appendChild(pageCarouselSet.cloneNode(true));

function updateActiveNavigation(sectionId) {
    const navigationSectionId = sectionId === 'experience' ? 'works' : sectionId;

    navigationLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${navigationSectionId}`);
    });
}

function scrollToSection(section) {
    window.requestAnimationFrame(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function animatePageCarousel(timestamp) {
    const elapsedTime = Math.min(timestamp - lastPageCarouselTime, 50);
    const setWidth = pageCarouselSet.getBoundingClientRect().width + 24;

    if (setWidth > 24) {
        pageCarouselOffset += elapsedTime * 0.045;

        if (pageCarouselOffset >= setWidth) {
            pageCarouselOffset -= setWidth;
        }

        pageCarouselTrack.style.transform = `translate3d(-${pageCarouselOffset}px, 0, 0)`;
    }

    lastPageCarouselTime = timestamp;
    window.requestAnimationFrame(animatePageCarousel);
}

window.requestAnimationFrame(animatePageCarousel);

function showSection(sectionToShow, focusTarget) {
    window.history.replaceState(null, '', `#${sectionToShow.id}`);
    updateActiveNavigation(sectionToShow.id);

    if (sectionToShow === worksSection) {
        homeSection.style.display = 'none';
        homeSection.setAttribute('aria-hidden', 'true');
        worksSection.style.display = 'flex';
        worksSection.setAttribute('aria-hidden', 'false');
        experiencePage.style.display = 'flex';
        experiencePage.setAttribute('aria-hidden', 'false');
        reflectionSection.style.display = 'flex';
        reflectionSection.setAttribute('aria-hidden', 'false');
        scrollToSection(worksSection);
        return;
    }

    if (sectionToShow === reflectionSection) {
        homeSection.style.display = 'none';
        homeSection.setAttribute('aria-hidden', 'true');
        aboutSection.style.display = 'flex';
        aboutSection.setAttribute('aria-hidden', 'false');
        worksSection.style.display = 'flex';
        worksSection.setAttribute('aria-hidden', 'false');
        experiencePage.style.display = 'flex';
        experiencePage.setAttribute('aria-hidden', 'false');
        reflectionSection.style.display = 'flex';
        reflectionSection.setAttribute('aria-hidden', 'false');
        scrollToSection(reflectionSection);
        return;
    }

    document.querySelectorAll('main > section').forEach((section) => {
        section.style.display = 'none';
        section.setAttribute('aria-hidden', 'true');
    });
    sectionToShow.style.display = 'flex';
    sectionToShow.setAttribute('aria-hidden', 'false');

    if (sectionToShow === aboutSection) {
        worksSection.style.display = 'flex';
        worksSection.setAttribute('aria-hidden', 'false');
        experiencePage.style.display = 'flex';
        experiencePage.setAttribute('aria-hidden', 'false');
        reflectionSection.style.display = 'flex';
        reflectionSection.setAttribute('aria-hidden', 'false');
    }

    scrollToSection(sectionToShow);

    if (focusTarget) {
        focusTarget.focus();
    }
}

showAboutButton.addEventListener('click', () => {
    showSection(aboutSection, null);
});

document.querySelector('[data-nav-home]').addEventListener('click', (event) => {
    event.preventDefault();
    showSection(homeSection, showAboutButton);
});

document.querySelector('[data-nav-about]').addEventListener('click', (event) => {
    event.preventDefault();
    showSection(aboutSection, null);
});

document.querySelector('[data-nav-works]').addEventListener('click', (event) => {
    event.preventDefault();
    showSection(worksSection, null);
});

document.querySelector('[href="#reflection"]').addEventListener('click', (event) => {
    event.preventDefault();
    showSection(reflectionSection, null);
});

const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((firstEntry, secondEntry) => secondEntry.intersectionRatio - firstEntry.intersectionRatio)[0];

    if (visibleSection) {
        window.history.replaceState(null, '', `#${visibleSection.target.id}`);
        updateActiveNavigation(visibleSection.target.id);
    }
}, { threshold: 0.5 });

document.querySelectorAll('main > section').forEach((section) => {
    sectionObserver.observe(section);
});


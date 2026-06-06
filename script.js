const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navClose = document.querySelector('.nav__close');
const navLinks = document.querySelectorAll('.nav__link');

const handleScroll = () => {
    if (window.scrollY > 20) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
};

const nav = document.getElementById('main-nav');

const toggleMenu = () => {
    const isOpen = document.body.classList.toggle('menu-open');
    navToggle?.classList.toggle('open', isOpen);
    if (navToggle) navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (nav) nav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
};

const closeMenu = () => {
    document.body.classList.remove('menu-open');
    if (navToggle) {
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    if (nav) nav.setAttribute('aria-hidden', 'true');
};

navToggle?.addEventListener('click', toggleMenu);
navClose?.addEventListener('click', closeMenu);
navLinks.forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', handleScroll);

// Close menu automatically when resizing above mobile breakpoint
const handleResize = () => {
    if (window.innerWidth > 768 && document.body.classList.contains('menu-open')) {
        closeMenu();
    }
};

window.addEventListener('resize', handleResize);

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
});

revealElements.forEach(section => revealObserver.observe(section));

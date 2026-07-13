(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // ═══ HEADER SCROLL ═══
    const header = document.getElementById('site-header');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 40);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ═══ MOBILE MENU ═══
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    const openMenu = () => {
        mobileMenu.classList.add('open');
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    menuBtn?.addEventListener('click', () => {
        mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
    mobileOverlay?.addEventListener('click', closeMenu);
    mobileMenu?.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

    // ═══ SMOOTH ANCHOR SCROLL ═══
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                closeMenu();
                const offset = 80;
                const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // ═══ BOKEH BACKGROUND ═══
    if (!isMobile) {
        const bokehCanvas = document.getElementById('bokeh-canvas');
        if (bokehCanvas) {
            const ctx = bokehCanvas.getContext('2d');
            let w, h;
            const orbs = [];
            const ORB_COUNT = 28;

            const resize = () => {
                w = bokehCanvas.width = window.innerWidth;
                h = bokehCanvas.height = window.innerHeight;
            };
            resize();
            window.addEventListener('resize', resize, { passive: true });

            const colors = [
                { r: 99, g: 102, b: 241 },   // #6366F1
                { r: 139, g: 92, b: 246 },    // #8B5CF6
                { r: 6, g: 182, b: 212 },     // #06B6D4
                { r: 56, g: 189, b: 248 },    // #38BDF8
                { r: 168, g: 85, b: 247 },    // #A855F7
                { r: 255, g: 255, b: 255 },   // white
            ];

            for (let i = 0; i < ORB_COUNT; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                const isSmall = Math.random() > 0.6;
                orbs.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: isSmall ? 30 + Math.random() * 60 : 80 + Math.random() * 180,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.3,
                    color,
                    alpha: isSmall ? 0.04 + Math.random() * 0.08 : 0.03 + Math.random() * 0.07,
                    pulseSpeed: 0.001 + Math.random() * 0.004,
                    pulseOffset: Math.random() * Math.PI * 2,
                    glowRadius: isSmall ? 1 : 1.8,
                });
            }

            let frame = 0;
            const drawBokeh = () => {
                ctx.clearRect(0, 0, w, h);
                frame++;

                orbs.forEach(orb => {
                    orb.x += orb.vx;
                    orb.y += orb.vy;

                    if (orb.x < -orb.r * 2) orb.x = w + orb.r;
                    if (orb.x > w + orb.r * 2) orb.x = -orb.r;
                    if (orb.y < -orb.r * 2) orb.y = h + orb.r;
                    if (orb.y > h + orb.r * 2) orb.y = -orb.r;

                    const pulse = Math.sin(frame * orb.pulseSpeed + orb.pulseOffset) * 0.5 + 0.5;
                    const alpha = orb.alpha * (0.5 + pulse * 0.5);

                    // Outer glow
                    const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * orb.glowRadius);
                    grad.addColorStop(0, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${alpha * 1.2})`);
                    grad.addColorStop(0.3, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${alpha * 0.6})`);
                    grad.addColorStop(0.7, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${alpha * 0.15})`);
                    grad.addColorStop(1, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},0)`);

                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(orb.x, orb.y, orb.r * orb.glowRadius, 0, Math.PI * 2);
                    ctx.fill();

                    // Bright core
                    const coreGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * 0.3);
                    coreGrad.addColorStop(0, `rgba(${Math.min(255, orb.color.r + 80)},${Math.min(255, orb.color.g + 80)},${Math.min(255, orb.color.b + 80)},${alpha * 0.8})`);
                    coreGrad.addColorStop(1, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},0)`);

                    ctx.fillStyle = coreGrad;
                    ctx.beginPath();
                    ctx.arc(orb.x, orb.y, orb.r * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                });

                requestAnimationFrame(drawBokeh);
            };

            requestAnimationFrame(drawBokeh);
        }
    }

    // ═══ HERO PARTICLES ═══
    const particlesContainer = document.getElementById('hero-particles');
    if (particlesContainer && !isMobile) {
        const count = 20;
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('span');
            const size = 2 + Math.random() * 3;
            dot.style.cssText = `
                left: ${5 + Math.random() * 90}%;
                top: ${5 + Math.random() * 85}%;
                width: ${size}px;
                height: ${size}px;
                animation-delay: ${Math.random() * 8}s;
                animation-duration: ${8 + Math.random() * 8}s;
            `;
            particlesContainer.appendChild(dot);
        }
    }

    // ═══ HERO ENTRANCE ANIMATION ═══
    const animateHero = () => {
        const pill = document.getElementById('hero-pill');
        const words = document.querySelectorAll('.hero__title-word');
        const gradient = document.getElementById('hero-gradient');
        const subtitle = document.getElementById('hero-subtitle');
        const buttons = document.getElementById('hero-buttons');
        const stats = document.getElementById('hero-stats');

        const timeline = [
            { el: pill, delay: 200 },
            ...Array.from(words).map((w, i) => ({ el: w, delay: 400 + i * 120 })),
            { el: gradient, delay: 600 + words.length * 120 },
            { el: subtitle, delay: 900 + words.length * 120 },
            { el: buttons, delay: 1050 + words.length * 120 },
            { el: stats, delay: 1200 + words.length * 120 },
        ];

        timeline.forEach(({ el, delay }) => {
            if (!el) return;
            setTimeout(() => {
                el.style.transition = 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.filter = 'none';
            }, delay);
        });
    };

    requestAnimationFrame(() => {
        setTimeout(animateHero, 100);
    });

    // ═══ INTERSECTION OBSERVER — REVEAL ═══
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: isMobile ? 0.05 : 0.12,
        rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px',
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ═══ PROCESS STEPS — ANIMATED ENTRANCE ═══
    const processContainer = document.getElementById('process-steps');
    if (processContainer) {
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lineWrap = processContainer.querySelector('.process-line-wrap');
                    const steps = processContainer.querySelectorAll('.process-step');
                    const dot = processContainer.querySelector('.process-line-dot animateMotion');

                    // Start line drawing
                    if (lineWrap) lineWrap.classList.add('line-visible');

                    // Start energy dot
                    if (dot) {
                        setTimeout(() => {
                            try { dot.beginElement(); } catch(e) {}
                        }, 300);
                    }

                    // Step 1 appears with bounce
                    if (steps[0]) steps[0].classList.add('step-visible');

                    // Step 2 appears as line passes middle
                    if (steps[1]) {
                        setTimeout(() => steps[1].classList.add('step-visible'), 650);
                    }

                    // Step 3 appears as line reaches end
                    if (steps[2]) {
                        setTimeout(() => steps[2].classList.add('step-visible'), 1300);
                    }

                    processObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        processObserver.observe(processContainer);
    }

    // ═══ STAT COUNTER ANIMATION ═══
    const animateCounters = () => {
        const statNumbers = document.querySelectorAll('.stat-card__number, .about-stat__number');
        statNumbers.forEach(el => {
            const text = el.textContent;
            const match = text.match(/^(\d+)(\+?)$/);
            if (!match) return;

            const target = parseInt(match[1]);
            const suffix = match[2] || '';
            const duration = 1200;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            };

            el.textContent = '0' + suffix;
            requestAnimationFrame(tick);
        });
    };

    const statsEl = document.getElementById('hero-stats');
    if (statsEl) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateCounters, 400);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsEl);
    }

    // ═══ MAGNETIC BUTTON EFFECT ═══
    if (!isMobile) {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ═══ CARD TILT EFFECT ═══
    if (!isMobile) {
        document.querySelectorAll('.card, .service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotateX = (y - 0.5) * -8;
                const rotateY = (x - 0.5) * 8;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
})();

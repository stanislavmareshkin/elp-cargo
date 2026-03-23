/* ============================================
   ELP CARGO — Premium JavaScript
   Ultra-rich animations & interactions
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

    // ===== HEADER SCROLL =====
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ===== BURGER MENU =====
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('open');
        });
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('open');
            });
        });
    }

    // ===== SCROLL REVEAL — staggered with multiple directions =====
    const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('visible'), Number(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealClasses.forEach(cls => {
        document.querySelectorAll(cls).forEach((el, i) => {
            el.dataset.delay = el.dataset.delay || (i % 6) * 100;
            revealObserver.observe(el);
        });
    });

    // ===== ANIMATED COUNTERS =====
    const counters = document.querySelectorAll('.counter');
    let countersDone = false;
    const animateCounters = () => {
        if (countersDone) return;
        counters.forEach(counter => {
            const target = +counter.dataset.target;
            const duration = 2200;
            const start = performance.now();
            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // elastic ease out
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress) * Math.cos((progress * 10 - 0.75) * (2 * Math.PI / 3));
                counter.textContent = Math.round(target * ease);
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        });
        countersDone = true;
    };
    const statsEl = document.querySelector('.hero__stats');
    if (statsEl) {
        new IntersectionObserver(e => {
            if (e[0].isIntersecting) animateCounters();
        }, { threshold: 0.3 }).observe(statsEl);
    }

    // ===== 3D TILT EFFECT ON CARDS =====
    const tiltCards = document.querySelectorAll('.problem-card, .service-card, .guarantee-card, .goods-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform .1s ease-out';
        });
    });

    // ===== MAGNETIC BUTTONS =====
    const magneticBtns = document.querySelectorAll('.btn--primary, .slider-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform += ` translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ===== TABS =====
    document.querySelectorAll('.tabs__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tabs__btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tabs__panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + tabId).classList.add('active');
        });
    });

    // ===== CASES SLIDER =====
    const track = document.querySelector('.cases-slider__track');
    const prevBtn = document.getElementById('casesPrev');
    const nextBtn = document.getElementById('casesNext');
    if (track && prevBtn && nextBtn) {
        let slideIndex = 0;
        const cards = track.querySelectorAll('.case-card');
        const getVisibleCount = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;
        const updateSlider = () => {
            const visible = getVisibleCount();
            const maxIndex = Math.max(0, cards.length - visible);
            slideIndex = Math.min(slideIndex, maxIndex);
            const card = cards[0];
            const gap = 24;
            const cardWidth = card.offsetWidth + gap;
            track.style.transform = `translateX(-${slideIndex * cardWidth}px)`;
        };
        prevBtn.addEventListener('click', () => { slideIndex = Math.max(0, slideIndex - 1); updateSlider(); });
        nextBtn.addEventListener('click', () => {
            const visible = getVisibleCount();
            slideIndex = Math.min(cards.length - visible, slideIndex + 1);
            updateSlider();
        });
        window.addEventListener('resize', updateSlider);
        // Touch swipe
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextBtn.click(); else prevBtn.click();
            }
        });
        // Auto-play
        let autoPlay = setInterval(() => { nextBtn.click(); }, 5000);
        track.closest('.cases-slider').addEventListener('mouseenter', () => clearInterval(autoPlay));
        track.closest('.cases-slider').addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => { nextBtn.click(); }, 5000);
        });
    }

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq-item__q').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // ===== FORM SUBMISSION =====
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Отправляем...';
            btn.disabled = true;

            // Collect form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name') || form.querySelector('[name="name"], [placeholder*="имя"], [placeholder*="Имя"]')?.value || '',
                contact: formData.get('email') || formData.get('contact') || formData.get('phone') || form.querySelector('[name="email"], [name="contact"], [name="phone"], [type="email"], [type="tel"]')?.value || '',
                message: formData.get('message') || form.querySelector('[name="message"], textarea')?.value || 'Запрос ставки с главной страницы',
            };

            // If no structured data found, collect all inputs
            if (!data.name && !data.contact) {
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach((inp, i) => {
                    if (i === 0 && !data.name) data.name = inp.value;
                    else if (i === 1 && !data.contact) data.contact = inp.value;
                    else if (!data.message || data.message === 'Запрос ставки с главной страницы') data.message = inp.value;
                });
            }

            try {
                await fetch('https://blog.elpcargo.ru/api/contact', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data),
                });
            } catch (err) {
                console.error('Form submit error:', err);
            }

            btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px">Отправлено <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>';
            btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 4000);
        });
    }

    // ===== PARALLAX SCROLL =====
    let scrollY = 0;
    const parallaxItems = document.querySelectorAll('.hero__overlay, .hero::before, .hero::after');
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
        if (scrollY < window.innerHeight * 1.2) {
            const hero = document.querySelector('.hero__content');
            if (hero) hero.style.transform = `translateY(${scrollY * 0.12}px)`;
        }
    }, { passive: true });

    // ===== HERO CANVAS — Premium animated network =====
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let w, h, particles = [], mouse = { x: -1000, y: -1000 };
        const resize = () => {
            w = heroCanvas.width = heroCanvas.parentElement.offsetWidth;
            h = heroCanvas.height = heroCanvas.parentElement.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Mouse interaction
        heroCanvas.parentElement.addEventListener('mousemove', e => {
            const rect = heroCanvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        heroCanvas.parentElement.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

        // Create particles
        const particleCount = Math.min(80, Math.floor(w * h / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.1,
                pulse: Math.random() * Math.PI * 2
            });
        }

        // Routes
        const routes = [
            { from: { x: 0.28, y: 0.35 }, to: { x: 0.55, y: 0.28 }, color: '#E85D04', label: 'EU' },
            { from: { x: 0.38, y: 0.42 }, to: { x: 0.55, y: 0.28 }, color: '#E85D04', label: 'IT' },
            { from: { x: 0.75, y: 0.45 }, to: { x: 0.55, y: 0.28 }, color: '#2E75B6', label: 'CN' },
            { from: { x: 0.12, y: 0.35 }, to: { x: 0.55, y: 0.28 }, color: '#D4A853', label: 'US' },
            { from: { x: 0.58, y: 0.52 }, to: { x: 0.55, y: 0.28 }, color: '#E85D04', label: 'AE' },
        ];

        let time = 0;
        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            time += 0.004;

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(46,117,182,${0.06 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
                // Mouse connection
                const mdx = particles[i].x - mouse.x;
                const mdy = particles[i].y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < 180) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(232,93,4,${0.15 * (1 - mdist / 180)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    // Push particles away from mouse slightly
                    particles[i].vx += mdx / mdist * 0.02;
                    particles[i].vy += mdy / mdist * 0.02;
                }
            }

            // Update & draw particles
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                p.vx *= 0.999; p.vy *= 0.999;
                p.pulse += 0.02;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                const pulseR = p.r + Math.sin(p.pulse) * 0.5;
                // Glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, pulseR * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232,93,4,${p.opacity * 0.08})`;
                ctx.fill();
                // Dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232,93,4,${p.opacity * 0.8})`;
                ctx.fill();
            });

            // Draw routes with animated dashes and glow
            routes.forEach((route, ri) => {
                const fx = route.from.x * w, fy = route.from.y * h;
                const tx = route.to.x * w, ty = route.to.y * h;
                const cpx = (fx + tx) / 2;
                const cpy = Math.min(fy, ty) - 40 - ri * 10;

                // Route line with glow
                ctx.beginPath();
                ctx.moveTo(fx, fy);
                ctx.quadraticCurveTo(cpx, cpy, tx, ty);
                ctx.strokeStyle = route.color + '18';
                ctx.lineWidth = 4;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(fx, fy);
                ctx.quadraticCurveTo(cpx, cpy, tx, ty);
                ctx.strokeStyle = route.color + '40';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([8, 6]);
                ctx.lineDashOffset = -time * 200 + ri * 50;
                ctx.stroke();
                ctx.setLineDash([]);

                // Animated dots along route (multiple)
                for (let d = 0; d < 2; d++) {
                    const t = ((Math.sin(time * 1.8 + ri * 1.2 + d * 3) + 1) / 2);
                    const ax = (1 - t) * (1 - t) * fx + 2 * (1 - t) * t * cpx + t * t * tx;
                    const ay = (1 - t) * (1 - t) * fy + 2 * (1 - t) * t * cpy + t * t * ty;
                    // Glow
                    ctx.beginPath();
                    ctx.arc(ax, ay, 10, 0, Math.PI * 2);
                    ctx.fillStyle = route.color + '15';
                    ctx.fill();
                    // Dot
                    ctx.beginPath();
                    ctx.arc(ax, ay, 3.5, 0, Math.PI * 2);
                    ctx.fillStyle = route.color;
                    ctx.fill();
                }

                // Endpoints with animated pulse
                [{ x: fx, y: fy }, { x: tx, y: ty }].forEach(pt => {
                    const pulseSize = 6 + Math.sin(time * 3 + ri) * 2;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pulseSize + 4, 0, Math.PI * 2);
                    ctx.fillStyle = route.color + '08';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pulseSize, 0, Math.PI * 2);
                    ctx.fillStyle = route.color + '20';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = route.color;
                    ctx.fill();
                });
            });

            // Mouse glow
            if (mouse.x > 0) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
                gradient.addColorStop(0, 'rgba(232,93,4,0.06)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(mouse.x - 80, mouse.y - 80, 160, 160);
            }

            requestAnimationFrame(animate);
        };
        animate();
    }

    // ===== GEO CANVAS =====
    const geoCanvas = document.getElementById('geoCanvas');
    if (geoCanvas) {
        const gctx = geoCanvas.getContext('2d');
        let gw, gh, gtime = 0;
        const gResize = () => {
            gw = geoCanvas.width = geoCanvas.parentElement.offsetWidth;
            gh = geoCanvas.height = geoCanvas.parentElement.offsetHeight;
        };
        gResize();
        window.addEventListener('resize', gResize);

        const cities = [
            { x: 0.15, y: 0.4, label: 'США', color: '#D4A853', size: 5 },
            { x: 0.38, y: 0.28, label: 'Германия', color: '#E85D04', size: 5 },
            { x: 0.35, y: 0.38, label: 'Франция', color: '#E85D04', size: 4 },
            { x: 0.37, y: 0.42, label: 'Италия', color: '#E85D04', size: 4 },
            { x: 0.4, y: 0.32, label: 'Польша', color: '#E85D04', size: 4 },
            { x: 0.42, y: 0.3, label: 'Чехия', color: '#E85D04', size: 3 },
            { x: 0.58, y: 0.52, label: 'ОАЭ', color: '#E85D04', size: 5 },
            { x: 0.78, y: 0.42, label: 'Китай', color: '#2E75B6', size: 6 },
            { x: 0.52, y: 0.26, label: 'Россия', color: '#fff', size: 7 },
        ];
        const russia = cities[8];

        const drawGeo = () => {
            gctx.clearRect(0, 0, gw, gh);
            gtime += 0.003;

            // Grid with glow
            gctx.strokeStyle = 'rgba(255,255,255,0.025)';
            gctx.lineWidth = 1;
            for (let x = 0; x < gw; x += 50) {
                gctx.beginPath(); gctx.moveTo(x, 0); gctx.lineTo(x, gh); gctx.stroke();
            }
            for (let y = 0; y < gh; y += 50) {
                gctx.beginPath(); gctx.moveTo(0, y); gctx.lineTo(gw, y); gctx.stroke();
            }

            // Routes
            cities.slice(0, 8).forEach((city, i) => {
                const fx = city.x * gw, fy = city.y * gh;
                const tx = russia.x * gw, ty = russia.y * gh;
                const cpx = (fx + tx) / 2, cpy = Math.min(fy, ty) - 25 - i * 5;

                // Glow trail
                gctx.beginPath();
                gctx.moveTo(fx, fy);
                gctx.quadraticCurveTo(cpx, cpy, tx, ty);
                gctx.strokeStyle = city.color + '12';
                gctx.lineWidth = 4;
                gctx.stroke();

                gctx.beginPath();
                gctx.moveTo(fx, fy);
                gctx.quadraticCurveTo(cpx, cpy, tx, ty);
                gctx.strokeStyle = city.color + '35';
                gctx.lineWidth = 1.5;
                gctx.setLineDash([6, 5]);
                gctx.lineDashOffset = -gtime * 150 + i * 30;
                gctx.stroke();
                gctx.setLineDash([]);

                // Animated dot
                const t = (Math.sin(gtime * 2 + i * 1.5) + 1) / 2;
                const ax = (1 - t) * (1 - t) * fx + 2 * (1 - t) * t * cpx + t * t * tx;
                const ay = (1 - t) * (1 - t) * fy + 2 * (1 - t) * t * cpy + t * t * ty;
                gctx.beginPath();
                gctx.arc(ax, ay, 3, 0, Math.PI * 2);
                gctx.fillStyle = city.color;
                gctx.fill();
            });

            // Interactivity
            let hoveredCity = null;
            const tooltip = document.getElementById('geoTooltip');

            geoCanvas.addEventListener('mousemove', (e) => {
                const rect = geoCanvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Scale mouse coordinates to canvas resolution
                const scaleX = geoCanvas.width / rect.width;
                const scaleY = geoCanvas.height / rect.height;
                const cx = mouseX * scaleX;
                const cy = mouseY * scaleY;

                let found = null;
                cities.forEach(city => {
                    const px = city.x * gw;
                    const py = city.y * gh;
                    const dist = Math.sqrt((cx - px) ** 2 + (cy - py) ** 2);
                    if (dist < 20) found = city;
                });

                if (found !== hoveredCity) {
                    hoveredCity = found;
                    geoCanvas.style.cursor = found ? 'pointer' : 'default';
                    if (found) {
                        tooltip.innerHTML = `<span class="geo-tooltip__flag">${found.label === 'США' ? '🇺🇸' : found.label === 'Китай' ? '🇨🇳' : found.label === 'ОАЭ' ? '🇦🇪' : found.label === 'Россия' ? '🇷🇺' : '🇪🇺'}</span> <strong>${found.label}</strong><br><span class="geo-tooltip__time">~${found.label === 'Россия' ? 'Склад' : '10-14 дней'}</span>`;
                        tooltip.classList.add('visible');
                    } else {
                        tooltip.classList.remove('visible');
                    }
                }

                if (found) {
                    tooltip.style.left = mouseX + 'px';
                    tooltip.style.top = mouseY + 'px';
                }
            });

            geoCanvas.addEventListener('mouseleave', () => {
                hoveredCity = null;
                tooltip.classList.remove('visible');
            });

            // Draw cities
            cities.forEach((city, i) => {
                const px = city.x * gw, py = city.y * gh;
                const isHovered = hoveredCity === city;
                const pulse = Math.sin(gtime * 3 + i) * 2;

                // Outer glow
                gctx.beginPath();
                gctx.arc(px, py, city.size + 8 + pulse + (isHovered ? 5 : 0), 0, Math.PI * 2);
                gctx.fillStyle = city.color + (isHovered ? '20' : '08');
                gctx.fill();

                // Inner glow
                gctx.beginPath();
                gctx.arc(px, py, city.size + 3 + (isHovered ? 2 : 0), 0, Math.PI * 2);
                gctx.fillStyle = city.color + (isHovered ? '40' : '20');
                gctx.fill();

                // Dot
                gctx.beginPath();
                gctx.arc(px, py, city.size, 0, Math.PI * 2);
                gctx.fillStyle = city.color;
                gctx.fill();

                // Label
                gctx.font = `600 ${city.size > 5 ? 14 : 12}px "Inter", sans-serif`;
                gctx.fillStyle = isHovered ? '#fff' : 'rgba(255,255,255,0.75)';
                gctx.textAlign = 'center';
                gctx.fillText(city.label, px, py - city.size - 10);
            });

            requestAnimationFrame(drawGeo);
        };
        drawGeo();
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 76;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== AUTO-OPEN FIRST FAQ =====
    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) firstFaq.classList.add('open');

    // ===== TYPING EFFECT ON HERO BADGE =====
    const badge = document.querySelector('.hero__badge');
    if (badge) {
        const text = badge.textContent.trim();
        badge.textContent = '';
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            badge.textContent = text.slice(0, ++charIndex);
            if (charIndex >= text.length) clearInterval(typeInterval);
        }, 40);
    }

});

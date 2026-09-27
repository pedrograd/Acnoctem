document.addEventListener('DOMContentLoaded', () => {
    // 0. Privacy-safe landing attribution. Keep only bounded campaign labels and referrer host.
    const cleanAttributionValue = (value) => {
        if (!value) return '(not set)';
        return String(value).trim().slice(0, 100).replace(/[^a-zA-Z0-9._~:/@+\- ]/g, '_');
    };

    let referrerHost = '(direct)';
    if (document.referrer) {
        try {
            referrerHost = new URL(document.referrer).hostname || '(direct)';
        } catch {
            referrerHost = '(invalid)';
        }
    }

    const params = new URLSearchParams(window.location.search);
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'funnel_landing', {
            utm_source: cleanAttributionValue(params.get('utm_source')),
            utm_medium: cleanAttributionValue(params.get('utm_medium')),
            utm_campaign: cleanAttributionValue(params.get('utm_campaign')),
            referrer_host: cleanAttributionValue(referrerHost),
            landing_path: window.location.pathname.slice(0, 120),
            transport_type: 'beacon'
        });
    }

    // 1. Outbound funnel clicks. Never blocks navigation if analytics is unavailable.
    document.querySelectorAll('[data-funnel-event]').forEach(link => {
        link.addEventListener('click', () => {
            if (typeof window.gtag !== 'function') return;
            window.gtag('event', 'funnel_outbound_click', {
                destination: link.dataset.funnelEvent,
                link_url: link.href,
                transport_type: 'beacon'
            });
        });
    });

    // 2. Smooth Fade-in sequence
    const container = document.querySelector('.fade-in-section');
    if (container) {
        // Fast enough to not annoy, slow enough to feel expensive
        setTimeout(() => {
            container.classList.add('visible');
        }, 50);
    }

    // 3. Premium 3D interaction for secondary links
    const cards = document.querySelectorAll('.btn-secondary');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Extremely subtle rotation (luxury feel)
            const rotateX = ((y - centerY) / centerY) * -2.5;
            const rotateY = ((x - centerX) / centerX) * 2.5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // 4. Luxurious Ripple Effect for Primary CTA
    const primaryCta = document.querySelector('.btn-primary');
    
    if (primaryCta) {
        primaryCta.addEventListener('mousedown', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const glow = this.querySelector('.btn-primary-glow');
            if (glow) {
                // Reset state
                glow.style.animation = 'none';
                glow.style.top = `${y}px`;
                glow.style.left = `${x}px`;
                
                // Force reflow
                void glow.offsetWidth;
                
                // Trigger animation
                this.classList.add('ripple');
                glow.style.animation = 'luxuryRipple 0.8s ease-out forwards';
                
                setTimeout(() => {
                    this.classList.remove('ripple');
                }, 800);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const CONSENT_KEY = 'acnoctem_consent_v1';
    const CANONICAL_FUNNEL = Object.freeze({
        visit: 'funnel_visit',
        lead: 'funnel_lead'
    });
    const consentBanner = document.getElementById('analytics-consent');
    const consentAccept = document.getElementById('consent-accept');
    const consentReject = document.getElementById('consent-reject');
    let visitSent = false;

    const analyticsAllowed = () =>
        localStorage.getItem(CONSENT_KEY) === 'accepted' && typeof window.gtag === 'function';

    const emitAnalytics = (eventName, parameters) => {
        if (!analyticsAllowed()) return;
        window.gtag('event', eventName, {
            ...parameters,
            transport_type: 'beacon'
        });
    };

    // Privacy-safe landing attribution. Keep only bounded campaign labels and referrer host.
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
    const landingAttribution = {
        stage: 'visit',
        evidence: 'web_observed',
        utm_source: cleanAttributionValue(params.get('utm_source')),
        utm_medium: cleanAttributionValue(params.get('utm_medium')),
        utm_campaign: cleanAttributionValue(params.get('utm_campaign')),
        referrer_host: cleanAttributionValue(referrerHost),
        landing_path: window.location.pathname.slice(0, 120)
    };

    const emitVisit = () => {
        if (visitSent || !analyticsAllowed()) return;
        visitSent = true;
        emitAnalytics(CANONICAL_FUNNEL.visit, landingAttribution);
        // Backward-compatible event while historical GA4 reports migrate to funnel_visit.
        emitAnalytics('funnel_landing', landingAttribution);
    };

    const updateConsent = (granted) => {
        if (typeof window.gtag !== 'function') return;
        window.gtag('consent', 'update', {
            analytics_storage: granted ? 'granted' : 'denied'
        });
    };

    const hideConsent = () => {
        if (consentBanner) consentBanner.hidden = true;
    };

    const handleConsent = (granted) => {
        localStorage.setItem(CONSENT_KEY, granted ? 'accepted' : 'rejected');
        updateConsent(granted);
        hideConsent();
        if (granted) emitVisit();
    };

    const storedConsent = localStorage.getItem(CONSENT_KEY);
    if (storedConsent === 'accepted') {
        updateConsent(true);
        hideConsent();
        emitVisit();
    } else if (storedConsent === 'rejected') {
        hideConsent();
    } else if (consentBanner) {
        consentBanner.hidden = false;
    }

    if (consentAccept) consentAccept.addEventListener('click', () => handleConsent(true));
    if (consentReject) consentReject.addEventListener('click', () => handleConsent(false));

    // Outbound funnel clicks. Never blocks navigation if analytics is unavailable.
    document.querySelectorAll('[data-funnel-event]').forEach(link => {
        link.addEventListener('click', () => {
            const destination = link.dataset.funnelEvent;
            emitAnalytics('funnel_outbound_click', {
                destination,
                link_url: link.href,
                evidence: 'web_observed'
            });
            if (destination === 'telegram_primary') {
                emitAnalytics(CANONICAL_FUNNEL.lead, {
                    stage: 'lead',
                    evidence: 'web_observed',
                    signal: 'telegram_primary_click',
                    boundary: 'outbound_intent_only'
                });
            }
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

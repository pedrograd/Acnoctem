document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Fade-in sequence
    const container = document.querySelector('.fade-in-section');
    if (container) {
        // Fast enough to not annoy, slow enough to feel expensive
        setTimeout(() => {
            container.classList.add('visible');
        }, 50);
    }

    // 2. Premium 3D interaction for secondary links
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

    // 3. Luxurious Ripple Effect for Primary CTA
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

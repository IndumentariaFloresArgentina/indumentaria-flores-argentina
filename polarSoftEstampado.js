const menuIcon = document.getElementById('menuIcon');
const menuLinks = document.getElementById('menuLinks');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('open');
    menuLinks.classList.toggle('active');
});



// CARRUSEL

document.addEventListener("DOMContentLoaded", () => {
    class Carousel {
        constructor(carouselSelector, cardSelector) {
            this.carousel = document.querySelector(carouselSelector);
            this.track = this.carousel.querySelector(".carousel-track");
            this.cards = this.track.querySelectorAll(cardSelector);
            this.cardCount = this.cards.length;
            this.currentIndex = 0;
            this.autoSlideInterval = null;
            this.visibleCount = 1;
            this.prevBtn = null;
            this.nextBtn = null;
            this.modal = null;
            this.modalContent = null;
            this.modalCloseBtn = null;
            this.resumeTimeout = null;
            this.init();
        }
        updateCarousel() {
            const cardStyle = getComputedStyle(this.cards[0]);
            const gap = parseFloat(getComputedStyle(this.track).gap) || 0;
            const cardWidth = this.cards[0].getBoundingClientRect().width + gap;
            const offset = this.currentIndex * cardWidth;
            this.track.style.transform = `translateX(-${offset}px)`;
        }

        addSwipeListeners() {
            let startX = 0;
            const threshold = 50;       // Distancia mínima para swipe
            const pauseDuration = 5000; // Tiempo (ms) que pausamos el auto‐slide
            // Asegúrate de tener this.resumeTimeout inicializado en el constructor:
            // this.resumeTimeout = null;

            // Al tocar, detenemos el auto‐slide y programamos su reanudación
            this.carousel.addEventListener('touchstart', e => {
                // Detener auto‐slide inmediato
                this.stopAutoSlide();
                // Limpiar cualquier reanudación pendiente
                clearTimeout(this.resumeTimeout);
                // Programar reanudar auto‐slide pasado pauseDuration
                this.resumeTimeout = setTimeout(() => {
                    this.startAutoSlide();
                }, pauseDuration);
                // Guardar posición inicial del touch
                startX = e.touches[0].clientX;
            }, { passive: true });

            // Al levantar el dedo, calculamos swipe y navegamos
            this.carousel.addEventListener('touchend', e => {
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                if (Math.abs(diff) > threshold) {
                    diff > 0 ? this.nextCard() : this.prevCard();
                }
            }, { passive: true });
        }


        handleResize() {
            this.updateVisibleCount();
            const maxIndex = this.cardCount - this.visibleCount;
            if (this.currentIndex > maxIndex) {
                this.currentIndex = maxIndex;
                this.updateCarousel();
            }


            // tu nextCard, prevCard, updateCarousel, etc.
        }

        nextCard = () => {
            const maxIndex = this.cardCount - this.visibleCount;
            // incrementa y envuelve dentro de [0…maxIndex]
            this.currentIndex = (this.currentIndex + 1) % (maxIndex + 1);
            this.updateCarousel();
        };

        prevCard = () => {
            const maxIndex = this.cardCount - this.visibleCount;
            // decrementa y envuelve dentro de [0…maxIndex]
            this.currentIndex =
                (this.currentIndex - 1 + (maxIndex + 1)) % (maxIndex + 1);
            this.updateCarousel();
        };

        startAutoSlide() {
            this.autoSlideInterval = setInterval(this.nextCard, 3000);
        }
        stopAutoSlide() {
            clearInterval(this.autoSlideInterval);
        }
        createNavButtons() {
            this.prevBtn = document.createElement("button");
            this.prevBtn.textContent = "❮";
            this.prevBtn.className = "carousel-nav prev-btn";
            this.prevBtn.addEventListener("click", this.prevCard);
            this.nextBtn = document.createElement("button");
            this.nextBtn.textContent = "❯";
            this.nextBtn.className = "carousel-nav next-btn";
            this.nextBtn.addEventListener("click", this.nextCard);
            this.carousel.parentNode.insertBefore(this.prevBtn, this.carousel);
            this.carousel.parentNode.appendChild(this.nextBtn);
        }
        updateVisibleCount() {
            const trackStyles = getComputedStyle(this.track);
            const gap = parseFloat(trackStyles.gap) || 0;
            const cardWidth = this.cards[0].getBoundingClientRect().width;
            const step = cardWidth + gap;
            const containerWidth = this.carousel.clientWidth;
            this.visibleCount = Math.floor(containerWidth / step) || 1;
        }

        createModal() {
            // Create modal container
            this.modal = document.createElement("div");
            this.modal.className = "modal";

            // Create modal content
            this.modalContent = document.createElement("div");
            this.modalContent.className = "modal-content";

            // Create close button
            this.modalCloseBtn = document.createElement("span");
            this.modalCloseBtn.className = "close-button";
            this.modalCloseBtn.innerHTML = "&times;";
            this.modalCloseBtn.addEventListener("click", () => {
                this.closeModal();
            });

            // Assemble modal
            this.modalContent.appendChild(this.modalCloseBtn);
            this.modal.appendChild(this.modalContent);
            document.body.appendChild(this.modal);

            // Close modal when clicking outside content
            this.modal.addEventListener("click", (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });

            // Close modal on ESC key
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && this.modal.classList.contains("show-modal")) {
                    this.closeModal();
                }
            });
        }

        openModal(cardContent, cardIndex) {
            // Stop auto slide when modal is open
            this.stopAutoSlide();

            // Update modal content
            const cardTitle = `Card ${String.fromCharCode(65 + cardIndex)}`;
            this.modalContent.innerHTML = `
        <span class="close-button">&times;</span>
        <h2>${cardTitle}</h2>
        <div class="modal-body">
          <p>This is the detailed content for ${cardTitle}.</p>
          <p>You can add any information about this card here.</p>
        </div>
      `;

            // Re-attach event listener to the new close button
            this.modalContent
                .querySelector(".close-button")
                .addEventListener("click", () => {
                    this.closeModal();
                });

            // Show modal
            this.modal.classList.add("show-modal");
        }

        closeModal() {
            this.modal.classList.remove("show-modal");
            // Resume auto slide when modal is closed
            this.startAutoSlide();
        }

        addCardClickListeners() {
            this.cards.forEach((card, index) => {
                card.addEventListener("click", () => {
                    this.openModal(card.textContent, index);
                });
                // Make cards visually clickable
                card.style.cursor = "pointer";
            });
        }

        addHoverListeners() {
            this.carousel.addEventListener("mouseenter", () => this.stopAutoSlide());
            this.carousel.addEventListener("mouseleave", () => {
                // Only restart if modal is not open
                if (!this.modal || !this.modal.classList.contains("show-modal")) {
                    this.startAutoSlide();
                }
            });
        }

        init() {
            this.updateVisibleCount();
            window.addEventListener('resize', () => {
                this.updateVisibleCount();
                const maxIndex = this.cardCount - this.visibleCount;
                if (this.currentIndex > maxIndex) {
                    this.currentIndex = maxIndex;
                    this.updateCarousel();
                }
            });
            this.createNavButtons();
            this.createModal();
            this.addCardClickListeners();
            this.addHoverListeners();
            this.addSwipeListeners();
            this.updateCarousel();
            this.startAutoSlide();
        }
    }


    // Initialize carousel (adjust selectors as needed)
    new Carousel(".carousel", ".card");
});


class ModalManager {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalImage = document.getElementById('modal-image');
        this.modalDescription = document.getElementById('modal-description');
        this.isModalOpen = false;

        this.initEventListeners();
    }

    initEventListeners() {
        // Close modal when clicking outside
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isModalOpen) {
                this.closeModal();
            }
        });
    }

    openModal(imageSrc, description) {
        // Prevent multiple modal openings
        if (this.isModalOpen) return;

        // Add loading class
        this.modal.classList.add('loading');

        // Preload image with full details
        const img = new Image();
        img.onload = () => {
            // Create image details
            const imageDetails = this.createImageDetails(img, imageSrc, description);
            
            // Update modal content
            this.modalImage.src = imageSrc;
            this.modalDescription.innerHTML = imageDetails;
            
            // Show modal
            this.modal.style.display = 'block';
            this.modal.classList.add('show');
            this.modal.classList.remove('hide', 'loading');
            
            // Update modal state
            this.isModalOpen = true;
        };
        
        // Handle image load error
        img.onerror = () => {
            console.error('Image failed to load:', imageSrc);
            this.modalDescription.innerHTML = `
                <p style="color: red;">Unable to load image. Please try again.</p>
            `;
            
            // Show modal with error
            this.modal.style.display = 'block';
            this.modal.classList.add('show');
            this.modal.classList.remove('hide', 'loading');
            this.isModalOpen = true;
        };

        img.src = imageSrc;
    }

    createImageDetails(img, imageSrc, description) {
        // Create detailed image information
        return `
            <div class="image-details">
                <p>${description}</p>
                <div class="image-metadata">
                    <p>Image Dimensions: ${img.width} x ${img.height} pixels</p>
                    <p>File: ${this.extractFileName(imageSrc)}</p>
                </div>
            </div>
        `;
    }

    extractFileName(path) {
        return path.split('/').pop();
    }

    closeModal() {
        if (!this.isModalOpen) return;

        this.modal.classList.remove('show');
        this.modal.classList.add('hide');

        // Reset modal state after animation
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.modal.classList.remove('hide', 'loading');
            this.isModalOpen = false;
            
            // Clear image source to prevent caching issues
            this.modalImage.src = '';
            this.modalDescription.innerHTML = '';
        }, 300);
    }
}

// Initialize modal manager
const modalManager = new ModalManager();

// Modify the global functions to use the modal manager
function openModal(imageSrc, description) {
    modalManager.openModal(imageSrc, description);
}

function closeModal() {
    modalManager.closeModal();
}
const roles = ["Web Developer", "Mobile App Dev", "UI/UX Designer", "Virtual Assistant"];
let roleIndex = 0;
let charIndex = 0;
const typingSpeed = 100;
const erasingSpeed = 50;
const delayBetweenRoles = 2000;

const textElement = document.querySelector(".changing-text");

function type() {
    if (!textElement) return;

    if (charIndex < roles[roleIndex].length) {
        textElement.textContent += roles[roleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(erase, delayBetweenRoles);
    }
}

function erase() {
    if (!textElement) return;

    if (charIndex > 0) {
        textElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
    } else {
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, typingSpeed);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (textElement) {
        type();
    }

    initContactForm();
    initProjectModal();
});

function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const honeypot = formData.get('website')?.toString().trim();
        const name = formData.get('name')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const message = formData.get('message')?.toString().trim();

        // Simple spam checks
        if (honeypot) {
            setStatus('Spam detected. Message not sent.', 'error');
            return;
        }

        if (!name || !email || !message) {
            setStatus('Please fill out all fields.', 'error');
            return;
        }

        setStatus('Sending…', 'pending');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (response.ok) {
                setStatus('Thanks! Your message has been sent.', 'success');
                form.reset();
            } else {
                const data = await response.json().catch(() => null);
                setStatus(data?.error || 'An error occurred. Please try again.', 'error');
            }
        } catch (error) {
            setStatus('Unable to send message. Check your connection and try again.', 'error');
        }
    });

    function setStatus(message, type) {
        if (!status) {
            alert(message);
            return;
        }

        status.textContent = message;
        status.className = `form-status ${type}`;
    }
}

// Resume Upload Logic
const fileInput = document.getElementById('resume-file');
const uploadBtn = document.querySelector('.upload-btn');
const fileLabel = document.querySelector('.file-label');

if (fileInput && fileLabel) {
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileLabel.textContent = this.files[0].name; // Show file name on label
        }
    });
}

if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        if (fileInput && fileInput.files.length > 0) {
            alert("Success! Your resume '" + fileInput.files[0].name + "' has been uploaded (simulated).");
        } else {
            alert("Please select a file first.");
        }
    });
}

// Smooth Scroll for Navigation (only for same-page anchors)
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return; // allow normal navigation for external/page links

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Project Modal Functionality
function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalContent = document.querySelector('.modal-content');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTechnologies = document.getElementById('modal-technologies');
    const modalDate = document.getElementById('modal-date');
    const modalRole = document.getElementById('modal-role');
    const modalLink = document.getElementById('modal-link');
    const closeModal = document.querySelector('.close-modal');

    if (!modal) return;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let modalStartX = 0;
    let modalStartY = 0;

    // Add click event to each project card
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent if clicking on the external link
            if (e.target.closest('a')) return;

            const title = card.dataset.title;
            const description = card.dataset.description;
            const image = card.dataset.image;
            const link = card.dataset.link;
            const technologies = card.dataset.technologies;
            const date = card.dataset.date;
            const role = card.dataset.role;

            modalImage.src = image;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalTechnologies.textContent = technologies;
            modalDate.textContent = date;
            modalRole.textContent = role;
            modalLink.href = link;

            modal.style.display = 'block';
        });
    });

    // Dragging functionality
    modalContent.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = modalContent.getBoundingClientRect();
        modalStartX = rect.left;
        modalStartY = rect.top;
        modalContent.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        const newLeft = modalStartX + deltaX;
        const newTop = modalStartY + deltaY;

        modalContent.style.left = newLeft + 'px';
        modalContent.style.top = newTop + 'px';
        modalContent.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            modalContent.style.cursor = 'move';
        }
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        // Reset position
        modalContent.style.left = '50%';
        modalContent.style.top = '50%';
        modalContent.style.transform = 'translate(-50%, -50%)';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            // Reset position
            modalContent.style.left = '50%';
            modalContent.style.top = '50%';
            modalContent.style.transform = 'translate(-50%, -50%)';
        }
    });
}
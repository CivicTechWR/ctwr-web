document.addEventListener('DOMContentLoaded', function() {
    // Get the project container
    const projectContainer = document.getElementById('project-container');
    
    if (projectContainer) {
        // Create the View All Projects card
        const viewAllCard = document.createElement('div');
        viewAllCard.className = 'col-lg-4 col-md-6 col-12 mb-4';
        viewAllCard.innerHTML = `
            <div class="projects-thumb" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 350px; background: rgba(45, 111, 114, 0.05);">
                <h4 style="margin-bottom: 20px;">Explore More Projects</h4>
                <p style="margin-bottom: 25px;">Discover all of our civic tech initiatives</p>
                <a href="/projects.html" class="btn btn-outline" style="background: transparent; border: 1px solid #2D6F72; color: #2D6F72;">View All Projects</a>
            </div>
        `;
        
        // Append the card to the project container
        projectContainer.appendChild(viewAllCard);
    }
});

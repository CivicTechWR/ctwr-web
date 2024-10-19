async function getRepoVariables(repo) {
  const url = `https://api.github.com/repos/CivicTechWR/${repo}/properties/values`
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    return data

  } catch (error) {
    console.error(error.message);
  }
}

(async () => {

  const githubReposEndpoint = "https://api.github.com/orgs/CivicTechWR/repos"

  try {
    const response = await fetch(githubReposEndpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const repos = await response.json();
    repos.forEach(async repo => {
      const properties = await getRepoVariables(repo.name)
      console.log(properties)
      const publishProp = properties.find(prop => prop.property_name === "publish-on-website")
      const featuredProp = properties.find(prop => prop.property_name === "featured-project")
      const publicNameProp = properties.find(prop => prop.property_name === "public-name")
      const imageProp = properties.find(prop => prop.property_name === "image")
      const publish = publishProp?.value === "true"
      const featured = featuredProp?.value === "true"
      const publicName = publicNameProp?.value
      const imageUrl = imageProp?.value

      if (publish) {
        const container = document.getElementById('project-container');
        const createdDate = new Date(repo.created_at)
        const year = createdDate.getFullYear()
        const markup = `
            <div class="col-lg-4 col-md-6 col-12 mb-4">
                <div class="projects-thumb">
                    <div class="projects-info">
                         
                        
                        <a href="${repo.html_url}" class="github-btn btn" target="_blank">GitHub</a>
                        <h4 class="projects-title">${publicName ? publicName : repo.name}</h4>
                       <small class="projects-tag">Year: ${year}</small>
                       <p class="text-sm">${repo.description}</p>
                    </div>
                    <a href="${repo.homepage}">
                        <img src="${imageUrl}" class="projects-image img-fluid" alt="${repo.name}">
                    </a>
                </div>
            </div>
        `
        container.innerHTML += markup
        
      }
      console.log({publish})
      console.log({featured})
    })

  } catch (error) {
    console.error(error.message);
  }

})();
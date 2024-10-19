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
      const publish = publishProp?.value === "true"
      const featured = featuredProp?.value === "true"

      if (publish) {
        
      }
      console.log({publish})
      console.log({featured})
    })

  } catch (error) {
    console.error(error.message);
  }

})();
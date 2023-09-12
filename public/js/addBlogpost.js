async function newFormHandler(event) {
    event.preventDefault();
  
    const title = document.querySelector('').value;
    const blogpost = document.querySelector('').value;
  
    const response = await fetch(`/api/blogpost`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        blogpost,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
  
  document.querySelector('.new-blogpost').addEventListener('submit', newFormHandler);
  document.querySelector('.add-blogpost').addEventListener('click', document.location.replace('/addBlogpost'))
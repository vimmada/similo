export function uploadPhoto(photo) {
  return fetch('localhost:8000/search/', {
    method: 'POST',
    body: JSON.stringify({
      email: 'vimmada@umich.edu',
      image: photo.base64,
    }),
  })
    .then(res => res.json())
    .then(data => data.items);
}

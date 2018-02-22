// TODO: extract base64 encoding after not using hardcoded image
export function uploadPhoto(photo) {
  return fetch('http://localhost:8000/search/', {
    method: 'POST',
    body: JSON.stringify({
      email: 'vimmada@gmail.com',
      image: photo,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(data => data.items);
}

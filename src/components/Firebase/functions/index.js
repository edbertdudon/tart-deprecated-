export const fetchG = (func, data, idToken) => {
  return fetch(process.env.CLOUD_FUNCTIONS_URL + func, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + idToken,
    }
  })
}

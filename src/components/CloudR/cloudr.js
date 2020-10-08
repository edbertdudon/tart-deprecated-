const arrayBufferToBase64 = (buffer) => {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => binary += String.fromCharCode(b));

  return window.btoa(binary);
};

const fetchR = (data, func) => {
  return fetch(process.env.CLOUD_FUNCTIONS_URL + func, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
    mode: 'cors'
  })
}


class Cloudr {
	constructor() {
	}

	plot = data => fetchR(data, "plot")
	  .then(res => {return res.arrayBuffer()})
	  .then(buffer => {
	    var base64Flag = 'data:image/jpeg;base64,';
	    var imageStr = arrayBufferToBase64(buffer);

			return(base64Flag + imageStr)
	  })
}

export default Cloudr

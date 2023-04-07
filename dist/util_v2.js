function send(src){
    let text = '';
    let add = 'https://torijun.com/magic/';
    var data = new FormData();
    data.append("screenshot", src);

// (B) UPLOAD SCREENSHOT TO SERVER
fetch(add, { method:"post", body:data })
.then(res => res.text())
.then(txt => text=txt);
if (text != '') {
    alert(text);
    reset()

}else{
    alert("Server not responded");
    closeserver('server');
}

  }
  function closeserver(id) {
    document.getElementById(id).remove();
   
   
  }
  function saveAs(uri, filename) {
    const link = document.createElement('a');
    if (typeof link.download === 'string') {
      // Set the download attribute to the filename
      link.href = uri;
      link.download = filename;
  
      // Firefox requires the link to be in the body
      document.body.appendChild(link);
  
      // Simulate click
      link.click();
  
      // Remove the link when done
      body = document.body;
      body.removeChild(link);
      reset();
    } else {
      // If the download attribute is not supported, open the image in a new tab
      window.open(uri);
    }
  }
  function getserver(src){
    let overlay = document.createElement("div");
    overlay.id="overlay"
    overlay.classList.add("overlay","pop_container","server_container");
    overlay.id="server";
    let inner = `
    <div>
    <input type="text" id="server_add" placeholder="server address"></input>
    <button onclick='send("${src}")'>Send</button>
    <button onclick="closeserver('server')">Cancel</button>
    </div>
    `;
    overlay.innerHTML=inner;
    document.body.appendChild(overlay);

  }
  function closepop(id){
    close();
  }
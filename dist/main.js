var head = document.getElementsByTagName('head')[0];
var b_head = document.createComment("head");
b_head.innerHTML =  document.getElementsByTagName('head')[0].innerHTML;
var b_body = document.createElement("body");
b_body.innerHTML = document.body.innerHTML;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://cdn.jsdelivr.net/gh/zayarmoekaung/js_screen_shot/dist/html2canvas.min.js";
    var script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = "https://cdn.jsdelivr.net/gh/zayarmoekaung/js_screen_shot/dist/FileSaver.js";
   
    var st = document.createElement("link");
    st.rel = "stylesheet";
    st.type = 'text/css';
    st.href=  "https://cdn.jsdelivr.net/gh/zayarmoekaung/js_screen_shot/dist/screenshot.css";
    st.media = 'all';

    script.onreadystatechange = takeScreenshot;
    script.onload = takeScreenshot;

    // Fire the loading
    head.appendChild(script);
    head.appendChild(script2);
    head.appendChild(st);

   
    let startX, startY, endX, endY;
    var canvas = document.createElement('canvas');
    var canvas2 = document.createElement('canvas');
    
    function takeScreenshot() {
      
        // Get the whole body element
        const body = document.body;
    
        // Use html2canvas to take a screenshot of the body element
        html2canvas(body).then(canvas => {
          // Convert the canvas to a data URL and create an image element
          const dataUrl = canvas.toDataURL();
          crop(dataUrl);
        });
      
      
      }
      function crop(src) {
        const body = document.body;
        const img = new Image();
        img.onload = function() {
          // Create a canvas element and set its dimensions
          canvas.width = img.width;
          canvas.height = img.height;
          canvas2.width = img.width;
          canvas2.height = img.height;
      
          // Get the canvas context and draw the image onto the canvas
          const ctx = canvas.getContext('2d');
          const ctx2 = canvas2.getContext('2d');
          ctx2.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
          ctx2.stroke();
          ctx.drawImage(img, 0, 0, img.width, img.height);
          
          canvas.addEventListener('mousedown', handleMouseDown);
          window.addEventListener('mouseup', handleMouseUp);
          var box = document.createElement("div");
          var shadow = document.createElement("div");
          shadow.classList.add("overlay");
          box.classList.add("main_cav");
          box.appendChild(canvas);
          shadow.appendChild(canvas2);
          body.appendChild(box);
          body.appendChild(shadow);
        }
        img.src = src;
      }
      function drawSelectionRect(x, y, width, height) {
        const ctx = canvas2.getContext('2d');

        // Save the current canvas state
        ctx.save();
      
        // Draw the selected area as a semi-transparent black rectangle
        ctx.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas2.width, canvas2.height);
        ctx.clearRect(x, y, width, height);
        
        // Draw a border around the selected area
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
      
        // Restore the canvas state
        ctx.restore();
      }
      
      function handleMouseDown(e) {
        // Store the starting coordinates of the selection rectangle
        startX = e.clientX + window.pageXOffset - canvas.offsetLeft;
        startY = e.clientY + window.pageYOffset - canvas.offsetTop;
    
        // Add event listeners to track the mouse movements
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousemove', handleMouseMove);
    }
    
    function handleMouseMove(e) {
        // Update the ending coordinates of the selection rectangle
        endX = e.clientX + window.pageXOffset - canvas.offsetLeft;
        endY = e.clientY + window.pageYOffset - canvas.offsetTop;
        drawSelectionRect(startX, startY, endX, endY);
    }
      
      function handleMouseUp() {
        // Remove the event listeners for mouse movements
        canvas.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousemove', handleMouseMove);
      
        // Get the dimensions and position of the selection rectangle
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
      
        // Create a new canvas element with the dimensions of the selection rectangle
        const selectionCanvas = document.createElement('canvas');
        selectionCanvas.width = width;
        selectionCanvas.height = height;
      
        // Get the canvas context and draw the selected area onto the new canvas
        const selectionContext = selectionCanvas.getContext('2d');
        selectionContext.drawImage(canvas, x, y, width, height, 0, 0, width, height);
      
        // Convert the canvas to a data URL and create an image element
        const dataUrl = selectionCanvas.toDataURL();
        const image = new Image();
        image.onload = function() {
          // Save the image as a file using FileSaver.js
          //saveAs(dataUrl, 'cropped_image.png');
          popup(dataUrl);
        };
        image.src = dataUrl;
      }
      function popup(src){
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousemove', handleMouseMove);
        const ctx2 = canvas2.getContext('2d');
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        ctx2.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
        ctx2.stroke();
        let overlay = document.createElement("div");
        overlay.id="overlay"
        overlay.classList.add("overlay","pop_container");
        let popup = `
             <div>
             <img src="${src}" />
             <div>
             <button onclick='saveAs("${src}","screen_shot.png")'>Download</button>
             <button onclick='getserver("${src}")'>Send to server</button>
             <button onclick="closepop('overlay')">Cancel</button>
             
             </div>
             </div>
        `;
        overlay.innerHTML= popup;
        document.body.appendChild(overlay);
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
      function send(src){
        let text = '';
        let inp = document.getElementById('server_add');
        let add = inp.value;
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
      function closepop(id) {
        document.getElementById(id).remove();
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
       
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
      function reset() {
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousemove', handleMouseMove);
        body = document.body;
          body.parentNode.replaceChild(b_body, body);
          
          head = document.getElementsByTagName('head')[0] ;
          head.innerHTML = b_head.innerHTML;
          console.log("end", b_body);
          var script = document.getElementById('screenshot');

// Remove the script element
script.parentNode.removeChild(script)
      }
      
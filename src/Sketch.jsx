import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import jsPDF from "jspdf";
import Navbar from "./Navbar";
import "./sketch.css"; 


export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [format, setFormat] = useState("png");
  const [color, setColor] = useState("black");
  

  const handleClear = () => {
    canvasRef.current.clearCanvas();
  };

  const handleSave = async () => {
    try {
      const mimeFormat = format === "jpeg" ? "jpeg" : "png";
      const dataUrl = await canvasRef.current.exportImage(mimeFormat);

      if (format === "png" || format === "jpeg") {
      
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `drawing.${format}`;
        link.click();
      } else if (format === "pdf") {
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, mimeFormat.toUpperCase(), 0, 0, pdfWidth, pdfHeight);
        pdf.save("drawing.pdf");
      } else if (format === "doc") {
        const html = `
          <html>
            <body>
              <h2>Sketch Drawing</h2>
              <img src="${dataUrl}" alt="drawing" />
            </body>
          </html>
        `;
        const blob = new Blob(["\ufeff", html], {
          type: "application/msword",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "drawing.doc";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const handleRed = () => {
    setColor("red");
  }
  const handleBlue = () => {
    setColor("blue");
  }
    const handleGreen = () => {
    setColor("green");
  }
    const handleYellow = () => {
    setColor("yellow");
  }
    const handleBlack = () => {
    setColor("black");
  }
    const handleOrange = () => {
    setColor("orange");
  }
  

  return (
    <div className="sketch-container">
      <Navbar />
      <div className="sketch-page" style={{ textAlign: "center" }}>
        <ReactSketchCanvas
          ref={canvasRef}
          style={{
            margin: "auto",
            marginTop: "20px",
        boxShadow: "0 0 10px 4px rgba(0, 0, 0, 0.2)" ,
                      borderRadius: "4px",
            width: "90%",
            height: "80vh",
            cursor: "crosshair",
          }}
          strokeWidth={4}
          strokeColor={color}
          canvasColor="white"
         
        />

     
        

        <div className="color-picker">
          <label htmlFor="color">Choose a color</label>
          <div className="color-btn">
            <button onClick={handleRed} className="clr-red"></button>
            <button onClick={handleBlue} className="clr-blue"></button>
            <button onClick={handleGreen} className="clr-green"></button>
            <button onClick={handleYellow} className="clr-yellow"></button>
            <button onClick={handleBlack} className="clr-black"></button>
            <button onClick={handleOrange} className="clr-orange"></button>
            <div  className="btn-container" 
        style={{ marginTop: 10 }}>

         
          <button onClick={handleClear}
          style={{backgroundColor:"red",color:"white",fontWeight:"bold"}} >
            Clear
          </button>
          <label htmlFor="save">Save As:</label>
           <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          
          >
          
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="pdf">PDF</option>
            <option value="doc">DOC</option>
          </select>
          <button
          style={{backgroundColor:"green",color:"white",fontWeight:"bold"}}
          onClick={handleSave}>Save</button>
        </div>
          </div>

        </div>
        
        </div>
        
      
    </div>
  );
  
}







// import React, { useRef, useState } from "react";
// import { ReactSketchCanvas } from "react-sketch-canvas";
// import jsPDF from "jspdf";
// import Navbar from "./Navbar";

// export default function DrawingCanvas() {
//   const canvasRef = useRef(null);
//   const [format, setFormat] = useState("png");
  

//   const handleClear = () => {
//     canvasRef.current.clearCanvas();
//   };

//   const handleSave = async () => {
//     try {
//       const mimeFormat = format === "jpeg" ? "jpeg" : "png";
//       const dataUrl = await canvasRef.current.exportImage(mimeFormat);

//       if (format === "png" || format === "jpeg") {
//         // Download image directly
//         const link = document.createElement("a");
//         link.href = dataUrl;
//         link.download = `drawing.${format}`;
//         link.click();
//       } else if (format === "pdf") {
//         const pdf = new jsPDF();
//         const imgProps = pdf.getImageProperties(dataUrl);
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//         pdf.addImage(dataUrl, mimeFormat.toUpperCase(), 0, 0, pdfWidth, pdfHeight);
//         pdf.save("drawing.pdf");
//       } else if (format === "doc") {
//         const html = `
//           <html>
//             <body>
//               <h2>Sketch Drawing</h2>
//               <img src="${dataUrl}" alt="drawing" />
//             </body>
//           </html>
//         `;
//         const blob = new Blob(["\ufeff", html], {
//           type: "application/msword",
//         });
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(blob);
//         link.download = "drawing.doc";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       }
//     } catch (err) {
//       console.error("Export failed", err);
//     }
//   };

//   return (
//     <div className="sketch-container">
//       <Navbar />
//       <div className="sketch-page" style={{ textAlign: "center" }}>
//         <ReactSketchCanvas
//           ref={canvasRef}
//           style={{
//             margin: "auto",
//             marginTop: "20px",
//         boxShadow: "0 0 10px 4px rgba(0, 0, 0, 0.2)" ,
//                       // borderRadius: "4px",
//             width: "90%",
//             height: "100vh",
//           }}
//           strokeWidth={4}
//           strokeColor="black"
//           canvasColor="white"
//           withTimestamp={true}
//         />
//         <div  className="btn-container" 
//         style={{ marginTop: 10 }}>
         
//           <button onClick={handleClear} >
//             Clear
//           </button>
//           <button onClick={handleSave}>Save Drawing As:</button>
//            <select
//             value={format}
//             onChange={(e) => setFormat(e.target.value)}
          
//           >
//             <option value="png">PNG</option>
//             <option value="jpeg">JPEG</option>
//             <option value="pdf">PDF</option>
//             <option value="doc">DOC</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }

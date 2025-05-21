import { useState, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import "./App.css";
import { FaCropSimple } from "react-icons/fa6";
import { ImBrightnessContrast } from "react-icons/im";
import { BsFillPencilFill } from "react-icons/bs";
import { MdFileUpload } from "react-icons/md";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
function App() {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropApplied, setIsCropApplied] = useState(false);
  const [showCropTool, setShowCropTool] = useState(false);
  const [showBrightnessSlider, setShowBrightnessSlider] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showSketchTool, setShowSketchTool] = useState(false);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
 const navigate = useNavigate();
  const goToSketch = () => {
    navigate("/sketch");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      setImage(URL.createObjectURL(file));
      setCroppedImage(null);
      setIsCropApplied(false);
      setShowCropTool(false);
      setBrightness(100);
    } else {
      alert("Please select a PNG, JPG, or JPEG image.");
    }
  };

  const onImageLoaded = (img) => {
    imageRef.current = img;
  };

  const onCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleApplyCrop = () => {
    if (
      imageRef.current &&
      completedCrop &&
      completedCrop.width &&
      completedCrop.height
    ) {
      const canvas = document.createElement("canvas");
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        imageRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      const base64Image = canvas.toDataURL("image/png");
      setCroppedImage(base64Image);
      setIsCropApplied(true);
      setShowCropTool(false);
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    if (!showSketchTool) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !showSketchTool) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const endDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  useEffect(() => {
    if (canvasRef.current && imageRef.current && showSketchTool) {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
      canvas.style.position = "absolute";
      canvas.style.left = "0px";
      canvas.style.top = "0px";
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctxRef.current = ctx;
    }
  }, [showSketchTool, image]);

  const getEditedImageWithBrightness = (callback, format = "image/png") => {
    const imgSrc = croppedImage || image;
    if (!imgSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      ctx.filter = `brightness(${brightness}%);`
      ctx.drawImage(img, 0, 0);

      if (canvasRef.current && showSketchTool) {
        ctx.drawImage(canvasRef.current, 0, 0);
      }

      if (format === "blob") {
        canvas.toBlob((blob) => callback(blob), "image/jpeg");
      } else {
        const dataUrl = canvas.toDataURL(format);
        callback(dataUrl);
      }
    };
  };

  const downloadImage = () => {
    getEditedImageWithBrightness((dataUrl) => {
      saveAs(dataUrl, "image.png");
    }, "image/png");
  };

  const downloadPDF = () => {
    getEditedImageWithBrightness((dataUrl) => {
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, "PNG", 10, 10, 100, 100);
      pdf.save("image.pdf");
    }, "image/png");
  };

  const downloadWord = () => {
    getEditedImageWithBrightness((dataUrl) => {
      const htmlContent = <html><body><img src="${dataUrl}" /></body></html>;
      const blob = new Blob([htmlContent], {
        type: "application/msword",
      });
      saveAs(blob, "image.doc");
    }, "image/png");
  };

  const downloadJpeg = () => {
    getEditedImageWithBrightness((blob) => {
      if (blob) saveAs(blob, "image.jpeg");
    }, "blob");
  };

  return (
    <div className="whole-screen">
      <Navbar />
      
      
      <div className="upload-screen">
   
    <div style={{ display: "flex" }}>
   
   
    
      <div className="index">
       
        {!image && (
          <>
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              id="file-upload"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="file-upload" className="upload-btn" style={{ textAlign: "center" }}>
              Upload Image
            </label>

            <button onClick={goToSketch } className="upload-btn"  style={{ textAlign: "center" ,fontWeight:"bold"}}>Sketch</button>
          </>
        )}

        {image && !isCropApplied && showCropTool && (
          <>
            <ReactCrop
              crop={crop}
              onChange={setCrop}
              onComplete={onCropComplete}
              aspect={crop.aspect}
            >
              <img
                src={image}
                ref={imageRef}
                alt="To Crop"
                onLoad={(e) => onImageLoaded(e.currentTarget)}
                style={{ maxWidth: "100%", display: "flex", margin: "auto" ,height:"400px",width:"500px"}}
              />
            </ReactCrop>

            {completedCrop?.width && completedCrop?.height && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <button className="download-btn" onClick={handleApplyCrop}>
                  Apply Crop
                </button>
              </div>
            )}
          </>
        )}

        {image && (!showCropTool || isCropApplied) && (
          <div >
            <h3>Preview</h3>
            <img
              src={croppedImage || image}
              alt="Edited"
              ref={imageRef}
              className="preview-img"
             style={{ filter: `brightness(${brightness}%)`, display: "block" }}

              onLoad={() => {
                if (canvasRef.current && imageRef.current) {
                  canvasRef.current.width = imageRef.current.clientWidth;
                  canvasRef.current.height = imageRef.current.clientHeight;
                }
              }}
            />
            {showSketchTool && (
              <canvas 
              className="sketch-canvas"
                ref={canvasRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  cursor: "crosshair",
                  zIndex: 10,
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
              />
            )}
          </div>
        )}
      </div>


      {image && (
        <div className="right-panel" style={{ height: "100vh" }}>
        
         

          <div className="tools" style={{ marginBottom: "15px" }}>
            <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            id="right-upload"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label
            htmlFor="right-upload"
            className="upload-btn"
            style={{  display: "block", textAlign: "center" }}
          >
         <MdFileUpload />
          </label>
            <button
              className="download-btn"
              onClick={() => {
                setShowCropTool(true);
                setIsCropApplied(false);
              }}
            >
              <FaCropSimple /> 
            </button>

            <button
              className="download-btn"
              onClick={() => setShowBrightnessSlider(!showBrightnessSlider)}
            >
              <ImBrightnessContrast />
            </button>

            {showBrightnessSlider && (
              <div style={{ marginBottom: "20px" }} className="brightness-tool">
                <label htmlFor="brightness-range" style={{ fontWeight: "bold" ,paddingLeft:"10px"}}>
                  Slide me:
                </label>
                <input
                  style={{ paddingLeft: "10px", width: "80%" }}
                  type="range"
                  className="form-range"
                  id="brightness-range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(e.target.value)}
                />
              </div>
            )}

            <button className="download-btn" onClick={() => setShowSketchTool(!showSketchTool)}>
              <BsFillPencilFill />
            </button>
           
          </div>

          <div>
            <label style={{ fontWeight: "bold" ,paddingLeft:"10px" }}>Save As:</label>
            <div  className="save-pic" >
              <select id="format-select" className="download-btn" style={{ padding: "8px", flex: 1,backgroundColor:"#f9f9f9" }}>
                <option value="jpeg">Jpeg</option>
                <option value="image">PNG</option>
                <option value="pdf">PDF</option>
                <option value="word">Word</option>
              </select> 
              <button
                className="download-btn"
                onClick={() => {
                  const format = document.getElementById("format-select").value;
                  if (format === "image") downloadImage();
                  else if (format === "pdf") downloadPDF();
                  else if (format === "jpeg") downloadJpeg();
                  else if (format === "word") downloadWord();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
}

export default App;

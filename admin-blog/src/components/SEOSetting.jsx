import React, { useState, useRef } from "react";

function SEOSetting() {
  const [imageSrc, setImageSrc] = useState(null);
  
  // const blob = new Blob([imageData], { type: "image/jpeg" });
  //const reader = new FileReader();
  // reader.readAsDataURL(blob);
  // reader.onloadend = function () {
  //   console.log("图片文件加载完成,把img标签的src设置为reader.result即可");

  //   setImageSrc(reader.result)
  // };

  const handleFileInput = (e) => {
    console.log("input file event: ", e);
    console.log("input file: ", e.target.files[0]);
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    let x;
    e.target.files[0].arrayBuffer().then((buff) => {
      x = new Uint8Array(buff); // x is your uInt8Array
      console.log("uint8Array direct :", x);

      //const imgBlob = new Blob([x.buffer], { type: "image/jpeg" });
      //setImageSrc(URL.createObjectURL(imgBlob));
      let utf8decoder = new TextDecoder();
      const imgDText = utf8decoder.decode(x);
      console.log("image string direct :", imgDText);
      const encoded = Uint8Array.from(
        [...imgDText].map((ch) => {
          return ch.charCodeAt()})
      );
      console.log("uint8array charCodeAt direct: ", encoded);
      const enc = new TextEncoder('utf-16');
      console.log("uint8array from string direct :", enc.encode(imageDataText));
      const blob = new Blob([encoded.buffer], { type: "image/jpeg" });
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        setImageSrc(reader.result);
      };

      // perform all required operations with x here.
    });
    let imageDataText;
    reader.onloadend = () => {
      console.log("图片 text: ", reader.result);
      imageDataText = reader.result;

      //imageDataText = e.target.files[0];
      const enc = new TextEncoder();
      console.log("uint8array :", enc.encode(imageDataText));
      const imgBuffer = enc.encode(imageDataText).buffer;
      const imgFile = new File([imgBuffer], "image.jpg", {
        type: "image/jpeg",
      });
      console.log("image file: ", imgFile);
      const blob = new Blob([imgBuffer], { type: "image/jpeg" });
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        console.log(
          "图片文件加载完成,把img标签的src设置为reader.result即可",
          reader.result
        );
        //setImageSrc(reader.result);
      };
    };
  };

  const handleFileChange=(e)=>{
    console.log("input file event: ", e);
    console.log("input file: ", e.target.files[0]);
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log("submit event: ",e)
  }

  const handleFormSubmit=(e)=>{
    //e.preventDefault();
    console.log("form submit event: ",e);
  }


  return (
    <div>
    
      <input type="file" name="avatar" onChange={handleFileInput}></input>

      <div>
        <img src={imageSrc} alt="" />
      </div>

      <form method="post" action="http://localhost:5000/api/upload" 
      target="_blank"
      onSubmit={handleFormSubmit}
      encType="multipart/form-data">
        <div>
          <label htmlFor="file">Choose file to upload</label>
          <input type="file" id="file" name="file" onChange={handleFileChange} />
        </div>
        <div>
          <button type="submit" onSubmit={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default SEOSetting;

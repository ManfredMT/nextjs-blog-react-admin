import React, { useState, useRef, useMemo } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MarkDownEditor from "./MarkDownEditor";



function SEOSetting() {

  const [blogContent, setBlogContent] = useState('');
  
  const onChangeContent = (value) => {
    setBlogContent(value);
  };
 

  return (
    <div>
     <CopyToClipboard text="Hello!">
  <button>Copy to clipboard</button>
</CopyToClipboard>
<MarkDownEditor 
        
        value={blogContent} 
        //value={autosavedValue}
        onChange={onChangeContent}
         />
    </div>
  );
}

export default SEOSetting;

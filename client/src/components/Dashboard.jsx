import React, { useEffect, useState } from "react";
import { getClientDocuments } from "./helpers/helper";

export default function Dashboard() {
  let [files, setFiles] = useState({
    userId: "",
    documents: [],
    info: "",
  });

  let getItems = async () => {
    let cid = "677a134eba9871491eb0f411";
    const { data, status } = await getClientDocuments(cid);
    if (status === 201) {
      setFiles({
        userId: data.docs[0]?.userId || null,
        documents: data.docs[0]?.document || [],
        info: data.docs[0]?.info || [],
      });
    }
  };

  useEffect(() => {
    getItems();
  }, []);
  const handlePrint = () => {
    console.log("Print button clicked");
    window.print();
  };

  const isImage = (filename) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const ext = filename.split(".").pop().toLowerCase();
    return imageExtensions.includes(ext);
  };

  return (
    <div>
      <div className="w-[8in] mx-auto p-5 border mt-5">
        <ul>
          {files.documents.map((doc, i) => (
            <li className="w-full mb-4" key={i}>
              <h3>{doc.documentType}</h3>
              {isImage(doc.filename) ? (
                <img
                  src={`http://localhost:3500/${doc.filename}`}
                  className="w-full"
                  alt={doc.documentType}
                />
              ) : (
                <iframe
                  src={`http://localhost:3500/${doc.filename}`}
                  frameBorder="0"
                  width="100%"
                  height="1000px"
                  title={doc.documentType}
                ></iframe>
              )}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handlePrint}>Print</button>
    </div>
  );
}

import React, { useState } from "react";
import "./styles.css";

function App() {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const data = new FormData();
    data.append("wordFile", file);

    setInfo("Processing...");

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (json.error) {
        setInfo(`❌ Error: ${json.error}`);
      } else {
        setInfo(`✅ File converted successfully.\nPreparing download...`);

        // Extract file name from the returned path
        const fileName = json.pdf_path.split(/[\\/]/).pop();
        const downloadUrl = `http://localhost:5000/output/${fileName}`;

        // Download the file
        const downloadRes = await fetch(downloadUrl);
        const blob = await downloadRes.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setInfo(`✅ Downloaded PDF: ${fileName}`);
      }
    } catch (err) {
      setInfo(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <h2>AI EMPOWERED ACCESSIBLE PDF GENERATOR</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".docx"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" disabled={!file}>Upload & Convert</button>
      </form>
      <pre>{info}</pre>
    </div>
  );
}

export default App;

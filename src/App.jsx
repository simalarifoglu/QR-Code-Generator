import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [qrValue, setQrValue] = useState("");
  const qrRef = useRef();

  const isEmpty = qrValue.trim().length === 0;

  const generateQR = () => {
    const cleaned = text.trim();
    if (!cleaned) return;
    setQrValue(cleaned);
  };

  const downloadPNG = () => {
    if (isEmpty) return;

    htmlToImage.toPng(qrRef.current).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = dataUrl;
      link.click();
    });
  };

  const downloadSVG = () => {
    if (isEmpty) return;

    const svg = document.querySelector("svg");
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.svg";
    link.click();
  };

  return (
    <div className="container">
      <div className="glass fade-in">
        <h1>QR Studio</h1>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://your-link-here.com"
        />

        <span className="hint">
          Paste text or URL to generate QR code
        </span>

        <button
          className="generate-btn"
          onClick={generateQR}
          disabled={!text.trim()}
        >
          Generate QR
        </button>

        <div className="right">

          <div className="qr-frame">
            {qrValue ? (
              <div className="qr-card" ref={qrRef}>
                <QRCode value={qrValue} size={180} />
              </div>
            ) : (
              <div className="empty">
                <div className="empty-content">
                  <p>QR code will appear here</p>
                  <span>Enter a link and click Generate</span>
                </div>
              </div>
            )}
          </div>

          <div className="download-area">
            <button
              className="download-btn png"
              onClick={downloadPNG}
              disabled={isEmpty}
            >
              Download PNG
            </button>

            <button
              className="download-btn svg"
              onClick={downloadSVG}
              disabled={isEmpty}
            >
              Download SVG
            </button>
          </div>

          <div className="qr-info">
            {qrValue ? (
              <p className="preview-text">{qrValue}</p>
            ) : (
              <p className="empty-state-text">
                Enter a link and click Generate
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
import QRCode from "react-qr-code";

export default function TestQR() {
  return (
    <div style={{ padding: 20 }}>
      <h2>QR 테스트</h2>
      <QRCode value="https://example.com/scan?token=123456" />
    </div>
  );
}
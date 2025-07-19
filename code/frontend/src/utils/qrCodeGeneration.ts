import QRCode from "qrcode";

export const generateAndDownloadQRCode = async (
  text: string,
  imageName: string
) => {
  try {
    const dataUrl = await QRCode.toDataURL(text);

    // Create an invisible <a> tag
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${imageName}.png`;

    // Append to body, click, then remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("Failed to generate QR code:", err);
  }
};

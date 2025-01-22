import { toast } from "sonner";

// Convert Base64 string to ArrayBuffer
const base64ToArrayBuffer = (base64: string) => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Convert string to ArrayBuffer
const str2ab = (str: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

// Convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const byteArray = new Uint8Array(buffer);
  let byteString = "";
  for (let i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  return window.btoa(byteString);
};

export const getPublicKey = async (): Promise<CryptoKey> => {
  const publicKeyPEM = import.meta.env.VITE_PUBLIC_KEY;

  console.log("publicKeyPEM", publicKeyPEM);

  if (!publicKeyPEM) {
    throw new Error("Public key not found in environment variables");
  }

  try {
    // Clean up the key - remove quotes and normalize newlines
    const cleanedKey = publicKeyPEM
      .replace(/^["']|["']$/g, "") // Remove surrounding quotes
      .replace(/\\n/g, "\n") // Convert \n string to actual newlines
      .trim(); // Remove any extra whitespace

    // Remove header, footer, and newlines from PEM
    const pemContents = cleanedKey
      .replace("-----BEGIN PUBLIC KEY-----", "")
      .replace("-----END PUBLIC KEY-----", "")
      .replace(/[\r\n\t ]/g, "");

    const binaryDer = base64ToArrayBuffer(pemContents);

    return await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt"]
    );
  } catch (error) {
    console.error("Error importing public key:", error);
    toast.error("Failed to import encryption key");
    throw error;
  }
};

export const encryptData = async (data: string): Promise<string> => {
  const publicKeyPem = import.meta.env.VITE_PUBLIC_KEY;

  const api = import.meta.env.VITE_API_KEY;

  if (!publicKeyPem) {
    toast.error("Public key not found in environment variables");
    throw new Error("Public key not found in environment variables");
  }

  // Clean up the key before passing it
  const cleanKey = publicKeyPem
    .replace(/^["']|["']$/g, "") // Remove surrounding quotes
    .replace(/\\n/g, "\n") // Convert \n string to actual newlines
    .trim();

  try {
    return encryptWithPublicKey(data, cleanKey);
  } catch (error) {
    console.error("Encryption error:", error);
    toast.error("Failed to encrypt data");
    throw error;
  }
};

export async function encryptWithPublicKey(
  data: string,
  publicKeyPem: string
): Promise<string> {
  try {
    // Convert PEM to ArrayBuffer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";

    // Clean up the key first
    let formattedPublicKey = publicKeyPem
      .replace(/^["']|["']$/g, "") // Remove surrounding quotes
      .replace(/\\n/g, "\n") // Convert \n string to actual newlines
      .trim();

    // Ensure public key has proper PEM format
    if (!formattedPublicKey.includes(pemHeader)) {
      formattedPublicKey = `${pemHeader}\n${formattedPublicKey}\n${pemFooter}`;
    }

    const pemContents = formattedPublicKey
      .replace(pemHeader, "")
      .replace(pemFooter, "")
      .replace(/[\r\n\t ]/g, "");

    if (!pemContents || pemContents.length === 0) {
      throw new Error("Invalid public key: empty content after formatting");
    }

    const binaryDer = window.atob(pemContents);
    const binaryDerBuffer = new Uint8Array(binaryDer.length);
    for (let i = 0; i < binaryDer.length; i++) {
      binaryDerBuffer[i] = binaryDer.charCodeAt(i);
    }

    // Import the public key
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      binaryDerBuffer,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt"]
    );

    // Encrypt the data
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      dataBuffer
    );

    // Convert to base64
    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

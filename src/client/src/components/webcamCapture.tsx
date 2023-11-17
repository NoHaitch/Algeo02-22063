import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

interface WebcamCaptureProps {
  toggleCapture?: boolean;
  captureInterval?:number;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ toggleCapture, captureInterval }) => {
  const webcamRef = useRef<Webcam>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [webcamError, setWebcamError] = useState<boolean>(false);

  useEffect(() => {
    const captureScreenshot = async () => {
      if (toggleCapture && webcamRef.current) {
        try {
          // Ensure that the webcam is accessible before attempting to capture
          const base64 = webcamRef.current.getScreenshot();
          setScreenshot(base64);
          setWebcamError(false);

          // Uncomment the line below to save the screenshot as a file
          // saveScreenshot(base64);
        } catch (error) {
          // Handle webcam access error
          console.error("Error accessing webcam:", error);
          setWebcamError(true);
        }
      }
    };

    // Capture a screenshot initially
    captureScreenshot();

    // Set up interval to capture a screenshot every 5 seconds
    const intervalId = setInterval(captureScreenshot, (captureInterval! *1000));

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [toggleCapture]); // Add toggleCapture to the dependency array

  const saveScreenshot = (base64: string) => {
    // Uncomment this function to save the screenshot as a file
    const blob = base64ToBlob(base64);
    saveAs(blob, "screenshot.png");
  };

  const base64ToBlob = (base64: string): Blob => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "image/png" });
  };

  return (
    <div className="flex flex-row items-center space-x-8 m-5">
      <div className="">
        <h2 className="text-center">Webcam</h2>
        {webcamError ? (
          <div className="w-[400px] h-[300px] bg-gray-300"></div>
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            className="w-[400px] h-auto rounded-[5px] border-2 border-[--trinary] bg-gray-300 "
          />
        )}
      </div>
      {screenshot && !webcamError && (
        <div>
          <h2 className="text-center">Current Screenshot</h2>
          <img
            src={screenshot}
            alt="Latest Screenshot"
            className="w-[400px] h-auto rounded-[25px] drop-shadow-[4px_4px_2.5px_#000] border-4 border-[--primary] bg-gray-300 "
          />
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;

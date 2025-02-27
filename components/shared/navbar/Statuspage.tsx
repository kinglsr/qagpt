import React, { useEffect, useState } from "react";

function Statuspage() {
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 640); // Adjust the breakpoint as needed
    };

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col text-dark-100 dark:text-light-900">
      <label className="relative inline-flex cursor-pointer items-center">
        <iframe
          src="https://status.qagpt.co/badge?theme=dark"
          width={isSmallDevice ? "30" : "250"}
          height="30"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </label>
    </div>
  );
}

export default Statuspage;

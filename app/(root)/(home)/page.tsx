"use client";
import React, { useState } from "react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

const Page = () => {
  // eslint-disable-next-line no-unused-vars
  const [videoError, setVideoError] = useState(false);

  return (
    <>
      <h1 className="h2-bold text-dark100_light900">Welcome to QA GPT</h1>
      <div className="flex flex-col items-center">
        <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          {videoError ? (
            <AspectRatio ratio={16 / 9}>
              <Image
                src="/OIG.JPEG"
                alt="profile"
                style={{ objectFit: "cover" }}
                fill
              />
            </AspectRatio>
          ) : (
            <div style={{ width: "100%", height: "500px" }}>
              <iframe
                src="https://www.youtube.com/embed/zTDYhZ1Pr34"
                allow="autoplay; fullscreen; picture-in-picture"
                style={{ width: "100%", height: "100%" }}
              ></iframe>
            </div>
          )}
        </div>
      </div>
      <div className="mt-11 flex justify-between gap-5 overflow-hidden max-sm:flex-col sm:items-center">
        <div className="mt-10 flex w-full flex-col gap-6">
          <h5 className="sm:paragraph-medium text-dark200_light900 mt-2 flex-1">
            QAGPT, your ultimate life-saver in meetings! Are you tired of
            getting stuck in meetings or feeling lost as a newcomer? Look no
            further! QAGPT is here to rescue you. With QAGPT, you can seamlessly
            run it alongside your meeting application, and it will actively
            listen and provide answers. Say goodbye to taking notes by hand and
            let QAGPT handle it all for you. Whether you need assistance with
            meeting discussions, gathering information, or any other purpose,
            QAGPT has got you covered. We value your feedback and would love to
            hear how you are utilizing this application. Join us today and
            experience a whole new level of meeting productivity with QAGPT!
          </h5>
        </div>
      </div>
    </>
  );
};

export default Page;

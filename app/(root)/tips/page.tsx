import React from "react";

function page() {
  return (
    <div className="mt-11 flex justify-between gap-5 overflow-hidden max-sm:flex-col sm:items-center">
      <div className="mt-10 flex w-full flex-col gap-6">
        <h2 className="h1-bold text-dark100_light900">Tips </h2>
        <ul className="h3-bold text-dark100_light900 mt-2 text-left">
          <li className="mb-5">
            0. Not All laptops are Compaitable, please check your laptop
            settings and use trail page to check your microphone settings.
          </li>
          <li className="mb-5">1. QAGPT works best with Teams and On Laptop</li>
          <li className="mb-5">
            2. External devices like mobile can be used for asking questions
          </li>
          <li className="mb-5">
            3. Please restart your laptop before meeting; it fixes most of the
            issues.
          </li>
          <li className="mb-5">
            4. Works only on Chrome and Edge browsers and laptops, Run the teams
            on Desktop App
          </li>
          <li className="mb-5">
            5. 🚨 Reset button clears all the mess but use with caution 🚨
          </li>
          <li className="mb-5">
            6. As soon as the session starts, ask at least 🚨3 - 5 sample
            questions 🚨 to warm up our machines..💪😄
          </li>
          <li className="mb-5">
            7. If the screen is too big, please zoom out to 80% for best results
            Windows - &apos; Ctrl + -&apos; Mac - &apos; Cmd + -&apos;
          </li>
        </ul>
        <h2 className="h2-bold text-dark100_light900">
          Let Us Know if you have any More Tips Good Luck!! <br />
        </h2>
      </div>
    </div>
  );
}

export default page;

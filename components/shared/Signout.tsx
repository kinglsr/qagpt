import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Image from "next/image";

const CustomSignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    // Clicking on this button will sign out a user and reroute them to the "/" (home) page.
    <Button
      onClick={() => signOut(() => router.push("/"))}
      className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none"
    >
      <Image
        src="/assets/icons/sign-out.svg"
        alt="sign up"
        width={20}
        height={20}
        className="invert-colors lg:hidden"
      />
      <span className="max-lg:hidden">SignOut ?</span>
    </Button>
  );
};

export default CustomSignOutButton;

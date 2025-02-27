import { getUserDetailsById } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import Image from "next/image";
import React from "react";
import { getJoinedDate } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink"; // Add this import statement
import PurchaseTable from "@/components/profile/paymenthistory";

const Page = async ({ params }: URLProps) => {
  const userInfo = await getUserDetailsById({ userId: params.id });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between overflow-hidden sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            alt="profile picture"
            src={userInfo?.picture} // Fix this line
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{userInfo.name}</h2>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo.username && (
                <ProfileLink
                  imgUrl="/assets/icons/user.svg"
                  title={userInfo.username}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedDate(userInfo.joinedAt)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <PurchaseTable />
      </div>
    </>
  );
};

export default Page;

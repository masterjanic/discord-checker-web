"use client";

import { useState } from "react";
import Button from "~/app/_components/common/button";
import SubscribeModal from "~/app/_components/customer/profile/subscribe-modal";

export default function SubscribeButton() {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  return (
    <>
      {isOpened && (
        <SubscribeModal isOpen={isOpened} onClose={() => setIsOpened(false)} />
      )}
      <Button onClick={() => setIsOpened(true)}>Subscribe for 1 month</Button>
    </>
  );
}

import { type DiscordAccount } from "@prisma/client";
import clsx from "clsx";

interface IAccountRatingProps {
  user: Pick<DiscordAccount, "rating">;
}

export default function AccountRating({ user }: IAccountRatingProps) {
  const rating = user.rating;
  if (rating === null || rating === undefined) {
    return (
      <div className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-md border border-neutral-100/10 bg-blueish-grey-700">
        <span className="text-sm font-medium">?</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-md border",
        rating <= 25 &&
          "border-red-400 bg-red-600 text-red-100 shadow-md shadow-red-400/40",
        rating > 25 &&
          rating < 50 &&
          "border-orange-400 bg-orange-600 text-orange-100 shadow-md shadow-orange-400/40",
        rating >= 50 &&
          rating < 70 &&
          "border-yellow-400 bg-yellow-600 text-yellow-100 shadow-md shadow-yellow-400/40",
        rating >= 70 &&
          "border-green-400 bg-green-600 text-green-100 shadow-md shadow-green-400/40",
      )}
    >
      <span className="absolute text-sm font-medium">{rating}</span>
    </div>
  );
}

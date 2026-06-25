import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = "/api";

export const hookMainStats = async () => {
  const res = await commonPostHook("GET", `${apiBaseUrl}/books/count`, null);
  return (
    res ?? {
      totalBookCount: 0,
      coverBookCount: 0,
      likedBookCount: 0,
    }
  );
};

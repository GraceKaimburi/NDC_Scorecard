"use client";

import { getAccessToken } from "@/utils/access-token";
import React, { useEffect } from "react";

const Page = () => {




  useEffect(() => {
    async function fetchData() {
      const accessToken = getAccessToken();

      const duo = "JWT -" + accessToken;
      console.log(duo);

      console.log("using access token:", accessToken);
      const res = await fetch(
        "https://ndcbackend.agnesafrica.org/api/session/",
        {
          // add bearer token
          headers: {
            Authorization: `JWT ${accessToken}`,
            Accept: "application/json",
          },
        }
      );
      const json = await res.json();
      console.log(json);
    }

    fetchData();
  }, []);
  return (
    <div>
      <p>
        This is a demo page. It fetches data from the backend using the access
        token.
      </p>
    </div>
  );
};

export default Page;

    import React, { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import { signInWithRedirect, getCurrentUser, AuthUser } from "aws-amplify/auth";

Hub.listen("auth", ({ payload }) => {
  switch (payload.event) {
    case "signInWithRedirect":
      const user = await getCurrentUser();
      console.log(user.username);
      break;
    case "signInWithRedirect_failure":
      // handle sign in failure
      break;
    case "customOAuthState":
      const state = payload.data; // this will be customState provided on signInWithRedirect function
      console.log(state);
      break;
  }
});

function handleSignInClick() {
  signInWithRedirect({
    provider: {custom:'Azure'}
  });
}



export default handleSignInClick

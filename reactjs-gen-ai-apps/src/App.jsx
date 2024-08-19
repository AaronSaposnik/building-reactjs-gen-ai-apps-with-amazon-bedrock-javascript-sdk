import React, { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import { signInWithRedirect, signOut, getCurrentUser } from "aws-amplify/auth";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [customState, setCustomState] = useState(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          setError("An error has occurred during the OAuth flow.");
          break;
        case "customOAuthState":
          setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
          break;
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  const getUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error(error);
      console.log("Not signed in");
    }
  };

  return (
    <div className="App">
      <button onClick={() => signInWithRedirect()}>Open Hosted UI</button>
      <button onClick={() => signInWithRedirect({ provider: {custom:'Azure'}})}>
        Open Azure
      </button>
      <button onClick={() => signInWithRedirect({ provider: "Facebook"})}>
        Open Facebook
      </button>
      <button onClick={() => signInWithRedirect({ provider: "Google"})}>
        Open Google
      </button>
      <button onClick={() => signInWithRedirect({ provider: "Amazon" })}>
        Open Amazon
      </button>
      <button onClick={() => signInWithRedirect({ provider: "Apple"})}>
        Open Apple
      </button>
      <button onClick={() => signOut()}>Sign Out</button>
      <div>{user?.username}</div>
    </div>
  );
}

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
          setError("An error has ocurred during the OAuth flow.");
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
      <button onClick={() => signInWithRedirect({ provider:{custom:'Azure'}})}>Open Microsoft</button>
      <button onClick={() => signInWithRedirect({ provider: "Facebook", customState: "shopping-cart" })}>
        Open Facebook
      </button>
      <button onClick={() => signInWithRedirect({ provider: "Google", customState: "shopping-cart" })}>
        Open Google
      </button>
      <button onClick={() => signInWithRedirect({ provider: "Amazon", customState: "shopping-cart" })}>
        Open Amazon
      </button>
      <button onClick={() => signInWithRedirect({ provider: "Apple", customState: "shopping-cart" })}>
        Open Apple
      </button>
      <button onClick={() => signOut()}>Sign Out</button>
      <div>{user?.username}</div>
      <div>{customState}</div>
    </div>
  );
}

export default App

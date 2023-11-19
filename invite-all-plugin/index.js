// the name of our new button's div
const inviteDivId = "inviteAllDiv";

// find our online friends
const fetchOnlineFriends = async () => {
  const response = await fetch("/lol-chat/v1/friends");
  if (!response.ok) {
    throw new Error(`HTTP error when fetching friends. ${response.status}`);
  }
  const data = await response.json();
  return data.filter(({availability}) => availability === "chat" || availability === "away");
}

// invite our online friends
const inviteFriends = async () => {
  const onlineFriends = await fetchOnlineFriends();
  await fetch("/lol-lobby/v2/lobby/invitations", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      onlineFriends.map((friend) => ({ toSummonerId: friend.summonerId }))
    ),
  });
};

// try to invite friends and display a toast with the result
const handleButtonClick = async () => {
  try {
    await inviteFriends();
    Toast.success("Friends invited");
  } catch (error) {
    Toast.error("Failed to invite friends", error);
  }
};

// create our button
const createButton = () => {
  const button = document.createElement("lol-uikit-flat-button");
  button.textContent = "Invite All";
  button.onclick = handleButtonClick;
  return button;
};

// create a div to hold our button
const createButtonsDiv = () => {
  const buttonsDiv = document.createElement("div");
  buttonsDiv.id = inviteDivId;
  buttonsDiv.appendChild(createButton());
  return buttonsDiv;
};

export function load() {
  // create an observer that will run when the dom is updated
  new MutationObserver(() => {
    // select the invisible bar that appears at the top of party creation screen
    const lobbyHeaderDiv = document.querySelector(
      ".lobby-header-buttons-container"
    );
    // if the lobby bar exists and our button does not exist on it, add our button
    if (lobbyHeaderDiv && !lobbyHeaderDiv.querySelector(`#${inviteDivId}`)) {
      lobbyHeaderDiv.insertBefore(createButtonsDiv(), lobbyHeaderDiv.children[1]);
    }
  }).observe(document.body, { childList: true, subtree: true });
}

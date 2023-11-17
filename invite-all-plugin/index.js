const inviteFriends = async () => {
  const response = await fetch("/lol-chat/v1/friends");
  const data = await response.json();
  const onlineFriends = data.filter(
    (friend) => friend.availability === "chat" || friend.availability === "away"
  );

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

const createButton = () => {
  const button = document.createElement("lol-uikit-flat-button");
  button.textContent = "Invite All";
  button.onclick = async () => {
    try {
      await inviteFriends();
      Toast.success("Friends invited");
    } catch (error) {
      Toast.error("Failed to invite friends", error);
    }
  };
  return button;
};

const createMainDiv = () => {
  const mainDiv = document.createElement("div");
  mainDiv.id = "inviteAllDiv";
  mainDiv.appendChild(createButton());
  return mainDiv;
};

export function load() {
  new MutationObserver(() => {
    const lobbyHeaderDiv = document.querySelector(
      ".lobby-header-buttons-container"
    );
    const inviteAllDiv = document.querySelector("#inviteAllDiv");
    if (lobbyHeaderDiv && !inviteAllDiv) {
      lobbyHeaderDiv.insertBefore(createMainDiv(), lobbyHeaderDiv.children[1]);
    }
  }).observe(document.body, { childList: true, subtree: true });
}

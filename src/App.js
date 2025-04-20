import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [openId, setOpenId] = useState("");

  const [friends, setFriends] = useState(initialFriends);

  function handleFriend(event, balance) {
    event.preventDefault();

    setFriends((preFriends) =>
      preFriends.map((friend) =>
        friend.id === openId
          ? {
              ...friend,
              balance: friend.balance + balance,
            }
          : friend
      )
    );
    setOpenId("");
  }

  function handleAddFriend(newFriend) {
    setFriends([...friends, newFriend]);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList openId={openId} setOpenId={setOpenId} friends={friends} />
        <AddFriend onAddFriend={handleAddFriend} />
      </div>
      {openId && (
        <SplitBill
          selectName={
            initialFriends.filter((item) => item.id === openId).at(0)?.name
            //initialFriends.find((item)=> item.id ==openId)?.name
          }
          handleFriend={handleFriend}
        />
      )}
    </div>
  );
}

function FriendsList({ openId, setOpenId, friends }) {
  function onOpen(id) {
    setOpenId(id === openId ? "" : id);
  }
  return (
    <div>
      <ul>
        {friends.map((el) => (
          <li key={el.id} className={el.id === openId ? "selected" : ""}>
            <img src={el.image} alt={el.name} />
            <h3>{el.name}</h3>

            <p
              style={{
                color:
                  el.balance === 0 ? "black" : el.balance < 0 ? "red" : "green",
              }}
            >
              {el.balance === 0
                ? `You and ${el.name} are even`
                : el.balance < 0
                ? `You owe ${el.name} $${Math.abs(el.balance)}`
                : `${el.name} owes you $${Math.abs(el.balance)}`}
            </p>

            <button
              className="button"
              onClick={() => {
                onOpen(el.id);
              }}
            >
              {openId === el.id ? "Close" : "Select"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SplitBill({ selectName, handleFriend }) {
  const [bill, setBill] = useState(0);
  const [youExpense, setYouExpense] = useState(0);
  const [payer, setPayer] = useState("you");
  function handleBalance() {
    const balance = payer === "you" ? bill - youExpense : -youExpense;
    setBill(0);
    setYouExpense(0);
    return balance;
  }
  return (
    <form className="form-split-bill">
      <h2>SPLIT A BILL WITH {selectName}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={youExpense}
        onChange={(e) =>
          setYouExpense(
            Number(e.target.value) > bill ? youExpense : Number(e.target.value)
          )
        }
      />
      <label>👫 {selectName}'s expense</label>
      <input type="text" placeholder={bill - youExpense} readOnly />
      <label>🤑 Who is paying the bill</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="you">You</option>
        <option value={selectName}>{selectName}</option>
      </select>

      <button
        className="button"
        onClick={(e) => handleFriend(e, handleBalance())}
      >
        Split bill
      </button>
    </form>
  );
}

function AddFriend({ onAddFriend }) {
  const [isOpen, setIsOpen] = useState(false);
  function handleOpen() {
    setIsOpen((pre) => !pre);
  }
  const [name, setname] = useState("");
  const [image, setimage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    const newFriend = {
      id: crypto.randomUUID(),
      name,
      image: "https://i.pravatar.cc/48",
      balance: 0,
    };

    onAddFriend(newFriend);
    setname("");
    setimage("");
  }

  return (
    <div>
      <button className="button" onClick={handleOpen}>
        {isOpen ? "Close" : "Add friend"}
      </button>

      {isOpen && (
        <form className="form-add-friend" onSubmit={handleSubmit}>
          <label>👫 Friend Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <label>🌄Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setimage(e.target.value)}
            placeholder="https://i.pravatar.cc/48"
          />
          <button className="button">Add</button>
        </form>
      )}
    </div>
  );
}

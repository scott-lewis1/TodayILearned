const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#8b5cf6" },
  { name: "news", color: "#f97316" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly META)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

//selecting DOM elements
const btnToggleForm = document.querySelector(".btn-toggle-form");
const factForm = document.querySelector(".fact-form");
const factsList = document.querySelector(".fact-list");

//clearing facts list
factsList.innerHTML = "";

//load data from supabase
loadFacts();
async function loadFacts() {
  const res = await fetch(
    "https://knkbfdfaukjmrxcgmdpb.supabase.co/rest/v1/Facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtua2JmZGZhdWtqbXJ4Y2dtZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDg4NTAsImV4cCI6MjA2ODgyNDg1MH0.r2pWsvZYhe-giN6jaz_IDUu_cQon521kD9Ptxip0j9E",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtua2JmZGZhdWtqbXJ4Y2dtZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDg4NTAsImV4cCI6MjA2ODgyNDg1MH0.r2pWsvZYhe-giN6jaz_IDUu_cQon521kD9Ptxip0j9E",
      },
    }
  );
  const data = await res.json();
  //const filteredData = data.filter((fact) => fact.category === "technology");//
  // console.log(data);//
  createFactsList(data);
}

//inserting facts into the list code block

function createFactsList(dataArray) {
  const htmlArray = dataArray.map(
    (fact) => `<li class="fact">
    <p class="fact-text">
          ${fact.text}
          <a class="source" href="${fact.source}" target="_blank">(source)</a>
        </p>
        <div class="tag">
          <span class="tag"
            style="background-color: ${
              CATEGORIES.find((cat) => cat.name === fact.category).color
            };">#${fact.category}#</span>
        </div>
  </li>`
  );
  factsList.insertAdjacentHTML("afterbegin", htmlArray.join(""));
}

//Toggling form functionality
btnToggleForm.addEventListener("click", function () {
  if (factForm.classList.contains("hidden")) {
    factForm.classList.remove("hidden");
    btnToggleForm.textContent = "Close";
  } else {
    factForm.classList.add("hidden");
    btnToggleForm.textContent = "Share a fact";
  }
});

/*
//2. Calculate the age of a fact

const calcFactAge2 = (year) =>
  year <= new Date().getFullYear()
    ? new Date().getFullYear() - year
    : `Invalid year. Year needs to be less or equal to ${new Date().getFullYear()}`;
console.log(calcFactAge2(2015));
console.log(calcFactAge2(2037));
*/
/*
let votesInteresting = 15;
let votesMindblowing = 10;
let votesFalse = 7;

//3. Show the result of the votes
if (votesInteresting === votesMindblowing) {
  alert("This fact is equally interesting and mindblowing!");
} else if (votesInteresting > votesMindblowing) {
  alert("This fact is more interesting than mindblowing!");
} else {
  alert("This fact is more mindblowing than interesting!");
}

// falsy values: 0, "", null, undefined, NaN
// truthy values: everything else
//4. Check if the fact is mindblowing
if (votesMindblowing) {
  console.log("This fact is mindblowing!");
} else {
  console.log("Not so special!");
}

const totalUpvotes = votesInteresting + votesMindblowing;

const message =
  totalUpvotes > votesFalse
    ? "The Fact is true"
    : "Might be false, check more sources";

alert(message);

const text = "Lisbon is the capital of Portugal";
const upperText = text.toUpperCase();
console.log(upperText);

const str = `The current fact is "${text}". It is ${calcFactAge(
  2015
)} years old. It is probably ${
  totalUpvotes > votesFalse ? "true" : "not true"
}`;

console.log(str);
*/
/*
const fact = ["Lisbon is the capital of Portugal", 2015, true];

const [text, createdIn, isCorrectFromArray] = fact;

const newFact = [...fact, "society"];

const factObj = {
  text: "Lisbon is the capital of Portugal",
  category: "society",
  createdIn: 2015,
  isCorrect: true,
  createSummary: function () {
    return `The fact "${this.text}" is from ${this.category} 
    and was created in ${this.createdIn}.
    It is ${this.isCorrect ? "correct" : "incorrect"}`;
  },
};

const { category, isCorrect } = factObj;

[2, 4, 6, 8, 10].forEach(function (el) {
  console.log(el);
});

// const doubled = [2, 4, 6, 8, 10].map(function (el) {
//   return el * 2;
// });
// console.log(doubled);

const doubled = [2, 4, 6, 8, 10].map((el) => el * 2);
console.log(doubled);

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const allCategories = CATEGORIES.map((el) => el.name);
console.log(allCategories);

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

const calcFactAge2 = (year) =>
  year <= new Date().getFullYear()
    ? new Date().getFullYear() - year
    : `Invalid year. Year needs to be less or equal to ${new Date().getFullYear()}`;

const factAges = initialFacts.map((el) => calcFactAge2(el.createdIn));
console.log(factAges);
console.log(factAges.join("-"));
*/

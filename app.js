import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
getAuth,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDH8Hif2CouVBTh3QZz0rEaovY5B6YNP10",
authDomain: "thoinote.firebaseapp.com",
projectId: "thoinote",
storageBucket: "thoinote.firebasestorage.app",
messagingSenderId: "205870538236",
appId: "1:205870538236:web:cd33f4a7c07bcf36f2e679"
};

const fbApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(fbApp);
const db = getFirestore(fbApp);

// DOM
const authBox = document.getElementById("auth");
const appBox = document.getElementById("app");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const noteInput = document.getElementById("note");
const list = document.getElementById("list");

let USER=null;
let notes=[];

// LOGIN
window.login = async ()=>{

try{
await signInWithEmailAndPassword(firebaseAuth,emailInput.value,passwordInput.value);
}catch{
await createUserWithEmailAndPassword(firebaseAuth,emailInput.value,passwordInput.value);
}

};

// SESSION
onAuthStateChanged(firebaseAuth,u=>{
if(u){
USER=u.uid;
authBox.style.display="none";
appBox.style.display="block";
load();
}
});

// LOAD NOTES
async function load(){
notes=[];
const q = await getDocs(collection(db,"notes",USER,"items"));
q.forEach(d=>notes.push({id:d.id,text:d.data().text}));
render();
}

// ADD NOTE
window.add = async ()=>{
if(!noteInput.value) return;

await addDoc(collection(db,"notes",USER,"items"),{
text:noteInput.value,
time:Date.now()
});

noteInput.value="";
load();
};

// DELETE
window.del = async(id)=>{
await deleteDoc(doc(db,"notes",USER,"items",id));
load();
};

// RENDER
function render(){
list.innerHTML="";
notes.forEach((n,i)=>{
list.innerHTML+=`
<li>${i+1}. ${n.text}
<button onclick="del('${n.id}')">X</button>
</li>`;
});
}

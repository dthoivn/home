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
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDH8Hif2CouVBTh3QZz0rEaovY5B6YNP10",
  authDomain: "thoinote.firebaseapp.com",
  projectId: "thoinote",
  storageBucket: "thoinote.firebasestorage.app",
  messagingSenderId: "205870538236",
  appId: "1:205870538236:web:cd33f4a7c07bcf36f2e679"
};

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);
const db = getFirestore(fb);

// DOM
const authBox=document.getElementById("auth");
const appBox=document.getElementById("app");
const email=document.getElementById("email");
const password=document.getElementById("password");
const note=document.getElementById("note");
const list=document.getElementById("list");
const search=document.getElementById("search");

let USER=null;
let notes=[];

// LOGIN
window.login=async()=>{
try{
await signInWithEmailAndPassword(auth,email.value,password.value);
}catch{
await createUserWithEmailAndPassword(auth,email.value,password.value);
}
};

// SESSION
onAuthStateChanged(auth,u=>{
if(u){
USER=u.uid;
authBox.style.display="none";
appBox.style.display="block";
load();
}
});

// LOAD
async function load(){
notes=[];
const q=await getDocs(collection(db,"notes",USER,"items"));
q.forEach(d=>notes.push({id:d.id,text:d.data().text,time:d.data().time}));
render();
}

// ADD
window.add=async()=>{
if(!note.value) return;

await addDoc(collection(db,"notes",USER,"items"),{
text:note.value,
time:new Date().toLocaleString()
});

note.value="";
load();
};

// DELETE
window.del=async(id)=>{
await deleteDoc(doc(db,"notes",USER,"items",id));
load();
};

// EDIT
window.edit=async(id,old)=>{
let t=prompt("Edit note:",old);
if(!t) return;

await updateDoc(doc(db,"notes",USER,"items",id),{
text:t
});
load();
};

// RENDER + SEARCH
window.render=()=>{
list.innerHTML="";
let s=search.value.toLowerCase();

notes.forEach((n,i)=>{
if(n.text.toLowerCase().includes(s)){
list.innerHTML+=`
<li>
<b>${i+1}. ${n.text}</b><br>
<small>${n.time}</small><br>
<button onclick="edit('${n.id}','${n.text.replace(/'/g,"")}')">EDIT</button>
<button onclick="del('${n.id}')">DEL</button>
</li>`;
}
});
};




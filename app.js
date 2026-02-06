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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let USER=null;
let notes=[];

window.login=async()=>{

try{
await signInWithEmailAndPassword(auth,email.value,password.value);
}catch{
await createUserWithEmailAndPassword(auth,email.value,password.value);
}

};

onAuthStateChanged(auth,u=>{
if(u){
USER=u.uid;
auth.style.display="none";
appBox.style.display="block";
load();
}
});

async function load(){
notes=[];
const q=await getDocs(collection(db,"notes",USER,"items"));
q.forEach(d=>notes.push({id:d.id,text:d.data().text}));
render();
}

window.add=async()=>{
await addDoc(collection(db,"notes",USER,"items"),{
text:note.value,
time:Date.now()
});
note.value="";
load();
}

window.del=async(id)=>{
await deleteDoc(doc(db,"notes",USER,"items",id));
load();
}

window.render=()=>{
list.innerHTML="";
notes.forEach((n,i)=>{
list.innerHTML+=`
<li>${i+1}. ${n.text}
<button onclick="del('${n.id}')">X</button>
</li>`;
});
}

const auth=document.getElementById("auth");
const appBox=document.getElementById("app");
const list=document.getElementById("list");

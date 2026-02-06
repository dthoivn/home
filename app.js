import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDH8Hif2CouVBTh3QZz0rEaovY5B6YNP10",
    authDomain: "thoinote.firebaseapp.com",
    projectId: "thoinote",
    storageBucket: "thoinote.firebasestorage.app",
    messagingSenderId: "205870538236",
    appId: "1:205870538236:web:cd33f4a7c07bcf36f2e679"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let USER=null;
let notes=[];

window.login=()=>{
USER=user.value;
load();
};

async function load(){
notes=[];
const q=await getDocs(collection(db,"notes_"+USER));
q.forEach(d=>{
notes.push({id:d.id,text:d.data().text});
});
render();
}

window.add=async()=>{
if(!note.value) return;
await addDoc(collection(db,"notes_"+USER),{
text:note.value,
time:Date.now()
});
note.value="";
load();
};

window.del=async(id)=>{
await deleteDoc(doc(db,"notes_"+USER,id));
load();
};

window.render=()=>{
list.innerHTML="";
let s=search.value.toLowerCase();
notes.forEach((n,i)=>{
if(n.text.toLowerCase().includes(s)){
list.innerHTML+=`
<li>${i+1}. ${n.text}
<button onclick="del('${n.id}')">X</button>
</li>`;
}
});
};

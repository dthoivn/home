import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
getAuth,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
onAuthStateChanged,
updateEmail,
updatePassword
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

/* ================= HÀM PHỤ ================= */



/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: "AIzaSyDH8Hif2CouVBTh3QZz0rEaovY5B6YNP10",
  authDomain: "thoinote.firebaseapp.com",
  projectId: "thoinote",
  storageBucket: "thoinote.firebasestorage.app",
  messagingSenderId: "205870538236",
  appId: "1:205870538236:web:cd33f4a7c07bcf36f2e679"
};

/* ================= INIT ================= */

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);
const db = getFirestore(fb);

/* ================= DOM ================= */

const authBox = document.getElementById("auth");
const appBox = document.getElementById("app");
const email = document.getElementById("email");
const password = document.getElementById("password");
const note = document.getElementById("note");
const list = document.getElementById("list");
const search = document.getElementById("search");
const exportBtn = document.getElementById("exportBtn");

/* ================= STATE ================= */

let USER = null;
let notes = [];

/* ================= PAGE LOCK ================= */

const PAGE_PASSWORD = "1981";   // đổi mật khẩu tại đây

if(!sessionStorage.getItem("page_unlocked")){

let p = prompt("🔐 Enter system password:");

if(p !== PAGE_PASSWORD){
alert("Access denied");
location.reload();
}else{
sessionStorage.setItem("page_unlocked","ok");
}

}

/* ================= LOGIN ================= */

window.login = async () => {

try{
await signInWithEmailAndPassword(auth,email.value,password.value);
}catch{
await createUserWithEmailAndPassword(auth,email.value,password.value);
}

};

/* ================= SESSION ================= */

onAuthStateChanged(auth,u=>{
if(u){
USER=u.uid;
authBox.style.display="none";
appBox.style.display="block";
load();
}
});

/* ================= LOAD NOTES ================= */

async function load(){
notes=[];
const q=await getDocs(collection(db,"notes",USER,"items"));
q.forEach(d=>notes.push({
id:d.id,
text:d.data().text,
time:d.data().time
}));
render();
}

/* ================= ADD ================= */

window.add = async ()=>{

if(!note.value) return;

await addDoc(collection(db,"notes",USER,"items"),{
text:note.value,
time:new Date().toLocaleString()
});

note.value="";
load();
};

/* ================= DELETE ================= */

window.del = async (id)=>{
await deleteDoc(doc(db,"notes",USER,"items",id));
load();
};

/* ================= EDIT ================= */

window.edit = async (id,old)=>{
let t = prompt("Edit note:",old);
if(!t) return;

await updateDoc(doc(db,"notes",USER,"items",id),{
text:t
});

load();
};

/* ================= SEARCH + RENDER ================= */

window.render = ()=>{

list.innerHTML="";
let s = search.value.toLowerCase();

notes.forEach((n,i)=>{
if(n.text.toLowerCase().includes(s)){
list.innerHTML+=`
<li>

<b>${i+1}. ${
n.fileUrl
? `<a href="${n.fileUrl}" target="_blank">${n.text}</a>`
: n.text
}</b><br>

<small>${n.time}</small><br>

<button onclick="edit('${n.id}','${n.text.replace(/'/g,"")}')">EDIT</button>
<button onclick="del('${n.id}')">DEL</button>

</li>`;
}
});
};

/* ================= CHANGE EMAIL ================= */

window.changeEmail = async ()=>{
let newEmail = prompt("New email:");
if(!newEmail) return;

await updateEmail(auth.currentUser,newEmail);
alert("Email updated!");
};

/* ================= CHANGE PASSWORD ================= */

window.changePassword = async ()=>{
let newPass = prompt("New password (>=6 chars):");
if(!newPass) return;

await updatePassword(auth.currentUser,newPass);
alert("Password updated!");
};

/* ================= EXPORT TXT ================= */

exportBtn.addEventListener("click", async ()=>{

notes=[];

const q = await getDocs(collection(db,"notes",USER,"items"));
q.forEach(d=>notes.push({
text:d.data().text,
time:d.data().time
}));

if(notes.length===0){
alert("No notes to export!");
return;
}

let content = "RETRO TECH NOTES\n";
content += "====================\n\n";

notes.forEach((n,i)=>{
content += `${i+1}. ${n.text}\n`;
if(n.time) content += `   Time: ${n.time}\n`;
content += "\n";
});

content += "====================\n";
content += "Exported: "+new Date().toLocaleString();

let blob = new Blob([content],{type:"text/plain"});
let a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "tech_notes.txt";
a.click();

});

/* ================= GITHUB UPLOAD ================= */

// ĐIỀN CỦA BẠN
const GITHUB_USER = "dthoivn";
const GITHUB_REPO = "home";
const GITHUB_TOKEN = "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";   // token của bạn

const ghFile = document.getElementById("ghFile");
const ghUploadBtn = document.getElementById("ghUploadBtn");

ghUploadBtn.addEventListener("click", async ()=>{

if(!ghFile.files[0]){
alert("Chọn file trước");
return;
}

const file = ghFile.files[0];
const reader = new FileReader();

reader.onload = async e =>{

const base64 = btoa(e.target.result);
const filename = Date.now()+"_"+file.name;

const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/uploads/${filename}`;

await fetch(url,{
method:"PUT",
headers:{
"Authorization":"token "+GITHUB_TOKEN,
"Content-Type":"application/json"
},
body:JSON.stringify({
message:"upload file",
content:base64
})
});

const rawUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/uploads/${filename}`;

// lưu link vào Firestore
await addDoc(collection(db,"notes",USER,"items"),{
text:"📎 "+file.name,
fileUrl:rawUrl,
time:new Date().toLocaleString()
});


alert("Upload thành công!");
ghFile.value="";
load();
};

// reader.readAsBinaryString(file);
reader.readAsArrayBuffer(file);

reader.onload = async e => {
  const bytes = new Uint8Array(e.target.result);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  const base64 = btoa(binary);

  ...
}

});











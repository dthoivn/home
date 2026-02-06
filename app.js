const USERS={
admin:"1234",
dev:"dev"
};

let session=null;

const loginBox=document.getElementById("login");
const appBox=document.getElementById("app");
const userInput=document.getElementById("user");
const passInput=document.getElementById("pass");

const note=document.getElementById("note");
const tag=document.getElementById("tag");
const search=document.getElementById("search");
const filter=document.getElementById("filter");
const list=document.getElementById("list");

function loginUser(){

if(USERS[userInput.value]===passInput.value){

session=userInput.value;

loginBox.style.display="none";
appBox.classList.remove("hidden");

load();

}else{
alert("Sai username hoặc password");
}

}

function enc(t){return btoa(t)}
function dec(t){return atob(t)}

let notes=[];

function load(){
notes=JSON.parse(localStorage.getItem("ult_"+session))||[];
render();
}

function save(){
localStorage.setItem("ult_"+session,JSON.stringify(notes));
}

function md(t){
return t.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>")
.replace(/\*(.*?)\*/g,"<i>$1</i>")
.replace(/\n/g,"<br>");
}

function add(){
if(!note.value) return;

notes.push({
text:enc(note.value),
tag:tag.value,
time:new Date().toLocaleString()
});

note.value="";
tag.value="";
save();
render();
}

function del(i){
notes.splice(i,1);
save();
render();
}

function edit(i){
let t=prompt("Edit",dec(notes[i].text));
if(t){
notes[i].text=enc(t);
save();
render();
}
}

function render(){
list.innerHTML="";
let s=search.value.toLowerCase();
let f=filter.value.toLowerCase();

notes.forEach((n,i)=>{
let txt=dec(n.text);

if(txt.toLowerCase().includes(s)&&n.tag.toLowerCase().includes(f)){
list.innerHTML+=`
<li>
<b>${i+1}. ${md(txt)}</b><br>
#${n.tag}<br>
<small>${n.time}</small><br>
<button onclick="edit(${i})">EDIT</button>
<button onclick="del(${i})">DEL</button>
</li>`;
}
});
}

function exportJSON(){
download(JSON.stringify(notes),"backup.json");
}

function importJSON(f){
let r=new FileReader();
r.onload=e=>{
notes=JSON.parse(e.target.result);
save();
render();
}
r.readAsText(f.files[0]);
}

function download(d,n){
let b=new Blob([d]);
let a=document.createElement("a");
a.href=URL.createObjectURL(b);
a.download=n;
a.click();
}


const years=[...Array(10)].map((_,i)=>({label:`Year ${i+1}`,value:`grade_${i+1}`}));
const subjects=[
["Mathematics","mathematics"],["Literacy A","literacy_a"],["Basic Science","basic_science"],
["Social Studies","social_studies"],["ICT","ict"],["Civic Education","civic_education"],
["Agriculture","agriculture"],["Home Economics","home_economics"],["CRS","crs"],
["French","french"],["Business Studies","business_studies"],["Fine Arts","fine_arts"],["Literacy B","literacy_b"]
];
let selectedClass="",selectedSubject="",questions=[],index=0,answers={},examStarted=false;

const cls=document.getElementById("class");
years.forEach(y=>{let o=document.createElement("option");o.value=y.value;o.textContent=y.label;cls.appendChild(o);});

function continueExam(){
 const studentName=document.getElementById("name").value.trim();
 const regNumber=document.getElementById("reg").value.trim();
 selectedClass=cls.value;

 if(!studentName){
   alert("Please enter the student name.");
   return;
 }
 if(!regNumber){
   alert("Please enter the registration number.");
   return;
 }
 if(!selectedClass){
   alert("Please select a year.");
   return;
 }
 const box=document.getElementById("subjects");
 box.innerHTML="<h3>Select Subject</h3>";
 const examSchedule={mathematics:true,english:true};
 subjects.forEach(s=>{
   let b=document.createElement("button");
   b.textContent=s[0];
   const lockKey=regNumber+'_'+s[1];
   if(localStorage.getItem(lockKey)==='completed'){b.disabled=true;b.title='Completed';}
   if(examSchedule[s[1]]===false){b.disabled=true;}
   b.onclick=()=>{if(localStorage.getItem(lockKey)==='completed'){alert('You have already completed this subject. Contact the administrator if this is an error.');return;} selectedSubject=s[1];document.getElementById("subjects").classList.add("hidden");document.getElementById("instructions").classList.remove("hidden");};
   box.appendChild(b);
 });
 box.classList.remove("hidden");
 document.getElementById("candidate").classList.add("hidden");
}

async function startExam(){
 const res=await fetch(`questions/${selectedClass}/${selectedSubject}.json`);
 questions=await res.json();
 if(!Array.isArray(questions)){
   let flat=[];
   Object.keys(questions).forEach(k=>{
     if(Array.isArray(questions[k])){
       flat=flat.concat(questions[k]);
     }else if(questions[k] && Array.isArray(questions[k].questions)){
       const section=questions[k];
       section.questions.forEach((q,idx)=>{
         q.instruction = section.instruction || q.instruction || "";
         q.passageTitle = section.passage_title || section.passageTitle || section.title || q.passageTitle || "";
         q.passage = section.passage || q.passage || "";
       });
       flat=flat.concat(section.questions);
     }
   });
   questions=flat;
 }
 examStarted=true;
 index=0; answers={};
 document.getElementById("instructions").classList.add("hidden");
 document.getElementById("exam").classList.remove("hidden");
 renderQuestion();
 let sec=3600;
 const t=setInterval(()=>{
   sec--; document.getElementById("timer").textContent=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;
   if(sec===300){alert("5 minutes remaining.");}
   if(sec<=0){clearInterval(t);submitExam();}
 },1000);
}

function renderQuestion(){
 renderNavigator();
 const q=questions[index];
 let html='';
 if(q.instruction || q.passage){
   html += `<div style="border:1px solid #ccc;padding:10px;margin-bottom:15px;background:#f9f9f9;">`;
   if(q.instruction){ html += `<div style="font-weight:bold;margin-bottom:10px;">${q.instruction}</div>`; }
   if(q.passageTitle){ html += `<h3>${q.passageTitle}</h3>`; }
   if(q.passage){ html += `<p style="white-space:pre-wrap;">${q.passage}</p>`; }
   html += `</div>`;
 }
 html += `<h3>Question ${index+1}</h3><p>${q.question}</p>`;
 q.options.forEach((o,i)=>{
   html+=`<label><input type='radio' name='ans' value='${o}' ${answers[index]===o?'checked':''}> ${o}</label><br>`;
 });
 html+=`<div><button onclick='prevQuestion()' ${index===0?'disabled':''}>Previous</button>
<button onclick='nextQuestion()'>${index===questions.length-1?'Submit':'Next'}</button></div>`;
 document.getElementById("questionArea").innerHTML=html;
}
function nextQuestion(){
 const s=document.querySelector("input[name='ans']:checked");
 if(s) answers[index]=s.value;
 if(index<questions.length-1){index++;renderQuestion();} else submitExam();
}
async function submitExam(){
 let score=0;
 questions.forEach((q,i)=>{ if(answers[i]===q.answer) score++; });
 localStorage.setItem(document.getElementById('reg').value.trim()+'_'+selectedSubject,'completed');
 const payload={
studentName:document.getElementById("name").value,
regNumber:document.getElementById("reg").value,
class:selectedClass.replace("grade_","Year "),
subject:selectedSubject,
score,
total:questions.length,
percentage:((score/questions.length)*100).toFixed(2), position:'Pending'
};
 await fetch("save_result.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
 const params=new URLSearchParams({
 score:score,
 total:questions.length,
 percentage:payload.percentage,
 student:payload.studentName,
 subject:selectedSubject
 });
 window.location.href='result.html?'+params.toString();
}

function prevQuestion(){
 const s=document.querySelector("input[name='ans']:checked");
 if(s) answers[index]=s.value;
 if(index>0){index--;renderQuestion();}
}
function gotoQuestion(i){
 const s=document.querySelector("input[name='ans']:checked");
 if(s) answers[index]=s.value;
 index=i; renderQuestion();
}
function renderNavigator(){
 const nav=document.getElementById('navigator');
 if(!nav) return;
 nav.innerHTML=questions.map((q,i)=>`<button onclick="gotoQuestion(${i})">${i+1}</button>`).join('');
}

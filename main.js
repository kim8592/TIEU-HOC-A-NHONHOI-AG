// ===== CHUYỂN MÀN =====
function showScreen(id){
  document.querySelectorAll("section").forEach(s=>{
    s.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// ===== DỮ LIỆU =====
let students = [];
let questions = [];
let currentQ = 0;
let mode = "idle"; // idle | call | quiz
let questionLocked = false;
let lastGesture = "";
let fistStart = null;

// ===== LOAD DỮ LIỆU TỪ LOCALSTORAGE =====
window.addEventListener("DOMContentLoaded", () => {
  const savedStudents = localStorage.getItem("students");
  if(savedStudents){
    students = JSON.parse(savedStudents);
    const studentCountEl = document.getElementById("studentCount");
    if(studentCountEl) studentCountEl.innerText =
      "Đã lưu " + students.length + " học sinh (tải từ lần trước)";
  }

  const savedQuestions = localStorage.getItem("questions");
  if(savedQuestions){
    questions = JSON.parse(savedQuestions);
    const qCountEl = document.getElementById("qCount");
    if(qCountEl) qCountEl.innerText =
      "Đã tạo " + questions.length + " câu hỏi (tải từ lần trước)";
  }
});

// ===== DANH SÁCH HỌC SINH =====
function saveStudents(){
  const input = document.getElementById("studentInput").value;
  students = input.split("\n").map(s=>s.trim()).filter(s=>s);
  localStorage.setItem("students", JSON.stringify(students));
  const studentCountEl = document.getElementById("studentCount");
  if(studentCountEl) studentCountEl.innerText =
    "Đã lưu " + students.length + " học sinh";
}

// ===== RESET DANH SÁCH =====
function resetStudents(){
  if(confirm("Bạn có chắc muốn xoá toàn bộ danh sách học sinh?")){
    students = [];
    localStorage.removeItem("students");
    document.getElementById("studentInput").value = "";
    document.getElementById("studentCount").innerText = "Chưa có học sinh";
  }
}

// ===== CÂU HỎI =====
function addQuestion(){
  const q = document.getElementById("qText").value;
  const opts = document.querySelectorAll(".opt");
  const correct = document.getElementById("correct").value;

  if(!q || correct===""){
    alert("Thiếu câu hỏi hoặc đáp án đúng");
    return;
  }

  let answers = [];
  for(let o of opts){
    if(!o.value){
      alert("Thiếu đáp án");
      return;
    }
    answers.push(o.value);
  }

  questions.push({
    question:q,
    options:answers,
    correct:Number(correct)
  });

  localStorage.setItem("questions", JSON.stringify(questions));

  document.getElementById("qText").value="";
  opts.forEach(o=>o.value="");
  document.getElementById("correct").value="";
  const qCountEl = document.getElementById("qCount");
  if(qCountEl) qCountEl.innerText =
    "Đã tạo " + questions.length + " câu hỏi";
}

// ===== RESET CÂU HỎI =====
function resetQuestions(){
  if(confirm("Bạn có chắc muốn xoá toàn bộ câu hỏi?")){
    questions = [];
    localStorage.removeItem("questions");
    document.getElementById("qText").value = "";
    document.querySelectorAll(".opt").forEach(o=>o.value="");
    document.getElementById("correct").value = "";
    document.getElementById("qCount").innerText = "Chưa có câu hỏi";

    // Reset quiz nếu đang trình chiếu
    document.getElementById("quizQuestion").innerText = "";
    document.getElementById("quizOptions").innerHTML = "";
    document.getElementById("quizResult").innerText = "";
    questionLocked = false;
    currentQ = 0;
  }
}

// ===== GỌI TÊN =====
function callName(){
  if(students.length === 0){
    alert("Chưa có danh sách");
    return;
  }
  mode = "call";
  const name = students[Math.floor(Math.random()*students.length)];
  document.getElementById("nameDisplay").innerText = name;
}

// ===== QUIZ =====
function startQuiz(){
  if(questions.length === 0){
    alert("Chưa có câu hỏi");
    return;
  }
  mode = "quiz";
  currentQ = 0;
  showQuestion();
}

function showQuestion(){
  const q = questions[currentQ];
  document.getElementById("quizQuestion").innerText = q.question;
  document.getElementById("quizResult").innerText = "";

  const box = document.getElementById("quizOptions");
  box.innerHTML = "";

  q.options.forEach((opt,i)=>{
    const btn = document.createElement("button");
    btn.innerText = (i+1)+". "+opt;
    btn.onclick = ()=>checkAnswer(i);

    // Tự giãn nút theo độ dài chữ
    btn.style.width = "auto";
    btn.style.minWidth = "150px";
    btn.style.padding = "8px 12px";
    btn.style.margin = "5px 0";
    btn.style.display = "block";

    box.appendChild(btn);
  });

  questionLocked = false;
}

function checkAnswer(i){
  const q = questions[currentQ];
  const btns = document.querySelectorAll("#quizOptions button");

  if(questionLocked) return;

  if(i === q.correct){
    btns[i].classList.add("correct");
    document.getElementById("quizResult").innerText = "✅ ĐÚNG";
    questionLocked = true;
  } else {
    btns[i].classList.add("wrong");
    document.getElementById("quizResult").innerText = "❌ SAI";
    questionLocked = true;
    setTimeout(()=>{
      btns[i].classList.remove("wrong");
      document.getElementById("quizResult").innerText = "";
      questionLocked = false;
    }, 3000);
  }
}

function nextQuestion(){
  currentQ++;
  if(currentQ >= questions.length){
    document.getElementById("quizQuestion").innerText = "🎉 HẾT CÂU HỎI";
    document.getElementById("quizOptions").innerHTML = "";
    questionLocked = true;
    return;
  }
  showQuestion();
  questionLocked = false;
}

// ===== HAND TRACKING =====
function countFingers(hand){
  const tips = [8,12,16,20];
  let count = 0;
  tips.forEach(i=>{
    if(hand[i].y < hand[i-2].y) count++;
  });
  return count;
}

function onResults(results){
  if(!results.multiHandLandmarks || results.multiHandLandmarks.length===0){
    fistStart = null;
    return;
  }

  const hand = results.multiHandLandmarks[0];
  const fingers = countFingers(hand);

  // ✊ NẮM TAY 2 GIÂY
  if(fingers === 0){
    if(!fistStart) fistStart = Date.now();
    if(Date.now() - fistStart > 1000){
      fistStart = null;
      if(mode === "quiz"){
        nextQuestion();
      } else {
        mode = "idle";
        document.getElementById("nameDisplay").innerText = "";
        document.getElementById("quizQuestion").innerText = "";
        document.getElementById("quizOptions").innerHTML = "";
        document.getElementById("quizResult").innerText = "";
      }
    }
    return;
  } else {
    fistStart = null;
  }

  // ☝️ GỌI TÊN
  if(fingers === 1 && mode !== "quiz" && lastGesture !== "call"){
    lastGesture = "call";
    callName();
    setTimeout(()=>lastGesture="",1500);
    return;
  }

  // ✌️✋ TRẮC NGHIỆM
  if(mode === "quiz" && fingers>=1 && fingers<=4 && lastGesture!==fingers){
    lastGesture = fingers;
    if(!questionLocked){
      const btns = document.querySelectorAll("#quizOptions button");
      if(btns[fingers-1]) btns[fingers-1].click();
    }
    setTimeout(()=>lastGesture="",1000);
  }
}

// ===== KHỞI ĐỘNG CAMERA =====
const hands = new Hands({
  locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
});

hands.setOptions({
  maxNumHands:1,
  modelComplexity:1,
  minDetectionConfidence:0.7,
  minTrackingConfidence:0.7
});

hands.onResults(onResults);

const camera = new Camera(
  document.getElementById("inputVideo"),
  {
    onFrame: async()=>{ await hands.send({image:inputVideo}); },
    width:640,
    height:480
  }
);

camera.start();

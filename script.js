const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function openMenu(){
    sidebar.classList.add("active");
    overlay.classList.add("active");
}

overlay.onclick = function(){
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
};

function switchPage(pageId){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
    sidebar.classList.remove("active");
    overlay.classList.remove("active");

    // Reset deposit steps when navigating away
    if(pageId !== "depositPage") {
        document.getElementById('plansSection').classList.add('active');
        document.getElementById('formSection').classList.remove('active');
        document.getElementById('successSection').classList.remove('active');
    }

    // Reset withdraw page when leaving it
    if(pageId !== "withdrawPage") resetWithdrawPage();
}

/* SIMPLE TRANSACTIONS AND COPY */
function submitWithdraw(){
    const amount = document.getElementById("withdrawAmount").value;
    if(amount === "" || amount <= 0){ alert("Enter valid amount"); return; }
    const msg = document.getElementById("withdrawMsg");
    msg.style.display = "block";
    setTimeout(()=> msg.style.display="none",3000);
}

function submitTransfer(){
    const amount = document.getElementById("transferAmount").value;
    if(amount === "" || amount <= 0){ alert("Enter valid amount"); return; }
    const msg = document.getElementById("transferMsg");
    msg.style.display = "block";
    setTimeout(()=> msg.style.display="none",3000);
}

/* MULTI-STEP DEPOSIT FLOW */
const plans = document.querySelectorAll('.plan-card');
const plansSection = document.getElementById('plansSection');
const formSection = document.getElementById('formSection');
const successSection = document.getElementById('successSection');
const selectedPlanTitle = document.getElementById('selectedPlanTitle');
const depositForm = document.getElementById('depositForm');
const errorMsg = document.getElementById('errorMsg');
const amountInput = document.getElementById('amount');

let selectedPlan = "";
let minAmount = 0;
let maxAmount = 0;

plans.forEach(plan => {
  plan.addEventListener('click', () => {
    selectedPlan = plan.dataset.plan;
    minAmount = parseInt(plan.dataset.min);
    maxAmount = plan.dataset.max === "unlimited" ? Infinity : parseInt(plan.dataset.max);

    selectedPlanTitle.textContent = `Deposit - ${selectedPlan}`;
    amountInput.placeholder = maxAmount === Infinity
      ?` Minimum $${minAmount}`
      :` Between $${minAmount} and $${maxAmount}`;

    plansSection.classList.remove('active');
    formSection.classList.add('active');
  });
});

depositForm.addEventListener('submit', function(e) {
  e.preventDefault();
  errorMsg.textContent = "";

  const amount = parseFloat(amountInput.value);
  const method = document.getElementById('method').value;

  if (isNaN(amount) || amount < minAmount || amount > maxAmount) {
    if (maxAmount === Infinity) {
      errorMsg.textContent =` Amount must be at least $${minAmount}.`;
    } else {
      errorMsg.textContent = `Amount must be between $${minAmount} and $${maxAmount}.`;
    }
    return;
  }

  if (!method) {
    errorMsg.textContent = "Please select a payment method.";
    return;
  }

  formSection.classList.remove('active');
  successSection.classList.add('active');
});

/* COPY FUNCTIONS */
function copyWallet() {
  const walletText = document.getElementById('walletAddress').textContent;
  const feedback = document.getElementById('copyFeedback');

  navigator.clipboard.writeText(walletText).then(() => {
    feedback.style.display = "inline";
    setTimeout(() => { feedback.style.display = "none"; }, 2000);
  });
}

function copyReferral() {
  const refText = document.getElementById('refLink').textContent;
  navigator.clipboard.writeText(refText).then(() => {
    const msg = document.getElementById('copyMsg');
    msg.style.display = "block";
    setTimeout(() => msg.style.display = "none", 3000);
  });
}

function updateFileName() {
  const fileInput = document.getElementById('proofUpload');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const submitBtn = document.getElementById('submitProofBtn');

  if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = "Selected: " + fileInput.files[0].name;
    fileNameDisplay.style.color = "#0d3b66"; // Change green to navy when file is picked
    submitBtn.style.display = "block"; // Show the submit button
  }
}

function submitProof() {
  const statusMsg = document.getElementById('uploadStatus');
  const submitBtn = document.getElementById('submitProofBtn');

  statusMsg.style.color = "#0d3b66";
  statusMsg.textContent = "Processing upload...";
  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading...";

  // Simulate server delay
  setTimeout(() => {
    statusMsg.style.color = "#28a745";
    statusMsg.textContent = "Proof submitted successfully! Awaiting verification.";
    submitBtn.style.display = "none";
  }, 2500);
}





/* WITHDRAW MULTI-STEP FLOW */
const withdrawForm = document.getElementById('withdrawForm');
const withdrawError = document.getElementById('withdrawError');
const withdrawSuccess = document.getElementById('withdrawSuccessSection');
const withdrawFormSection = document.getElementById('withdrawFormSection');
const successAmount = document.getElementById('successAmount');
const successWallet = document.getElementById('successWallet');
const successAddress = document.getElementById('successAddress');

withdrawForm.addEventListener('submit', e => {
  e.preventDefault();
  withdrawError.textContent = "";

  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  const wallet = document.getElementById('withdrawWallet').value;
  const address = document.getElementById('withdrawAddress').value.trim();
  const userBalance = 12500;

  if(isNaN(amount) || amount < 100){
    withdrawError.textContent = "Minimum withdrawal amount is $100.";
    return;
  }
  if(amount > userBalance){
    withdrawError.textContent = "Cannot withdraw more than your balance.";
    return;
  }
  if(!wallet){
    withdrawError.textContent = "Please select a wallet type.";
    return;
  }
  if(!address){
    withdrawError.textContent = "Please enter your wallet address.";
    return;
  }

  // Show success details
  successAmount.textContent = `$${amount}`;
  successWallet.textContent = wallet;
  successAddress.textContent = address;

  withdrawFormSection.style.display = "none";
  withdrawSuccess.style.display = "block";
});

// Optional: Copy withdrawal details
function copyWithdrawDetails() {
  const details = ` Amount: ${successAmount.textContent}\nWallet: ${successWallet.textContent}\nAddress: ${successAddress.textContent}`;
  navigator.clipboard.writeText(details).then(() => {
    alert("Withdrawal details copied!");
  });
}

// Reset withdraw page when switching away
function resetWithdrawPage() {
  withdrawFormSection.style.display = "block";
  withdrawSuccess.style.display = "none";
  withdrawForm.reset();
  withdrawError.textContent = "";
}





/* TRANSACTIONS DATA */
const transactionsData = [
  {date:"15 Feb 2026", type:"deposit", amount:1000, status:"success", wallet:"BTC", address:"0xABC123XYZ"},
  {date:"14 Feb 2026", type:"withdrawal", amount:500, status:"pending", wallet:"USDT-TRC20", address:"TXX938494839"},
  {date:"12 Feb 2026", type:"transfer", amount:300, status:"success", wallet:"ETH", address:"0xETH456XYZ"},
  {date:"10 Feb 2026", type:"deposit", amount:2000, status:"failed", wallet:"BNB", address:"0xBNB789XYZ"},
  {date:"08 Feb 2026", type:"withdrawal", amount:1500, status:"success", wallet:"USDT-ERC20", address:"0xUSDT987ABC"}
];

const transactionsBody = document.getElementById("transactionsBody");
const filterType = document.getElementById("filterType");
const searchInput = document.getElementById("searchInput");
const noTransactions = document.getElementById("noTransactions");

/* Render Transactions */
function renderTransactions(filter="all", search=""){
  transactionsBody.innerHTML = "";
  let filtered = transactionsData.filter(tx => {
    const matchType = filter === "all" || tx.type === filter;
    const matchSearch = tx.date.includes(search) || 
                        tx.amount.toString().includes(search) ||
                        tx.wallet.toLowerCase().includes(search.toLowerCase()) ||
                        tx.address.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  if(filtered.length === 0){
    noTransactions.style.display = "block";
    return;
  } else {
    noTransactions.style.display = "none";
  }

  filtered.forEach(tx => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${tx.date}</td>
      <td style="text-transform:capitalize;">${tx.type}</td>
      <td>$${tx.amount}</td>
      <td class="status-${tx.status}">${tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</td>
      <td>${tx.wallet}</td>
      <td>${tx.address}</td>`
    ;
    transactionsBody.appendChild(tr);
  });
}

/* Initial render */
renderTransactions();

/* Filter & Search Events */
filterType.addEventListener("change", ()=> renderTransactions(filterType.value, searchInput.value));
searchInput.addEventListener("input", ()=> renderTransactions(filterType.value, searchInput.value));




// --- Wallet Page JS ---
const walletForm = document.getElementById('walletForm');
const walletType = document.getElementById('walletType');
const walletAddress = document.getElementById('walletAddress');
const walletsContainer = document.getElementById('walletsContainer');
const walletMsg = document.getElementById('walletMsg');
const noWallets = document.getElementById('noWallets');

// Load wallets from localStorage
let wallets = JSON.parse(localStorage.getItem('wallets')) || [];
renderWallets();

// Add Wallet
walletForm.addEventListener('submit', e => {
  e.preventDefault();
  const type = walletType.value;
  const address = walletAddress.value.trim();

  if (!type || !address) {
    showWalletMsg("Please fill in all fields.", "error");
    return;
  }

  // Prevent duplicate wallet addresses
  if(wallets.some(w=> w.address === address)){
    showWalletMsg("Wallet address already exists.", "error");
    return;
  }

  wallets.push({ type, address });
  localStorage.setItem('wallets', JSON.stringify(wallets));

  walletForm.reset();
  showWalletMsg("✅ Wallet added successfully!", "success");
  renderWallets();
});


// Render Wallets
function renderWallets() {
  walletsContainer.innerHTML = "";

  if(wallets.length === 0){
    noWallets.style.display = "block";
    return;
  } else {
    noWallets.style.display = "none";
  }

  wallets.forEach((w,index) => {
    const card = document.createElement('div');
    card.className = "wallet-card";
    card.innerHTML = `
      <h4>${w.type}</h4>
      <p><strong>Address:</strong> ${w.address}</p>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="copy-btn" onclick="copyWallet('${w.address}')">Copy</button>
        <button class="remove-btn" onclick="removeWallet(${index})">Remove</button>
      </div>`
    ;
    walletsContainer.appendChild(card);
  });
}

// Copy Wallet Address
function copyWallet(address){
  navigator.clipboard.writeText(address).then(()=>{
    showWalletMsg("Wallet address copied!", "success");
  });
}

// Remove Wallet
function removeWallet(index){
  if(confirm("Are you sure you want to remove this wallet?")){
    wallets.splice(index,1);
    localStorage.setItem('wallets', JSON.stringify(wallets));
    showWalletMsg("Wallet removed.", "error");
    renderWallets();
  }
}

// Show message
function showWalletMsg(textToDisplay) { 
  const statusMsg = document.getElementById('uploadStatus');
  if (statusMsg) {
    // FIX: Use the parameter 'textToDisplay' instead of undefined 'message'
    statusMsg.textContent = textToDisplay;
    statusMsg.style.color = "#ff8c00";
    
    // Auto-hide after 3 seconds
    setTimeout(() => { statusMsg.textContent = ""; }, 3000);
  }
}





// --- SETTINGS PAGE JS ---

// Profile form
const profileForm = document.getElementById('profileForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const profileMsg = document.getElementById('profileMsg');

// Load profile from localStorage
let profile = JSON.parse(localStorage.getItem('profile')) || {username:'', email:''};
usernameInput.value = profile.username;
emailInput.value = profile.email;

profileForm.addEventListener('submit', e => {
  e.preventDefault();
  profile.username = usernameInput.value.trim();
  profile.email = emailInput.value.trim();

  if(!profile.username || !profile.email){
    showMsg(profileMsg, "Please fill all fields.", "error");
    return;
  }

  localStorage.setItem('profile', JSON.stringify(profile));
  showMsg(profileMsg, "Profile updated successfully!", "success");
});

// Password form
const passwordForm = document.getElementById('passwordForm');
const currentPass = document.getElementById('currentPass');
const newPass = document.getElementById('newPass');
const confirmPass = document.getElementById('confirmPass');
const passwordMsg = document.getElementById('passwordMsg');

passwordForm.addEventListener('submit', e => {
  e.preventDefault();
  const storedPass = localStorage.getItem('password') || "123456"; // default password

  if(currentPass.value !== storedPass){
    showMsg(passwordMsg, "Current password is incorrect.", "error");
    return;
  }

  if(newPass.value !== confirmPass.value){
    showMsg(passwordMsg, "Passwords do not match.", "error");
    return;
  }

  localStorage.setItem('password', newPass.value);
  currentPass.value = newPass.value = confirmPass.value = "";
  showMsg(passwordMsg, "Password changed successfully!", "success");
});

// Theme select
const themeSelect = document.getElementById('themeSelect');
themeSelect.value = localStorage.getItem('theme') || "dark";
themeSelect.addEventListener('change', ()=>{
  const theme = themeSelect.value;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
});

// Reset Account
const resetBtn = document.getElementById('resetAccount');
const resetMsg = document.getElementById('resetMsg');
resetBtn.addEventListener('click', ()=>{
  if(confirm("Are you sure you want to reset your account? All data will be lost.")){
    localStorage.clear();
    showMsg(resetMsg,"Account reset successfully!","success");
    setTimeout(()=> location.reload(),1500);
  }
});

// Helper to show message
function showMsg(element,text,type){
  element.textContent = text;
  element.className = message `${type}`;
  element.style.opacity = "1";
  setTimeout(()=> element.style.opacity="0",3000);
}





// --- SUPPORT PAGE JS ---
const supportForm = document.getElementById('supportForm');
const supportMsg = document.getElementById('supportMsg');

supportForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('supportName').value.trim();
  const email = document.getElementById('supportEmail').value.trim();
  const subject = document.getElementById('supportSubject').value.trim();
  const message = document.getElementById('supportMessage').value.trim();

  if(!name || !email || !subject || !message){
    showMsg(supportMsg, "Please fill in all fields.", "error");
    return;
  }

  // Save the support ticket to localStorage (for demo)
  let tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
  tickets.push({name, email, subject, message, date: new Date().toLocaleString()});
  localStorage.setItem('supportTickets', JSON.stringify(tickets));

  supportForm.reset();
  showMsg(supportMsg, "✅ Support ticket submitted successfully!", "success");
});
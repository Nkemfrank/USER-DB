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

// Success detail elements
const successAccount = document.getElementById('successAccount');
const successAmount = document.getElementById('successAmount');
const successWallet = document.getElementById('successWallet');
const successAddress = document.getElementById('successAddress');

withdrawForm.addEventListener('submit', e => {
  e.preventDefault();
  withdrawError.textContent = "";

  // Get values
  const account = document.getElementById('withdrawAccount').value;
  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  const wallet = document.getElementById('withdrawWallet').value;
  const address = document.getElementById('withdrawAddress').value.trim();
  
  // Example Balance
  const userBalance = 12500;

  // Validation
  if(!account){
    withdrawError.textContent = "Please select the account you wish to withdraw from.";
    return;
  }
  if(isNaN(amount) || amount < 100){
    withdrawError.textContent = "Minimum withdrawal amount is $100.";
    return;
  }
  if(amount > userBalance){
    withdrawError.textContent = "Cannot withdraw more than your available balance.";
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
  successAccount.textContent = account;
  successAmount.textContent = `$${amount.toLocaleString()}`;
  successWallet.textContent = wallet;
  successAddress.textContent = address;

  // UI Switch
  withdrawFormSection.style.display = "none";
  withdrawSuccess.style.display = "block";
});

// Copy withdrawal details
function copyWithdrawDetails() {
  const details =`Account: ${successAccount.textContent}\nAmount: ${successAmount.textContent}\nWallet: ${successWallet.textContent}\nAddress: ${successAddress.textContent}`;
  navigator.clipboard.writeText(details).then(() => {
    alert("Withdrawal details copied!");
  });
}

// Reset withdraw page
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
// --- Elements Selection ---
const walletForm = document.getElementById('walletForm');
const walletsContainer = document.getElementById('walletsContainer');
const noWalletsMsg = document.getElementById('noWallets');
const walletFeedback = document.getElementById('walletFeedback');

// Load wallets from LocalStorage
let myWallets = JSON.parse(localStorage.getItem('port_prime_user_wallets')) || [];

// Initial render of existing wallets
renderAllWallets();

walletForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const typeSelect = document.getElementById('newWalletType');
    const addressInput = document.getElementById('newWalletAddress');

    // SAFE ACCESS: Check if element exists before calling .trim()
    if (!addressInput || !typeSelect) {
        console.error("Wallet input elements missing from DOM.");
        return;
    }

    const type = typeSelect.value;
    const address = addressInput.value.trim();

    if (!type || !address) {
        displayWalletStatus("Please fill in all fields", "#ff4d4d");
        return;
    }

    // Check for duplicate addresses
    if (myWallets.some(w => w.address === address)) {
        displayWalletStatus("This address is already saved", "#ff8c00");
        return;
    }

    // Add new wallet to array
    myWallets.push({ type, address });
    
    // Save to browser memory and refresh list
    saveToLocalStorage();
    
    walletForm.reset();
    displayWalletStatus("✅ Wallet added successfully!", "#28a745");
});

function renderAllWallets() {
    walletsContainer.innerHTML = "";

    if (myWallets.length === 0) {
        noWalletsMsg.style.display = "block";
        return;
    }

    noWalletsMsg.style.display = "none";

    myWallets.forEach((wallet, index) => {
        const card = document.createElement('div');
        // Reusing your existing responsive card styles
        card.className = "stat-box"; 
        card.style.textAlign = "left";
        
        card.innerHTML = `
            <div style="color: #ff8c00; font-weight: bold; font-size: 14px; margin-bottom: 5px;">${wallet.type}</div>
            <div style="font-size: 11px; word-break: break-all; color: #ccc; margin-bottom: 15px;">${wallet.address}</div>
            <div style="display: flex; gap: 8px;">
                <button onclick="copyWalletText('${wallet.address}')" class="copy-btn" style="flex: 1; padding: 6px; font-size: 11px;">Copy</button>
                <button onclick="deleteWalletEntry(${index})" style="flex: 1; padding: 6px; font-size: 11px; background: rgba(255,0,0,0.1); color: #ff4d4d; border: 1px solid #ff4d4d; border-radius: 4px; cursor: pointer;">Delete</button>
            </div>`
        ;
        walletsContainer.appendChild(card);
    });
}

function deleteWalletEntry(index) {
    if (confirm("Permanently delete this wallet?")) {
        myWallets.splice(index, 1);
        saveToLocalStorage();
    }
}

function copyWalletText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Wallet address copied to clipboard!");
    });
}

function saveToLocalStorage() {
    localStorage.setItem('port_prime_user_wallets', JSON.stringify(myWallets));
    renderAllWallets();
}

// FIX FOR THE 'MESSAGE IS NOT DEFINED' ERROR
function displayWalletStatus(text, color) {
    if (walletFeedback) {
        walletFeedback.textContent = text;
        walletFeedback.style.color = color;
        setTimeout(() => {
            walletFeedback.textContent = "";
        }, 3000);
    }
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




// Function to handle clicking a plan from the Plans Page
document.querySelectorAll('#investmentPlans .plan-card').forEach(card => {
    card.addEventListener('click', () => {
        const planName = card.dataset.plan;
        const min = card.dataset.min;
        const max = card.dataset.max;

        // 1. Switch to the Deposit Page
        switchPage('depositPage');

        // 2. Trigger the existing deposit logic
        // We find the matching card on the deposit page and click it programmatically
        const targetPlan = document.querySelector(`#depositPage .plan-card[data-plan="${planName}"]`);
        if (targetPlan) {
            targetPlan.click();
        }
    });
});

// Update your switchPage function to handle scrolling to top
function switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });

    // Show selected page
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active');
        activePage.style.display = 'block';
    }

    // Close sidebar on mobile
    if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    }
    
    window.scrollTo(0, 0);
}



// Function to update ongoing investments (example logic)
function updateInvestmentProgress() {
    // In a real app, you would fetch these from a database
    const investments = document.querySelectorAll('.ongoing-card');
    
    investments.forEach(card => {
        // You could dynamically update the 'Ends in' timer here
        // Or update the progress bar width based on time elapsed
    });
}


// Function for the Re-invest button
function reinvest(planName, amount) {
    // We use a custom styled confirmation if possible, but alert works for now
    const confirmed = confirm(`Are you sure you want to re-invest your $${amount} capital back into ${planName}?`);
    
    if (confirmed) {
        // Show the orange feedback message we built earlier
        showWalletMsg("Success! Capital re-invested. Your new plan is now active.");
        
        // In a real scenario, you'd trigger a function here to 
        // refresh the ongoingInvestment list from your database
    }
}

// Function for Withdraw Profit (navigates to the withdraw page)
function withdrawInvestmentProfit(amount) {
    // Pre-fill the withdrawal amount if you want to be fancy
    const withdrawInput = document.getElementById('withdrawAmount');
    if(withdrawInput) {
        withdrawInput.value = amount;
    }
    
    // Navigate to withdrawal page
    switchPage('withdrawPage');
    
    // Show a helpful tip
    setTimeout(() => {
        showWalletMsg(`Ready to withdraw your $${amount} profit.`);
    }, 500);
}


function startInvestmentTimers() {
    setInterval(() => {
        const timers = document.querySelectorAll('.timer');

        timers.forEach(timer => {
            const endTime = new Date(timer.getAttribute('data-endtime')).getTime();
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                timer.innerHTML = "Completed!";
                timer.style.color = "#28a745";
                // Optionally: trigger a function to refresh the card to "Completed" state
                return;
            }

            // Time calculations for hours, minutes and seconds
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result
            timer.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        });
    }, 1000);
}

// Call the function when the script loads
startInvestmentTimers();


// Calculate progress percentage (Example assumes a 48-hour plan)
const totalDuration = 48 * 60 * 60 * 1000; // 48 hours in ms
const elapsed = totalDuration - distance;
const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

// Find the bar related to this specific timer and update it
const card = timer.closest('.ongoing-card');
const bar = card.querySelector('.progress-bar');
if (bar) {
    bar.style.width = progressPercent + "%";
}



function copyReferralLink() {
    const linkText = document.getElementById('userRefLink').innerText;
    const msg = document.getElementById('refCopyMsg');

    // Attempt to copy to clipboard
    navigator.clipboard.writeText(linkText).then(() => {
        msg.style.display = 'block';
        // Hide message after 3 seconds
        setTimeout(() => {
            msg.style.display = 'none';
        }, 3000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}



// Preview Profile Image
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('profileDisplay');
        output.src = reader.result;
        // Save image string to localStorage (optional, but keep it small)
        localStorage.setItem('profile_img', reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
}

// --- Profile Image Preview ---
function previewProfileImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('profileDisplay').src = reader.result;
        // Optional: Save image to localStorage
        localStorage.setItem('port_prime_avatar', reader.result);
    };
    reader.readAsDataURL(file);
}

// --- Profile Data Management ---
// Use a block-scoped listener to prevent "Identifier already declared" errors
document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('profileUpdateForm');
    
    // Load existing data if available
    const savedData = JSON.parse(localStorage.getItem('port_prime_user_profile'));
    if (savedData) {
        if(document.getElementById('inputFullName')) document.getElementById('inputFullName').value = savedData.fullName || "";
        if(document.getElementById('inputEmail')) document.getElementById('inputEmail').value = savedData.email || "";
        if(document.getElementById('topHeaderName')) document.getElementById('topHeaderName').textContent = savedData.fullName || "User Name";
    }

    if (updateForm) {
        updateForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Unique IDs prevent the 'trim' of undefined error
            const nameVal = document.getElementById('inputFullName').value.trim();
            const emailVal = document.getElementById('inputEmail').value.trim();

            if (!nameVal || !emailVal) {
                showProfileStatus("Please fill required fields", "#ff4d4d");
                return;
            }

            // Save to persistence
            const profileObj = { fullName: nameVal, email: emailVal };
            localStorage.setItem('port_prime_user_profile', JSON.stringify(profileObj));

            // Update UI Header immediately
            document.getElementById('topHeaderName').textContent = nameVal;

            showProfileStatus("✅ Profile updated successfully!", "#28a745");
        });
    }
});

function showProfileStatus(text, color) {
    const feedback = document.getElementById('profileUpdateMsg');
    if (feedback) {
        feedback.textContent = text;
        feedback.style.color = color;
        setTimeout(() => { feedback.textContent = ""; }, 3000);
    }
}



function openLogoutModal() {
    document.getElementById('logoutModal').style.display = 'flex';
}

function closeLogoutModal() {
    document.getElementById('logoutModal').style.display = 'none';
}

function executeLogout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = "login.html";
}
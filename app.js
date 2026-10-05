/* =========================================================
   EXPENSE SPLIT
   COMPLETE JAVASCRIPT
   LOGIN + EXPENSES + PARTICIPANTS + BALANCES + DELETE
   ========================================================= */


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const USERS_KEY = "expenseSplit_users";
const EXPENSES_KEY = "expenseSplit_expenses";
const PAYMENTS_KEY = "expenseSplit_payments";
const CURRENT_USER_KEY = "expenseSplit_currentUser";


/* =========================================================
   DEFAULT ADMIN
   ========================================================= */

const DEFAULT_ADMIN = {
    id: "admin_001",
    name: "Administrator",
    email: "admin@expensesplit.com",
    password: "admin123",
    role: "admin",
    status: "Active"
};


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let users = [];
let expenses = [];
let payments = [];
let currentUser = null;


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeStorage();

    loadData();

    setupAuthentication();

    setupNavigation();

    setupForms();

    setupParticipantSystem();

    restoreSession();

});


/* =========================================================
   INITIALIZE STORAGE
   ========================================================= */

function initializeStorage() {

    let storedUsers = [];

    try {

        storedUsers =
            JSON.parse(
                localStorage.getItem(USERS_KEY)
            ) || [];

    } catch (error) {

        storedUsers = [];

    }


    if (!Array.isArray(storedUsers)) {

        storedUsers = [];

    }


    const adminExists =
        storedUsers.some(function (user) {

            return (
                user.role === "admin" &&
                String(user.email).toLowerCase() ===
                "admin@expensesplit.com"
            );

        });


    if (!adminExists) {

        storedUsers.push(DEFAULT_ADMIN);

    }


    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(storedUsers)
    );


    if (!localStorage.getItem(EXPENSES_KEY)) {

        localStorage.setItem(
            EXPENSES_KEY,
            JSON.stringify([])
        );

    }


    if (!localStorage.getItem(PAYMENTS_KEY)) {

        localStorage.setItem(
            PAYMENTS_KEY,
            JSON.stringify([])
        );

    }

}


/* =========================================================
   LOAD DATA
   ========================================================= */

function loadData() {

    try {

        users =
            JSON.parse(
                localStorage.getItem(USERS_KEY)
            ) || [];

    } catch (error) {

        users = [];

    }


    try {

        expenses =
            JSON.parse(
                localStorage.getItem(EXPENSES_KEY)
            ) || [];

    } catch (error) {

        expenses = [];

    }


    try {

        payments =
            JSON.parse(
                localStorage.getItem(PAYMENTS_KEY)
            ) || [];

    } catch (error) {

        payments = [];

    }


    if (!Array.isArray(users)) {
        users = [];
    }

    if (!Array.isArray(expenses)) {
        expenses = [];
    }

    if (!Array.isArray(payments)) {
        payments = [];
    }

}


/* =========================================================
   SAVE DATA
   ========================================================= */

function saveData() {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );


    localStorage.setItem(
        EXPENSES_KEY,
        JSON.stringify(expenses)
    );


    localStorage.setItem(
        PAYMENTS_KEY,
        JSON.stringify(payments)
    );

}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

function setupAuthentication() {

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");

    const adminForm =
        document.getElementById("adminLoginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleUserLogin
        );

    }


    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            handleSignup
        );

    }


    if (adminForm) {

        adminForm.addEventListener(
            "submit",
            handleAdminLogin
        );

    }


    const signupButton =
        document.getElementById("showSignupBtn");


    if (signupButton) {

        signupButton.addEventListener(
            "click",
            function () {

                showAuthBox("signupBox");

            }
        );

    }


    const loginButton =
        document.getElementById("showLoginBtn");


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            function () {

                showAuthBox("loginBox");

            }
        );

    }


    const adminButton =
        document.getElementById("showAdminLoginBtn");


    if (adminButton) {

        adminButton.addEventListener(
            "click",
            function () {

                showAuthBox("adminLoginBox");

            }
        );

    }


    const backButton =
        document.getElementById("backToUserLoginBtn");


    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                showAuthBox("loginBox");

            }
        );

    }

}


/* =========================================================
   SHOW AUTH BOX
   ========================================================= */

function showAuthBox(boxId) {

    [
        "loginBox",
        "signupBox",
        "adminLoginBox"
    ].forEach(function (id) {

        const box =
            document.getElementById(id);

        if (box) {

            box.classList.add("hidden");

        }

    });


    const selected =
        document.getElementById(boxId);


    if (selected) {

        selected.classList.remove("hidden");

    }

}


/* =========================================================
   SIGN UP
   ========================================================= */

function handleSignup(event) {

    event.preventDefault();

    const name =
        document
            .getElementById("signupName")
            .value
            .trim();

    const email =
        document
            .getElementById("signupEmail")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("signupPassword")
            .value;


    if (!name || !email || !password) {

        alert("Please fill in all fields.");

        return;

    }


    if (password.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;

    }


    const exists =
        users.some(function (user) {

            return (
                String(user.email)
                    .toLowerCase() ===
                email
            );

        });


    if (exists) {

        alert(
            "An account with this email already exists."
        );

        return;

    }


    users.push({

        id:
            "user_" + Date.now(),

        name:
            name,

        email:
            email,

        password:
            password,

        role:
            "user",

        status:
            "Active"

    });


    saveData();


    alert(
        "Account created successfully!"
    );


    document
        .getElementById("signupForm")
        .reset();


    document
        .getElementById("loginEmail")
        .value = email;


    showAuthBox("loginBox");

}


/* =========================================================
   USER LOGIN
   ========================================================= */

function handleUserLogin(event) {

    event.preventDefault();

    loadData();


    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("loginPassword")
            .value;


    const user =
        users.find(function (item) {

            return (

                String(item.email)
                    .trim()
                    .toLowerCase() ===
                email

                &&

                String(item.password) ===
                password

                &&

                item.role === "user"

            );

        });


    if (!user) {

        alert(
            "Invalid email or password."
        );

        return;

    }


    if (user.status !== "Active") {

        alert(
            "Your account is inactive."
        );

        return;

    }


    currentUser = user;


    localStorage.setItem(
        CURRENT_USER_KEY,
        user.id
    );


    document
        .getElementById("loginForm")
        .reset();


    showUserApplication();

}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

function handleAdminLogin(event) {

    event.preventDefault();

    loadData();


    const email =
        document
            .getElementById("adminEmail")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("adminPassword")
            .value;


    const admin =
        users.find(function (user) {

            return (

                String(user.email)
                    .toLowerCase() ===
                email

                &&

                String(user.password) ===
                password

                &&

                user.role === "admin"

            );

        });


    if (!admin) {

        alert(
            "Invalid administrator credentials."
        );

        return;

    }


    currentUser = admin;


    localStorage.setItem(
        CURRENT_USER_KEY,
        admin.id
    );


    showAdminApplication();

}


/* =========================================================
   RESTORE SESSION
   ========================================================= */

function restoreSession() {

    const savedId =
        localStorage.getItem(
            CURRENT_USER_KEY
        );


    if (!savedId) {

        showAuthentication();

        return;

    }


    const user =
        users.find(function (item) {

            return item.id === savedId;

        });


    if (!user) {

        localStorage.removeItem(
            CURRENT_USER_KEY
        );

        showAuthentication();

        return;

    }


    currentUser = user;


    if (user.role === "admin") {

        showAdminApplication();

    } else {

        showUserApplication();

    }

}


/* =========================================================
   SHOW AUTHENTICATION
   ========================================================= */

function showAuthentication() {

    document
        .getElementById("authPage")
        .classList.remove("hidden");


    document
        .getElementById("userApp")
        .classList.add("hidden");


    document
        .getElementById("adminApp")
        .classList.add("hidden");


    showAuthBox("loginBox");

}


/* =========================================================
   SHOW USER APPLICATION
   ========================================================= */

function showUserApplication() {

    document
        .getElementById("authPage")
        .classList.add("hidden");


    document
        .getElementById("adminApp")
        .classList.add("hidden");


    document
        .getElementById("userApp")
        .classList.remove("hidden");


    updateUserHeader();

    createInitialParticipant();

    renderEverything();

}


/* =========================================================
   SHOW ADMIN APPLICATION
   ========================================================= */

function showAdminApplication() {

    document
        .getElementById("authPage")
        .classList.add("hidden");


    document
        .getElementById("userApp")
        .classList.add("hidden");


    document
        .getElementById("adminApp")
        .classList.remove("hidden");


    renderAdminEverything();

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    currentUser = null;


    localStorage.removeItem(
        CURRENT_USER_KEY
    );


    showAuthentication();

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(".nav-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    switchUserSection(
                        button.dataset.section
                    );

                }
            );

        });


    document
        .querySelectorAll(".text-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    switchUserSection(
                        button.dataset.section
                    );

                }
            );

        });


    document
        .querySelectorAll(".admin-nav-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    switchAdminSection(
                        button.dataset.adminSection
                    );

                }
            );

        });

}


/* =========================================================
   USER NAVIGATION
   ========================================================= */

function switchUserSection(sectionId) {

    document
        .querySelectorAll(".content-section")
        .forEach(function (section) {

            section.classList.remove(
                "active-section"
            );

        });


    const section =
        document.getElementById(sectionId);


    if (section) {

        section.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(function (button) {

            button.classList.remove("active");


            if (
                button.dataset.section ===
                sectionId
            ) {

                button.classList.add("active");

            }

        });

}


/* =========================================================
   ADMIN NAVIGATION
   ========================================================= */

function switchAdminSection(sectionId) {

    document
        .querySelectorAll(".admin-content-section")
        .forEach(function (section) {

            section.classList.remove(
                "active-section"
            );

        });


    const section =
        document.getElementById(sectionId);


    if (section) {

        section.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(".admin-nav-btn")
        .forEach(function (button) {

            button.classList.remove("active");


            if (
                button.dataset.adminSection ===
                sectionId
            ) {

                button.classList.add("active");

            }

        });

}


/* =========================================================
   FORMS
   ========================================================= */

function setupForms() {

    const logoutButton =
        document.getElementById("logoutBtn");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }


    const adminLogout =
        document.getElementById("adminLogoutBtn");


    if (adminLogout) {

        adminLogout.addEventListener(
            "click",
            logout
        );

    }


    const expenseForm =
        document.getElementById("expenseForm");


    if (expenseForm) {

        expenseForm.addEventListener(
            "submit",
            handleAddExpense
        );

    }

}


/* =========================================================
   PARTICIPANT SYSTEM
   ========================================================= */

function setupParticipantSystem() {

    const addButton =
        document.getElementById(
            "addParticipantBtn"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            addParticipant
        );

    }

}


/* =========================================================
   CREATE INITIAL PARTICIPANT
   ========================================================= */

function createInitialParticipant() {

    const list =
        document.getElementById(
            "participantsList"
        );


    if (!list) {
        return;
    }


    if (
        list.querySelectorAll(
            ".participant-row"
        ).length === 0
    ) {

        addParticipant();

    }

}


/* =========================================================
   ADD PARTICIPANT
   ========================================================= */

function addParticipant() {

    const list =
        document.getElementById(
            "participantsList"
        );


    if (!list) {
        return;
    }


    const row =
        document.createElement("div");


    row.className =
        "participant-row";


    row.innerHTML = `

        <input
            type="text"
            class="participant-input"
            placeholder="Enter participant name"
            autocomplete="off"
        >

        <button
            type="button"
            class="remove-participant-btn"
            title="Remove participant"
        >

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    list.appendChild(row);


    const removeButton =
        row.querySelector(
            ".remove-participant-btn"
        );


    removeButton.addEventListener(
        "click",
        function () {

            const rows =
                list.querySelectorAll(
                    ".participant-row"
                );


            if (rows.length <= 1) {

                row
                    .querySelector(
                        ".participant-input"
                    )
                    .value = "";

                return;

            }


            row.remove();

        }
    );


    row
        .querySelector(
            ".participant-input"
        )
        .focus();

}


/* =========================================================
   GET PARTICIPANTS
   ========================================================= */

function getParticipantNames() {

    const inputs =
        document.querySelectorAll(
            ".participant-input"
        );


    const names = [];


    inputs.forEach(function (input) {

        const name =
            input.value.trim();


        if (name) {

            names.push(name);

        }

    });


    return names;

}


/* =========================================================
   ADD EXPENSE
   ========================================================= */

function handleAddExpense(event) {

    event.preventDefault();


    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;

    }


    const description =
        document
            .getElementById(
                "expenseDescription"
            )
            .value
            .trim();


    const amount =
        parseFloat(
            document
                .getElementById(
                    "expenseAmount"
                )
                .value
        );


    const payerName =
        document
            .getElementById(
                "expensePayer"
            )
            .value
            .trim();


    const splitMethod =
        document
            .getElementById(
                "splitMethod"
            )
            .value;


    const participantNames =
        getParticipantNames();


    if (!description) {

        alert(
            "Please enter an expense name."
        );

        return;

    }


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return;

    }


    if (!payerName) {

        alert(
            "Please enter who paid."
        );

        return;

    }


    if (
        participantNames.length === 0
    ) {

        alert(
            "Please enter at least one participant."
        );

        return;

    }


    const payerIncluded =
        participantNames.some(function (name) {

            return (
                name.toLowerCase() ===
                payerName.toLowerCase()
            );

        });


    if (!payerIncluded) {

        const addPayer =
            confirm(
                "The person who paid is not listed as a participant.\n\n" +
                "Would you like to automatically add " +
                payerName +
                " as a participant?"
            );


        if (addPayer) {

            participantNames.push(
                payerName
            );

        } else {

            return;

        }

    }


    const peopleCount =
        participantNames.length;


    const share =
        amount / peopleCount;


    const roundedShare =
        Math.round(
            share * 100
        ) / 100;


    const expense = {

        id:
            "expense_" +
            Date.now(),

        description:
            description,

        amount:
            Number(
                amount.toFixed(2)
            ),

        payerName:
            payerName,

        splitMethod:
            splitMethod,

        participants:
            participantNames,

        sharePerPerson:
            roundedShare,

        date:
            new Date().toLocaleString(),

        createdBy:
            currentUser.id,

        status:
            "Recorded"

    };


    expenses.unshift(expense);


    createPaymentsForExpense(
        expense
    );


    saveData();


    document
        .getElementById(
            "expenseForm"
        )
        .reset();


    document
        .getElementById(
            "participantsList"
        )
        .innerHTML = "";


    addParticipant();


    renderEverything();

    renderAdminEverything();


    alert(
        "Expense added successfully!"
    );

}


/* =========================================================
   CREATE PAYMENT RECORDS
   ========================================================= */

function createPaymentsForExpense(
    expense
) {

    const share =
        expense.sharePerPerson;


    expense.participants.forEach(
        function (participant) {

            if (
                participant.toLowerCase() ===
                expense.payerName.toLowerCase()
            ) {

                return;

            }


            payments.push({

                id:
                    "payment_" +
                    Date.now() +
                    "_" +
                    Math.random()
                        .toString(36)
                        .substring(2, 8),

                expenseId:
                    expense.id,

                fromName:
                    participant,

                toName:
                    expense.payerName,

                amount:
                    share,

                status:
                    "Pending"

            });

        }
    );

}


/* =========================================================
   DELETE EXPENSE
   ========================================================= */

function deleteExpense(
    expenseId
) {

    const expense =
        expenses.find(function (item) {

            return (
                item.id ===
                expenseId
            );

        });


    if (!expense) {

        alert(
            "Expense not found."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this expense?\n\n" +
            expense.description +
            " - " +
            formatCurrency(
                expense.amount
            ) +
            "\n\n" +
            "This will also remove its related payment and balance records."
        );


    if (!confirmed) {

        return;

    }


    /*
       Remove the expense.
    */

    expenses =
        expenses.filter(function (item) {

            return (
                item.id !==
                expenseId
            );

        });


    /*
       Remove payment records
       belonging to this expense.
    */

    payments =
        payments.filter(function (payment) {

            return (
                payment.expenseId !==
                expenseId
            );

        });


    saveData();


    /*
       Refresh everything.
    */

    renderEverything();

    renderAdminEverything();


    alert(
        "Expense deleted successfully."
    );

}


/* =========================================================
   BALANCE CALCULATION
   ========================================================= */

function calculateBalances() {

    let youOwe = 0;

    let youReceive = 0;

    let settled = 0;


    const oweDetails = [];

    const receiveDetails = [];


    payments.forEach(function (payment) {

        if (
            payment.status ===
            "Paid"
        ) {

            if (
                isCurrentUserName(
                    payment.fromName
                )
            ) {

                settled +=
                    Number(
                        payment.amount
                    );

            }

            return;

        }


        if (
            isCurrentUserName(
                payment.fromName
            )
        ) {

            youOwe +=
                Number(
                    payment.amount
                );


            oweDetails.push({

                name:
                    payment.toName,

                amount:
                    Number(
                        payment.amount
                    ),

                paymentId:
                    payment.id

            });

        }


        if (
            isCurrentUserName(
                payment.toName
            )
        ) {

            youReceive +=
                Number(
                    payment.amount
                );


            receiveDetails.push({

                name:
                    payment.fromName,

                amount:
                    Number(
                        payment.amount
                    ),

                paymentId:
                    payment.id

            });

        }

    });


    return {

        youOwe:
            youOwe,

        youReceive:
            youReceive,

        settled:
            settled,

        oweDetails:
            oweDetails,

        receiveDetails:
            receiveDetails

    };

}


/* =========================================================
   USER NAME MATCH
   ========================================================= */

function isCurrentUserName(name) {

    if (!currentUser) {

        return false;

    }


    return (

        String(name)
            .trim()
            .toLowerCase() ===

        String(currentUser.name)
            .trim()
            .toLowerCase()

    );

}


/* =========================================================
   USER DASHBOARD
   ========================================================= */

function renderUserDashboard() {

    if (!currentUser) {
        return;
    }


    const totalExpenses =
        expenses.reduce(
            function (
                total,
                expense
            ) {

                return (
                    total +
                    Number(
                        expense.amount
                    )
                );

            },
            0
        );


    const balances =
        calculateBalances();


    setText(
        "dashboardTotalExpenses",
        formatCurrency(
            totalExpenses
        )
    );


    setText(
        "dashboardYouOwe",
        formatCurrency(
            balances.youOwe
        )
    );


    setText(
        "dashboardYouReceive",
        formatCurrency(
            balances.youReceive
        )
    );


    setText(
        "dashboardSettled",
        formatCurrency(
            balances.settled
        )
    );


    const recent =
        document.getElementById(
            "dashboardRecentExpenses"
        );


    if (!recent) {
        return;
    }


    if (expenses.length === 0) {

        recent.innerHTML = `

            <div class="empty-state">

                No expenses recorded yet.

            </div>

        `;

        return;

    }


    recent.innerHTML =
        expenses
            .slice(0, 5)
            .map(createExpenseHTML)
            .join("");

}


/* =========================================================
   EXPENSE HTML
   ========================================================= */

function createExpenseHTML(expense) {

    const participants =
        expense.participants
            ? expense.participants
                .map(function (name) {

                    return escapeHTML(
                        name
                    );

                })
                .join(", ")
            : "Not available";


    return `

        <div class="expense-item">

            <div class="expense-info">

                <strong>

                    ${escapeHTML(
                        expense.description
                    )}

                </strong>


                <span>

                    Paid by:
                    ${escapeHTML(
                        expense.payerName
                    )}

                </span>


                <small>

                    Participants:
                    ${participants}

                </small>


                <small>

                    Share per person:
                    ${formatCurrency(
                        expense.sharePerPerson || 0
                    )}

                </small>


                <small>

                    ${escapeHTML(
                        expense.date
                    )}

                </small>

            </div>


            <div class="expense-amount">

                <strong>

                    ${formatCurrency(
                        expense.amount
                    )}

                </strong>


                <button
                    type="button"
                    class="delete-expense-btn"
                    onclick="
                        deleteExpense(
                            '${expense.id}'
                        )
                    "
                    title="Delete Expense"
                >

                    <i
                        class="fa-solid fa-trash"
                    ></i>

                    Delete

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   RENDER EXPENSES
   ========================================================= */

function renderExpenses() {

    const container =
        document.getElementById(
            "expenseManagementList"
        );


    if (!container) {
        return;
    }


    if (expenses.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                No expenses recorded yet.

            </div>

        `;

        return;

    }


    container.innerHTML =
        expenses
            .map(createExpenseHTML)
            .join("");

}


/* =========================================================
   BALANCES
   ========================================================= */

function renderBalances() {

    const oweList =
        document.getElementById(
            "youOweList"
        );


    const receiveList =
        document.getElementById(
            "othersOweList"
        );


    if (!oweList || !receiveList) {
        return;
    }


    const balances =
        calculateBalances();


    if (
        balances.oweDetails.length === 0
    ) {

        oweList.innerHTML = `

            <div class="empty-state">

                You don't owe anyone.

            </div>

        `;

    } else {

        oweList.innerHTML =
            balances.oweDetails
                .map(function (item) {

                    return `

                        <div class="balance-item">

                            <div class="balance-person">

                                <i
                                    class="fa-solid fa-user"
                                ></i>

                                <span>

                                    You owe
                                    ${escapeHTML(
                                        item.name
                                    )}

                                </span>

                            </div>


                            <span class="amount owe">

                                ${formatCurrency(
                                    item.amount
                                )}

                            </span>

                        </div>

                    `;

                })
                .join("");

    }


    if (
        balances.receiveDetails.length === 0
    ) {

        receiveList.innerHTML = `

            <div class="empty-state">

                No one currently owes you.

            </div>

        `;

    } else {

        receiveList.innerHTML =
            balances.receiveDetails
                .map(function (item) {

                    return `

                        <div class="balance-item">

                            <div class="balance-person">

                                <i
                                    class="fa-solid fa-user"
                                ></i>

                                <span>

                                    ${escapeHTML(
                                        item.name
                                    )}

                                    owes you

                                </span>

                            </div>


                            <span class="amount receive">

                                ${formatCurrency(
                                    item.amount
                                )}

                            </span>

                        </div>

                    `;

                })
                .join("");

    }

}


/* =========================================================
   HISTORY
   ========================================================= */

function renderHistory() {

    const container =
        document.getElementById(
            "expenseHistoryList"
        );


    if (!container) {
        return;
    }


    if (expenses.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                No expense history available.

            </div>

        `;

        return;

    }


    container.innerHTML =
        expenses
            .map(createExpenseHTML)
            .join("");

}


/* =========================================================
   PAYMENTS
   ========================================================= */

function renderPayments() {

    const container =
        document.getElementById(
            "paymentList"
        );


    if (!container || !currentUser) {
        return;
    }


    const myPayments =
        payments.filter(function (payment) {

            return (

                isCurrentUserName(
                    payment.fromName
                )

                ||

                isCurrentUserName(
                    payment.toName
                )

            );

        });


    if (myPayments.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                No payment records available.

            </div>

        `;

        return;

    }


    container.innerHTML =
        myPayments
            .map(createPaymentHTML)
            .join("");

}


/* =========================================================
   PAYMENT HTML
   ========================================================= */

function createPaymentHTML(payment) {

    const currentUserIsPayer =
        isCurrentUserName(
            payment.fromName
        );


    let description;


    if (currentUserIsPayer) {

        description =
            "You owe " +
            escapeHTML(
                payment.toName
            );

    } else {

        description =
            escapeHTML(
                payment.fromName
            ) +
            " owes you";

    }


    let button = "";


    if (
        currentUserIsPayer &&
        payment.status === "Pending"
    ) {

        button = `

            <button
                class="pay-btn"
                onclick="
                    markPaymentPaid(
                        '${payment.id}'
                    )
                "
            >

                Mark Paid

            </button>

        `;

    }


    return `

        <div class="payment-item">

            <div>

                <strong>
                    ${description}
                </strong>

                <small>
                    Payment
                </small>

            </div>


            <strong>

                ${formatCurrency(
                    payment.amount
                )}

            </strong>


            <div>

                <span
                    class="
                        payment-status
                        ${
                            payment.status === "Paid"
                                ? "paid"
                                : "pending"
                        }
                    "
                >

                    ${payment.status}

                </span>


                ${button}

            </div>

        </div>

    `;

}


/* =========================================================
   MARK PAYMENT PAID
   ========================================================= */

function markPaymentPaid(paymentId) {

    const payment =
        payments.find(function (item) {

            return (
                item.id ===
                paymentId
            );

        });


    if (!payment) {
        return;
    }


    payment.status =
        "Paid";


    saveData();


    renderEverything();

}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function renderAdminDashboard() {

    const registeredUsers =
        users.filter(function (user) {

            return (
                user.role === "user"
            );

        }).length;


    const totalAmount =
        expenses.reduce(
            function (
                total,
                expense
            ) {

                return (
                    total +
                    Number(
                        expense.amount
                    )
                );

            },
            0
        );


    const pending =
        payments.filter(function (payment) {

            return (
                payment.status ===
                "Pending"
            );

        }).length;


    setText(
        "adminUserCount",
        registeredUsers
    );


    setText(
        "adminExpenseCount",
        expenses.length
    );


    setText(
        "adminTotalAmount",
        formatCurrency(
            totalAmount
        )
    );


    setText(
        "adminPendingPayments",
        pending
    );

}


/* =========================================================
   ADMIN USERS
   ========================================================= */

function renderAdminUsers() {

    const table =
        document.getElementById(
            "adminUsersTable"
        );


    if (!table) {
        return;
    }


    const registeredUsers =
        users.filter(function (user) {

            return (
                user.role === "user"
            );

        });


    if (
        registeredUsers.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;"
                >

                    No registered users.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        registeredUsers
            .map(function (user) {

                return `

                    <tr>

                        <td>
                            ${escapeHTML(
                                user.name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                user.email
                            )}
                        </td>

                        <td>
                            User
                        </td>

                        <td>
                            ${escapeHTML(
                                user.status
                            )}
                        </td>

                        <td>

                            <button
                                class="action-btn"
                                onclick="
                                    toggleUserStatus(
                                        '${user.id}'
                                    )
                                "
                            >

                                ${
                                    user.status === "Active"
                                        ? "Deactivate"
                                        : "Activate"
                                }

                            </button>


                            <button
                                class="
                                    action-btn
                                    delete
                                "
                                onclick="
                                    deleteUser(
                                        '${user.id}'
                                    )
                                "
                            >

                                Delete

                            </button>

                        </td>

                    </tr>

                `;

            })
            .join("");

}


/* =========================================================
   TOGGLE USER STATUS
   ========================================================= */

function toggleUserStatus(userId) {

    const user =
        users.find(function (item) {

            return (
                item.id ===
                userId
            );

        });


    if (!user) {
        return;
    }


    user.status =
        user.status === "Active"
            ? "Inactive"
            : "Active";


    saveData();


    renderAdminEverything();

}


/* =========================================================
   DELETE USER
   ========================================================= */

function deleteUser(userId) {

    const user =
        users.find(function (item) {

            return (
                item.id ===
                userId
            );

        });


    if (!user) {
        return;
    }


    const confirmed =
        confirm(
            "Delete " +
            user.name +
            "'s account?"
        );


    if (!confirmed) {
        return;
    }


    users =
        users.filter(function (item) {

            return (
                item.id !==
                userId
            );

        });


    saveData();


    renderAdminEverything();

}


/* =========================================================
   ADMIN EXPENSES
   ========================================================= */

function renderAdminExpenses() {

    const container =
        document.getElementById(
            "adminExpensesList"
        );


    if (!container) {
        return;
    }


    if (expenses.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                No expenses have been recorded.

            </div>

        `;

        return;

    }


    container.innerHTML =
        expenses
            .map(createExpenseHTML)
            .join("");

}


/* =========================================================
   ADMIN SUMMARY
   ========================================================= */

function renderAdminSummary() {

    const total =
        expenses.reduce(
            function (
                sum,
                expense
            ) {

                return (
                    sum +
                    Number(
                        expense.amount
                    )
                );

            },
            0
        );


    const completed =
        payments.filter(function (payment) {

            return (
                payment.status ===
                "Paid"
            );

        }).length;


    const pending =
        payments.filter(function (payment) {

            return (
                payment.status ===
                "Pending"
            );

        }).length;


    setText(
        "summaryTotalSpending",
        formatCurrency(total)
    );


    setText(
        "summaryCompletedPayments",
        completed
    );


    setText(
        "summaryPendingPayments",
        pending
    );

}


/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function renderEverything() {

    renderUserDashboard();

    renderExpenses();

    renderBalances();

    renderHistory();

    renderPayments();

}


/* =========================================================
   RENDER ADMIN
   ========================================================= */

function renderAdminEverything() {

    renderAdminDashboard();

    renderAdminUsers();

    renderAdminExpenses();

    renderAdminSummary();

}


/* =========================================================
   UPDATE USER HEADER
   ========================================================= */

function updateUserHeader() {

    if (!currentUser) {
        return;
    }


    setText(
        "loggedUserName",
        currentUser.name
    );


    setText(
        "loggedUserEmail",
        currentUser.email
    );

}


/* =========================================================
   HELPER - SET TEXT
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   HELPER - CURRENCY
   ========================================================= */

function formatCurrency(amount) {

    return (
        "₹" +
        Number(amount).toFixed(2)
    );

}


/* =========================================================
   HELPER - SECURITY
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
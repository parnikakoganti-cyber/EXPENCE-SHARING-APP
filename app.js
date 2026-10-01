/* =========================================================
   EXPENSE SPLIT - APPLICATION JAVASCRIPT
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
   APPLICATION STATE
   ========================================================= */

let users = [];
let expenses = [];
let payments = [];
let currentUser = null;


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeStorage();

    loadData();

    setupAuthenticationEvents();

    setupUserNavigation();

    setupAdminNavigation();

    setupUserEvents();

    setupAdminEvents();

    restoreSession();

});


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function initializeStorage() {

    if (!localStorage.getItem(USERS_KEY)) {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify([DEFAULT_ADMIN])
        );

    }

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


function loadData() {

    users =
        JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    expenses =
        JSON.parse(localStorage.getItem(EXPENSES_KEY)) || [];

    payments =
        JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];

}


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
   AUTHENTICATION EVENTS
   ========================================================= */

function setupAuthenticationEvents() {

    /* USER LOGIN */

    document
        .getElementById("loginForm")
        .addEventListener("submit", handleUserLogin);


    /* USER SIGNUP */

    document
        .getElementById("signupForm")
        .addEventListener("submit", handleSignup);


    /* ADMIN LOGIN */

    document
        .getElementById("adminLoginForm")
        .addEventListener(
            "submit",
            handleAdminLogin
        );


    /* SHOW SIGNUP */

    document
        .getElementById("showSignupBtn")
        .addEventListener(
            "click",
            () => {
                showAuthBox("signupBox");
            }
        );


    /* SHOW LOGIN */

    document
        .getElementById("showLoginBtn")
        .addEventListener(
            "click",
            () => {
                showAuthBox("loginBox");
            }
        );


    /* SHOW ADMIN LOGIN */

    document
        .getElementById("showAdminLoginBtn")
        .addEventListener(
            "click",
            () => {
                showAuthBox("adminLoginBox");
            }
        );


    /* BACK TO USER LOGIN */

    document
        .getElementById("backToUserLoginBtn")
        .addEventListener(
            "click",
            () => {
                showAuthBox("loginBox");
            }
        );

}


/* =========================================================
   AUTH BOX SWITCHING
   ========================================================= */

function showAuthBox(boxId) {

    const boxes = [
        "loginBox",
        "signupBox",
        "adminLoginBox"
    ];

    boxes.forEach(id => {

        document
            .getElementById(id)
            .classList.add("hidden");

    });

    document
        .getElementById(boxId)
        .classList.remove("hidden");

}


/* =========================================================
   USER SIGNUP
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


    const existingUser =
        users.find(
            user => user.email === email
        );


    if (existingUser) {

        alert(
            "An account with this email already exists."
        );

        return;

    }


    const newUser = {

        id:
            "user_" +
            Date.now(),

        name: name,

        email: email,

        password: password,

        role: "user",

        status: "Active"

    };


    users.push(newUser);

    saveData();


    alert(
        "Account created successfully! You can now login."
    );


    document
        .getElementById("signupForm")
        .reset();


    showAuthBox("loginBox");

}


/* =========================================================
   USER LOGIN
   ========================================================= */

function handleUserLogin(event) {

    event.preventDefault();


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
        users.find(
            item =>
                item.email === email &&
                item.password === password &&
                item.role === "user"
        );


    if (!user) {

        alert(
            "Invalid email or password."
        );

        return;

    }


    if (user.status !== "Active") {

        alert(
            "Your account is currently inactive."
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
        users.find(
            user =>
                user.email === email &&
                user.password === password &&
                user.role === "admin"
        );


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


    document
        .getElementById("adminLoginForm")
        .reset();


    showAdminApplication();

}


/* =========================================================
   RESTORE SESSION
   ========================================================= */

function restoreSession() {

    const savedUserId =
        localStorage.getItem(
            CURRENT_USER_KEY
        );


    if (!savedUserId) {

        showAuthentication();

        return;

    }


    const user =
        users.find(
            item =>
                item.id === savedUserId
        );


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
   SHOW / HIDE APPLICATIONS
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

}


function showUserApplication() {

    document
        .getElementById("authPage")
        .classList.add("hidden");


    document
        .getElementById("userApp")
        .classList.remove("hidden");


    document
        .getElementById("adminApp")
        .classList.add("hidden");


    updateUserHeader();

    populateExpenseUsers();

    renderUserDashboard();

    renderExpenses();

    renderBalances();

    renderHistory();

    renderPayments();

}


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


    renderAdminDashboard();

    renderAdminUsers();

    renderAdminExpenses();

    renderAdminSummary();

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


function setupUserEvents() {

    document
        .getElementById("logoutBtn")
        .addEventListener(
            "click",
            logout
        );


    document
        .getElementById("expenseForm")
        .addEventListener(
            "submit",
            handleAddExpense
        );

}


function setupAdminEvents() {

    document
        .getElementById("adminLogoutBtn")
        .addEventListener(
            "click",
            logout
        );

}


/* =========================================================
   USER HEADER
   ========================================================= */

function updateUserHeader() {

    if (!currentUser) return;


    document
        .getElementById("loggedUserName")
        .textContent =
        currentUser.name;


    document
        .getElementById("loggedUserEmail")
        .textContent =
        currentUser.email;

}


/* =========================================================
   USER NAVIGATION
   ========================================================= */

function setupUserNavigation() {

    const buttons =
        document.querySelectorAll(
            ".nav-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const sectionId =
                    button.dataset.section;


                switchUserSection(
                    sectionId
                );

            }
        );

    });


    /* VIEW ALL BUTTONS */

    document
        .querySelectorAll(
            ".text-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;

                    if (section) {

                        switchUserSection(
                            section
                        );

                    }

                }
            );

        });

}


function switchUserSection(sectionId) {

    document
        .querySelectorAll(
            ".content-section"
        )
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    document
        .getElementById(sectionId)
        .classList.add(
            "active-section"
        );


    document
        .querySelectorAll(
            ".nav-btn"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.section ===
                sectionId
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


    renderUserDashboard();

    renderExpenses();

    renderBalances();

    renderHistory();

    renderPayments();

}


/* =========================================================
   ADMIN NAVIGATION
   ========================================================= */

function setupAdminNavigation() {

    const buttons =
        document.querySelectorAll(
            ".admin-nav-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const sectionId =
                    button.dataset.adminSection;


                switchAdminSection(
                    sectionId
                );

            }
        );

    });

}


function switchAdminSection(sectionId) {

    document
        .querySelectorAll(
            ".admin-content-section"
        )
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    document
        .getElementById(sectionId)
        .classList.add(
            "active-section"
        );


    document
        .querySelectorAll(
            ".admin-nav-btn"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.adminSection ===
                sectionId
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


    renderAdminDashboard();

    renderAdminUsers();

    renderAdminExpenses();

    renderAdminSummary();

}


/* =========================================================
   POPULATE USERS FOR EXPENSE
   ========================================================= */

function populateExpenseUsers() {

    const payerSelect =
        document.getElementById(
            "expensePayer"
        );


    const participantsList =
        document.getElementById(
            "participantsList"
        );


    const activeUsers =
        users.filter(
            user =>
                user.role === "user" &&
                user.status === "Active"
        );


    payerSelect.innerHTML =
        activeUsers
            .map(
                user => `
                    <option value="${user.id}">
                        ${escapeHTML(user.name)}
                    </option>
                `
            )
            .join("");


    participantsList.innerHTML =
        activeUsers
            .map(
                user => `

                    <label class="participant-item">

                        <input
                            type="checkbox"
                            value="${user.id}"
                            class="participant-checkbox"
                            ${currentUser &&
                            user.id === currentUser.id
                                ? "checked"
                                : ""}
                        >

                        <span>
                            ${escapeHTML(user.name)}
                        </span>

                    </label>

                `
            )
            .join("");


    if (currentUser) {

        payerSelect.value =
            currentUser.id;

    }

}


/* =========================================================
   ADD EXPENSE
   ========================================================= */

function handleAddExpense(event) {

    event.preventDefault();


    if (!currentUser) {

        alert("Please login first.");

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


    const payerId =
        document
            .getElementById(
                "expensePayer"
            )
            .value;


    const participantCheckboxes =
        document.querySelectorAll(
            ".participant-checkbox:checked"
        );


    const participants =
        Array.from(
            participantCheckboxes
        )
        .map(
            checkbox =>
                checkbox.value
        );


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


    if (participants.length === 0) {

        alert(
            "Please select at least one participant."
        );

        return;

    }


    if (
        !participants.includes(
            payerId
        )
    ) {

        participants.push(
            payerId
        );

    }


    const expense = {

        id:
            "expense_" +
            Date.now(),

        description:

            description,

        amount:

            amount,

        payerId:

            payerId,

        participants:

            participants,

        createdBy:

            currentUser.id,

        date:

            new Date()
                .toLocaleString(),

        status:

            "Recorded"

    };


    expenses.unshift(expense);

    createPaymentRecords(expense);

    saveData();


    event.target.reset();


    populateExpenseUsers();


    renderUserDashboard();

    renderExpenses();

    renderBalances();

    renderHistory();

    renderPayments();

    renderAdminDashboard();

    renderAdminExpenses();

    renderAdminSummary();


    alert(
        "Expense added successfully!"
    );

}


/* =========================================================
   CREATE PAYMENT RECORDS
   ========================================================= */

function createPaymentRecords(expense) {

    const share =
        expense.amount /
        expense.participants.length;


    expense.participants.forEach(
        participantId => {

            if (
                participantId ===
                expense.payerId
            ) {

                return;

            }


            const payment = {

                id:
                    "payment_" +
                    Date.now() +
                    "_" +
                    Math.random()
                        .toString(36)
                        .substring(2, 8),

                expenseId:
                    expense.id,

                from:
                    participantId,

                to:
                    expense.payerId,

                amount:
                    share,

                status:
                    "Pending"

            };


            payments.push(payment);

        }
    );

}


/* =========================================================
   DASHBOARD CALCULATIONS
   ========================================================= */

function getUserOwedAmount(userId) {

    let total = 0;


    payments.forEach(
        payment => {

            if (
                payment.from ===
                userId &&
                payment.status ===
                "Pending"
            ) {

                total += payment.amount;

            }

        }
    );


    return total;

}


function getUserReceiveAmount(userId) {

    let total = 0;


    payments.forEach(
        payment => {

            if (
                payment.to ===
                userId &&
                payment.status ===
                "Pending"
            ) {

                total += payment.amount;

            }

        }
    );


    return total;

}


function getUserSettledAmount(userId) {

    let total = 0;


    payments.forEach(
        payment => {

            if (
                (
                    payment.from === userId ||
                    payment.to === userId
                ) &&
                payment.status === "Paid"
            ) {

                total += payment.amount;

            }

        }
    );


    return total;

}


/* =========================================================
   USER DASHBOARD
   ========================================================= */

function renderUserDashboard() {

    if (!currentUser) return;


    const totalExpenses =
        expenses.reduce(
            (
                total,
                expense
            ) =>
                total +
                Number(expense.amount),

            0
        );


    document
        .getElementById(
            "dashboardTotalExpenses"
        )
        .textContent =
        formatCurrency(
            totalExpenses
        );


    document
        .getElementById(
            "dashboardYouOwe"
        )
        .textContent =
        formatCurrency(
            getUserOwedAmount(
                currentUser.id
            )
        );


    document
        .getElementById(
            "dashboardYouReceive"
        )
        .textContent =
        formatCurrency(
            getUserReceiveAmount(
                currentUser.id
            )
        );


    document
        .getElementById(
            "dashboardSettled"
        )
        .textContent =
        formatCurrency(
            getUserSettledAmount(
                currentUser.id
            )
        );


    renderRecentExpenses();

}


/* =========================================================
   RECENT EXPENSES
   ========================================================= */

function renderRecentExpenses() {

    const container =
        document.getElementById(
            "dashboardRecentExpenses"
        );


    const recent =
        expenses.slice(
            0,
            5
        );


    if (recent.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No expenses recorded yet.
            </div>
        `;

        return;

    }


    container.innerHTML =
        recent
            .map(
                expense =>
                    createExpenseHTML(
                        expense
                    )
            )
            .join("");

}


/* =========================================================
   EXPENSE MANAGEMENT
   ========================================================= */

function renderExpenses() {

    const container =
        document.getElementById(
            "expenseManagementList"
        );


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
            .map(
                expense =>
                    createExpenseHTML(
                        expense
                    )
            )
            .join("");

}


function createExpenseHTML(expense) {

    const payer =
        getUserName(
            expense.payerId
        );


    return `

        <div class="expense-item">

            <div class="expense-info">

                <strong>
                    ${escapeHTML(
                        expense.description
                    )}
                </strong>

                <span>
                    Paid by ${escapeHTML(payer)}
                </span>

            </div>


            <div class="expense-amount">

                ${formatCurrency(
                    expense.amount
                )}

            </div>


            <div class="expense-date">

                ${escapeHTML(
                    expense.date
                )}

            </div>

        </div>

    `;

}


/* =========================================================
   BALANCE TRACKING
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


    if (!currentUser) return;


    const owePayments =
        payments.filter(
            payment =>
                payment.from ===
                currentUser.id &&
                payment.status ===
                "Pending"
        );


    const receivePayments =
        payments.filter(
            payment =>
                payment.to ===
                currentUser.id &&
                payment.status ===
                "Pending"
        );


    if (owePayments.length === 0) {

        oweList.innerHTML = `
            <div class="empty-state">
                You don't owe anyone.
            </div>
        `;

    } else {

        oweList.innerHTML =
            owePayments
                .map(
                    payment => `

                        <div class="balance-item">

                            <div class="balance-person">

                                <i class="fa-solid fa-user"></i>

                                <span>
                                    You owe
                                    <strong>
                                        ${escapeHTML(
                                            getUserName(
                                                payment.to
                                            )
                                        )}
                                    </strong>
                                </span>

                            </div>

                            <span class="amount owe">
                                ${formatCurrency(
                                    payment.amount
                                )}
                            </span>

                        </div>

                    `
                )
                .join("");

    }


    if (receivePayments.length === 0) {

        receiveList.innerHTML = `
            <div class="empty-state">
                No one currently owes you.
            </div>
        `;

    } else {

        receiveList.innerHTML =
            receivePayments
                .map(
                    payment => `

                        <div class="balance-item">

                            <div class="balance-person">

                                <i class="fa-solid fa-user"></i>

                                <span>
                                    ${escapeHTML(
                                        getUserName(
                                            payment.from
                                        )
                                    )}
                                    owes you
                                </span>

                            </div>

                            <span class="amount receive">
                                ${formatCurrency(
                                    payment.amount
                                )}
                            </span>

                        </div>

                    `
                )
                .join("");

    }

}


/* =========================================================
   EXPENSE HISTORY
   ========================================================= */

function renderHistory() {

    const container =
        document.getElementById(
            "expenseHistoryList"
        );


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
            .map(
                expense =>
                    createExpenseHTML(
                        expense
                    )
            )
            .join("");

}


/* =========================================================
   PAYMENT TRACKING
   ========================================================= */

function renderPayments() {

    const container =
        document.getElementById(
            "paymentList"
        );


    if (!currentUser) return;


    const myPayments =
        payments.filter(
            payment =>
                payment.from ===
                    currentUser.id ||
                payment.to ===
                    currentUser.id
        );


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
            .map(
                payment =>
                    createPaymentHTML(
                        payment
                    )
            )
            .join("");

}


function createPaymentHTML(payment) {

    const isPayer =
        payment.from ===
        currentUser.id;


    const otherPerson =
        isPayer
            ? getUserName(payment.to)
            : getUserName(payment.from);


    let description;


    if (isPayer) {

        description =
            `You owe ${escapeHTML(
                otherPerson
            )}`;

    } else {

        description =
            `${escapeHTML(
                otherPerson
            )} owes you`;

    }


    const action =
        isPayer &&
        payment.status ===
            "Pending"

            ? `

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

            `

            : "";


    return `

        <div class="payment-item">

            <div>

                <strong>
                    ${description}
                </strong>

                <div
                    style="
                        color:#64748b;
                        font-size:12px;
                        margin-top:5px;
                    "
                >
                    Payment
                </div>

            </div>


            <strong>
                ${formatCurrency(
                    payment.amount
                )}
            </strong>


            <div>

                <span
                    class="payment-status
                    ${
                        payment.status ===
                        "Paid"
                            ? "paid"
                            : "pending"
                    }"
                >
                    ${payment.status}
                </span>

                ${action}

            </div>

        </div>

    `;

}


/* =========================================================
   MARK PAYMENT AS PAID
   ========================================================= */

function markPaymentPaid(paymentId) {

    const payment =
        payments.find(
            item =>
                item.id ===
                paymentId
        );


    if (!payment) return;


    payment.status = "Paid";


    saveData();


    renderUserDashboard();

    renderBalances();

    renderPayments();

    renderAdminDashboard();

    renderAdminSummary();

}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function renderAdminDashboard() {

    const normalUsers =
        users.filter(
            user =>
                user.role === "user"
        );


    const totalAmount =
        expenses.reduce(
            (
                total,
                expense
            ) =>
                total +
                Number(expense.amount),

            0
        );


    const pendingPayments =
        payments.filter(
            payment =>
                payment.status ===
                "Pending"
        ).length;


    document
        .getElementById(
            "adminUserCount"
        )
        .textContent =
        normalUsers.length;


    document
        .getElementById(
            "adminExpenseCount"
        )
        .textContent =
        expenses.length;


    document
        .getElementById(
            "adminTotalAmount"
        )
        .textContent =
        formatCurrency(
            totalAmount
        );


    document
        .getElementById(
            "adminPendingPayments"
        )
        .textContent =
        pendingPayments;

}


/* =========================================================
   ADMIN USER MANAGEMENT
   ========================================================= */

function renderAdminUsers() {

    const table =
        document.getElementById(
            "adminUsersTable"
        );


    const registeredUsers =
        users.filter(
            user =>
                user.role === "user"
        );


    if (
        registeredUsers.length ===
        0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        color:#64748b;
                    "
                >
                    No registered users.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        registeredUsers
            .map(
                user => `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    user.name
                                )}
                            </strong>
                        </td>


                        <td>
                            ${escapeHTML(
                                user.email
                            )}
                        </td>


                        <td>

                            <span
                                class="
                                    role-badge
                                    user
                                "
                            >
                                User
                            </span>

                        </td>


                        <td>

                            <span
                                class="
                                    ${
                                        user.status ===
                                        "Active"
                                            ? "status-active"
                                            : "status-inactive"
                                    }
                                "
                            >
                                ${user.status}
                            </span>

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
                                    user.status ===
                                    "Active"
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

                `
            )
            .join("");

}


/* =========================================================
   TOGGLE USER STATUS
   ========================================================= */

function toggleUserStatus(userId) {

    const user =
        users.find(
            item =>
                item.id ===
                userId
        );


    if (!user) return;


    user.status =
        user.status ===
        "Active"
            ? "Inactive"
            : "Active";


    saveData();


    renderAdminUsers();

    renderAdminDashboard();

    populateExpenseUsers();

}


/* =========================================================
   DELETE USER
   ========================================================= */

function deleteUser(userId) {

    const user =
        users.find(
            item =>
                item.id ===
                userId
        );


    if (!user) return;


    const confirmed =
        confirm(
            `Delete ${user.name}'s account?`
        );


    if (!confirmed) return;


    users =
        users.filter(
            item =>
                item.id !==
                userId
        );


    saveData();


    renderAdminUsers();

    renderAdminDashboard();

    populateExpenseUsers();

}


/* =========================================================
   ADMIN EXPENSE MONITORING
   ========================================================= */

function renderAdminExpenses() {

    const container =
        document.getElementById(
            "adminExpensesList"
        );


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
            .map(
                expense => `

                    <div class="expense-item">

                        <div class="expense-info">

                            <strong>
                                ${escapeHTML(
                                    expense.description
                                )}
                            </strong>

                            <span>
                                Paid by
                                ${escapeHTML(
                                    getUserName(
                                        expense.payerId
                                    )
                                )}
                            </span>

                        </div>


                        <div class="expense-amount">

                            ${formatCurrency(
                                expense.amount
                            )}

                        </div>


                        <div class="expense-date">

                            ${escapeHTML(
                                expense.date
                            )}

                        </div>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   ADMIN EXPENSE SUMMARY
   ========================================================= */

function renderAdminSummary() {

    const totalSpending =
        expenses.reduce(
            (
                total,
                expense
            ) =>
                total +
                Number(expense.amount),

            0
        );


    const completed =
        payments.filter(
            payment =>
                payment.status ===
                "Paid"
        ).length;


    const pending =
        payments.filter(
            payment =>
                payment.status ===
                "Pending"
        ).length;


    document
        .getElementById(
            "summaryTotalSpending"
        )
        .textContent =
        formatCurrency(
            totalSpending
        );


    document
        .getElementById(
            "summaryCompletedPayments"
        )
        .textContent =
        completed;


    document
        .getElementById(
            "summaryPendingPayments"
        )
        .textContent =
        pending;

}


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function getUserName(userId) {

    const user =
        users.find(
            item =>
                item.id ===
                userId
        );


    return user
        ? user.name
        : "Unknown User";

}


function formatCurrency(amount) {

    return (
        "₹" +
        Number(amount)
            .toFixed(2)
    );

}


/* =========================================================
   SECURITY / DISPLAY HELPER
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
/* ExpenseSplit React analytics - uses React.createElement (no Babel required). */
(function () {
    const h = React.createElement;
    const STORAGE_KEY = "expenseSplit_expenses";

    function readExpenses() {
        try {
            const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.error("Expense Insights: unable to read saved expenses", error);
            return [];
        }
    }

    function money(value) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency", currency: "INR", maximumFractionDigits: 2
        }).format(Number(value) || 0);
    }

    function Metric(props) {
        return h("article", { className: "insight-metric" },
            h("span", { className: "insight-icon " + props.color }, h("i", { className: "fa-solid " + props.icon })),
            h("div", null, h("small", null, props.label), h("strong", null, props.value))
        );
    }

    function ExpenseAnalytics(props) {
        const [sortBy, setSortBy] = React.useState("amount");
        const expenses = props.expenses.filter(function (item) {
            return item && Number.isFinite(Number(item.amount));
        });
        const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
        const average = expenses.length ? total / expenses.length : 0;
        const highest = expenses.reduce((best, item) => Number(item.amount) > Number(best ? best.amount : 0) ? item : best, null);
        const byPayer = {};
        expenses.forEach(function (item) {
            const name = String(item.payerName || "Unknown payer").trim() || "Unknown payer";
            byPayer[name] = (byPayer[name] || 0) + Number(item.amount);
        });
        const payers = Object.keys(byPayer).map(name => ({ name, amount: byPayer[name] }));
        payers.sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : b.amount - a.amount);
        const visiblePayers = payers.slice(0, 5);
        const maxAmount = Math.max.apply(null, visiblePayers.map(p => p.amount).concat([1]));

        return h("section", { className: "dashboard-card react-insights-card" },
            h("div", { className: "card-header react-insights-header" },
                h("div", null,
                    h("h3", null, h("i", { className: "fa-solid fa-chart-pie" }), " Expense Insights"),
                    h("p", { className: "react-insights-subtitle" }, "A live overview powered by React")
                ),
                h("span", { className: "react-powered-label" }, "REACT")
            ),
            h("div", { className: "react-insights-metrics" },
                h(Metric, { label: "Total spending", value: money(total), icon: "fa-wallet", color: "insight-icon-green" }),
                h(Metric, { label: "Recorded expenses", value: expenses.length, icon: "fa-receipt", color: "insight-icon-blue" }),
                h(Metric, { label: "Average expense", value: money(average), icon: "fa-calculator", color: "insight-icon-purple" }),
                h(Metric, { label: "Highest expense", value: money(highest ? highest.amount : 0), icon: "fa-arrow-trend-up", color: "insight-icon-orange" })
            ),
            h("div", { className: "payer-insights" },
                h("div", { className: "payer-insights-heading" },
                    h("div", null, h("h4", null, "Spending by payer"), h("p", null, "Based on payer names in your saved expenses")),
                    h("select", { "aria-label": "Sort payer spending", value: sortBy, onChange: e => setSortBy(e.target.value) },
                        h("option", { value: "amount" }, "Highest amount"), h("option", { value: "name" }, "Name A–Z")
                    )
                ),
                visiblePayers.length === 0
                    ? h("div", { className: "insight-empty-state" }, "Add an expense to see spending insights here.")
                    : h("div", { className: "payer-bars" }, visiblePayers.map(p =>
                        h("div", { className: "payer-bar-row", key: p.name },
                            h("div", { className: "payer-bar-label" }, h("span", { title: p.name }, p.name), h("strong", null, money(p.amount))),
                            h("div", { className: "payer-bar-track" }, h("div", { className: "payer-bar-fill", style: { width: (p.amount / maxAmount * 100) + "%" } }))
                        )
                    ))
            ),
            h("p", { className: "react-insights-footnote" }, "Insights update when the dashboard refreshes after expenses are changed.")
        );
    }

    let root = null;
    window.renderReactAnalytics = function () {
        const mount = document.getElementById("reactAnalyticsRoot");
        if (!mount || !window.React || !window.ReactDOM) {
            console.error("Expense Insights could not start: mount point or React library is missing.");
            return;
        }
        if (!root) root = ReactDOM.createRoot(mount);
        root.render(React.createElement(ExpenseAnalytics, { expenses: readExpenses() }));
    };

    // Initial render; app.js calls this again whenever the dashboard refreshes.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", window.renderReactAnalytics);
    } else {
        window.renderReactAnalytics();
    }
})();

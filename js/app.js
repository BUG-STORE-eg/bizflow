// ==========================================
// BizFlow Dashboard
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    const userEmailElement =
        document.getElementById("userEmail");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const totalSalesElement =
        document.getElementById("totalSales");

    const totalProfitElement =
        document.getElementById("totalProfit");

    const customersCountElement =
        document.getElementById("customersCount");

    const productsCountElement =
        document.getElementById("productsCount");

    const salesContainer =
        document.getElementById("salesContainer");


    // ==========================================
    // Supabase
    // ==========================================

    const SUPABASE_URL =
        "https://oklabfxjcekfwirnqlji.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_V-_AIpoZ2IZActUyhDQ5ug_9_Lqlgp";

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    // ==========================================
    // دوال مساعدة
    // ==========================================

    function formatMoney(value) {

        const number =
            Number(value || 0);

        return number.toLocaleString("ar-EG", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }) + " ج.م";

    }


    function formatDate(date) {

        if (!date) {
            return "-";
        }

        return new Intl.DateTimeFormat(
            "ar-EG",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(new Date(date));

    }


    function showSalesEmpty() {

        if (!salesContainer) {
            return;
        }

        salesContainer.innerHTML = `
            <div class="empty">

                <div class="empty-icon">
                    🧾
                </div>

                <h3>
                    لا توجد مبيعات حتى الآن
                </h3>

                <p>
                    أضف أول عملية بيع من زر إضافة عملية بيع.
                </p>

            </div>
        `;

    }


    function showSalesError() {

        if (!salesContainer) {
            return;
        }

        salesContainer.innerHTML = `
            <div class="empty">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    تعذر تحميل المبيعات
                </h3>

                <p>
                    حاول تحديث الصفحة مرة أخرى.
                </p>

            </div>
        `;

    }


    function renderSales(sales) {

        if (!salesContainer) {
            return;
        }


        if (!sales || sales.length === 0) {

            showSalesEmpty();

            return;

        }


        salesContainer.innerHTML = `

            <div style="
                display:flex;
                flex-direction:column;
                gap:10px;
                margin-top:20px;
            ">

                ${sales.map(sale => {

                    const customerName =
                        sale.customers?.name ||
                        "عميل غير معروف";

                    return `

                        <div style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            gap:15px;
                            padding:15px;
                            background:#151f35;
                            border:1px solid #263452;
                            border-radius:12px;
                        ">

                            <div>

                                <strong style="
                                    display:block;
                                    color:#eef2ff;
                                    margin-bottom:5px;
                                ">
                                    ${escapeHtml(customerName)}
                                </strong>

                                <small style="
                                    color:#8f9bb7;
                                ">
                                    ${formatDate(sale.created_at)}
                                </small>

                            </div>


                            <strong style="
                                color:#69e6a5;
                                white-space:nowrap;
                            ">
                                ${formatMoney(sale.total)}
                            </strong>

                        </div>

                    `;

                }).join("")}

            </div>

        `;

    }


    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ==========================================
    // تحميل Dashboard
    // ==========================================

    try {

        // ==========================================
        // المستخدم الحالي
        // ==========================================

        const {
            data: {
                user
            },
            error: userError
        } =
            await supabaseClient.auth.getUser();


        if (userError) {

            console.error(
                "USER ERROR:",
                userError
            );

            if (userEmailElement) {

                userEmailElement.textContent =
                    "تعذر تحميل الحساب";

            }

            return;

        }


        if (!user) {

            if (userEmailElement) {

                userEmailElement.textContent =
                    "غير مسجل الدخول";

            }

            return;

        }


        // ==========================================
        // عرض الإيميل
        // ==========================================

        if (userEmailElement) {

            userEmailElement.textContent =
                user.email ||
                "بدون بريد إلكتروني";

        }


        // ==========================================
        // تحديد بداية ونهاية الشهر الحالي
        // ==========================================

        const now =
            new Date();

        const startOfMonth =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                1,
                0,
                0,
                0,
                0
            );

        const startOfNextMonth =
            new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1,
                0,
                0,
                0,
                0
            );


        const startDate =
            startOfMonth.toISOString();

        const endDate =
            startOfNextMonth.toISOString();


        // ==========================================
        // العملاء
        // ==========================================

        const {
            count: customersCount,
            error: customersError
        } =
            await supabaseClient
                .from("customers")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                )
                .eq(
                    "user_id",
                    user.id
                );


        if (customersError) {

            console.error(
                "CUSTOMERS ERROR:",
                customersError
            );

        }


        if (customersCountElement) {

            customersCountElement.textContent =
                customersCount || 0;

        }


        // ==========================================
        // المنتجات
        // ==========================================

        const {
            count: productsCount,
            error: productsError
        } =
            await supabaseClient
                .from("products")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                )
                .eq(
                    "user_id",
                    user.id
                );


        if (productsError) {

            console.error(
                "PRODUCTS ERROR:",
                productsError
            );

        }


        if (productsCountElement) {

            productsCountElement.textContent =
                productsCount || 0;

        }


        // ==========================================
        // مبيعات الشهر الحالي
        // ==========================================

        const {
            data: monthlySales,
            error: monthlySalesError
        } =
            await supabaseClient
                .from("sales")
                .select(
                    "total, created_at"
                )
                .eq(
                    "user_id",
                    user.id
                )
                .gte(
                    "created_at",
                    startDate
                )
                .lt(
                    "created_at",
                    endDate
                );


        if (monthlySalesError) {

            console.error(
                "MONTHLY SALES ERROR:",
                monthlySalesError
            );

        }


        let salesTotal = 0;


        if (monthlySales) {

            monthlySales.forEach(
                sale => {

                    salesTotal +=
                        Number(
                            sale.total || 0
                        );

                }
            );

        }


        if (totalSalesElement) {

            totalSalesElement.textContent =
                formatMoney(salesTotal);

        }


        // ==========================================
        // مصروفات الشهر الحالي
        // ==========================================

        const {
            data: monthlyExpenses,
            error: expensesError
        } =
            await supabaseClient
                .from("expenses")
                .select(
                    "amount, created_at"
                )
                .eq(
                    "user_id",
                    user.id
                )
                .gte(
                    "created_at",
                    startDate
                )
                .lt(
                    "created_at",
                    endDate
                );


        if (expensesError) {

            console.error(
                "EXPENSES ERROR:",
                expensesError
            );

        }


        let expensesTotal = 0;


        if (monthlyExpenses) {

            monthlyExpenses.forEach(
                expense => {

                    expensesTotal +=
                        Number(
                            expense.amount || 0
                        );

                }
            );

        }


        // ==========================================
        // الأرباح
        // ==========================================

        const profit =
            salesTotal -
            expensesTotal;


        if (totalProfitElement) {

            totalProfitElement.textContent =
                formatMoney(profit);

        }


        // ==========================================
        // آخر 5 مبيعات
        // ==========================================

        const {
            data: latestSales,
            error: latestSalesError
        } =
            await supabaseClient
                .from("sales")
                .select(
                    `
                    id,
                    total,
                    created_at,
                    customers (
                        name
                    )
                    `
                )
                .eq(
                    "user_id",
                    user.id
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(5);


        if (latestSalesError) {

            console.error(
                "LATEST SALES ERROR:",
                latestSalesError
            );

            showSalesError();

        } else {

            renderSales(
                latestSales
            );

        }


        // ==========================================
        // جلب خطة المستخدم
        // ==========================================

        const {
            data: planData,
            error: planError
        } =
            await supabaseClient.rpc(
                "get_my_plan"
            );


        if (planError) {

            console.error(
                "PLAN ERROR:",
                planError
            );

        }


        if (planData && planData.active) {

            console.log(
                "BizFlow Plan:",
                planData.plan
            );

        }


    } catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );


        if (userEmailElement) {

            userEmailElement.textContent =
                "تعذر تحميل الحساب";

        }


        if (salesContainer) {

            showSalesError();

        }

    }


    // ==========================================
    // تسجيل الخروج
    // ==========================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            async () => {

                try {

                    logoutBtn.disabled = true;

                    logoutBtn.textContent =
                        "جاري تسجيل الخروج...";


                    const {
                        error
                    } =
                        await supabaseClient
                            .auth
                            .signOut();


                    if (error) {

                        console.error(
                            "LOGOUT ERROR:",
                            error
                        );


                        logoutBtn.disabled =
                            false;


                        logoutBtn.textContent =
                            "تسجيل الخروج";


                        return;

                    }


                    window.location.href =
                        "login.html";


                } catch (error) {

                    console.error(
                        "LOGOUT ERROR:",
                        error
                    );


                    logoutBtn.disabled =
                        false;


                    logoutBtn.textContent =
                        "تسجيل الخروج";

                }

            }
        );

    }

});

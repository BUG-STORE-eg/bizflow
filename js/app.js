// ==========================================
// BizFlow Dashboard
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    const userEmailElement =
        document.getElementById("userEmail");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // ==========================================
    // Supabase
    // ==========================================

    const SUPABASE_URL =
        "https://oklabfxjcekfwirnqlji.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_V-_AIpoZ2IZActUyhDQ5ug_9_Lqlugp";

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    // ==========================================
    // عرض إيميل المستخدم
    // ==========================================

    try {

        const {
            data: {
                user
            },
            error
        } = await supabaseClient.auth.getUser();


        if (error) {

            console.error(
                "USER ERROR:",
                error
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


        if (userEmailElement) {

            userEmailElement.textContent =
                user.email || "بدون بريد إلكتروني";

        }


        console.log(
            "BizFlow User:",
            user.email
        );


        // ==========================================
        // جلب خطة المستخدم
        // ==========================================

        const {
            data: planData,
            error: planError
        } = await supabaseClient.rpc("get_my_plan");


        console.log(
            "MY PLAN:",
            planData
        );

        console.log(
            "PLAN ERROR:",
            planError
        );


        // ==========================================
        // عرض معلومات الخطة في Console
        // ==========================================

        if (planData) {

            if (planData.active) {

                console.log(
                    "Current Plan:",
                    planData.plan
                );

                console.log(
                    "Max Customers:",
                    planData.max_customers
                );

                console.log(
                    "Max Products:",
                    planData.max_products
                );

                console.log(
                    "Advanced Reports:",
                    planData.advanced_reports
                );

                console.log(
                    "Export Reports:",
                    planData.export_reports
                );

                console.log(
                    "Advanced Management:",
                    planData.advanced_management
                );

            } else {

                console.warn(
                    "No active BizFlow subscription."
                );

            }

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
                        await supabaseClient.auth.signOut();


                    if (error) {

                        console.error(
                            "LOGOUT ERROR:",
                            error
                        );

                        logoutBtn.disabled = false;

                        logoutBtn.textContent =
                            "تسجيل الخروج";

                        return;
                    }


                    // الرجوع لصفحة تسجيل الدخول
                    window.location.href =
                        "login.html";


                } catch (error) {

                    console.error(
                        "LOGOUT ERROR:",
                        error
                    );

                    logoutBtn.disabled = false;

                    logoutBtn.textContent =
                        "تسجيل الخروج";

                }

            }
        );

    }

});

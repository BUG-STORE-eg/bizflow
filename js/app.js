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

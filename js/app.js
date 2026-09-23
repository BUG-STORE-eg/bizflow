// ==========================================
// BizFlow Dashboard
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    const userEmailElement =
        document.getElementById("userEmail");

    try {

        // التأكد إن Supabase موجود
        if (!window.supabase) {
            throw new Error("Supabase لم يتم تحميله");
        }

        // استخدام عميل Supabase الموجود من auth.js
        const client =
            window.BizFlowAuth?.supabase ||
            window.supabaseClient;

        let supabaseClient = client;

        // لو auth.js مش مخرج الـ client، ننشئه هنا
        if (!supabaseClient) {

            const SUPABASE_URL =
                "https://oklabfxjcekfwirnqlji.supabase.co";

            const SUPABASE_KEY =
                "sb_publishable_V-_AIpoZ2IZActUyhDQ5ug_9_Lqlugp";

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );
        }


        // جلب المستخدم الحالي
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


        // عرض إيميل العميل
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

});

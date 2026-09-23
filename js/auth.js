const SUPABASE_URL =
    "https://oklabfxjcekfwirnqlji.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_V-_AIpoZ2IZActUyhDQ5ug_9_Lqlugp";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================================
// الصفحات التي لا تحتاج اشتراك نشط
// =========================================================

const PUBLIC_PAGES = [
    "login.html",
    "register.html",
    "plans.html",
    "payment.html",
    "payment-pending.html",
    "account.html"
];


// =========================================================
// معرفة الصفحة الحالية
// =========================================================

function getCurrentPage() {

    const path =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    return path || "index.html";
}


// =========================================================
// الانتقال إلى صفحة
// =========================================================

function goTo(page) {

    if (getCurrentPage() !== page) {

        window.location.href = page;

    }

}


// =========================================================
// التحقق من الأدمن
// =========================================================

async function isAdmin(userId) {

    const {
        data,
        error
    } = await supabaseClient
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();


    if (error) {

        console.error(
            "Admin check error:",
            error
        );

        return false;

    }


    return !!data;

}


// =========================================================
// الحصول على الاشتراك النشط
// =========================================================

async function getActiveSubscription(userId) {

    const now =
        new Date().toISOString();


    const {
        data,
        error
    } = await supabaseClient
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .gt("expires_at", now)
        .order(
            "expires_at",
            {
                ascending: false
            }
        )
        .limit(1)
        .maybeSingle();


    if (error) {

        console.error(
            "Subscription check error:",
            error
        );

        return null;

    }


    return data;

}


// =========================================================
// حماية صفحات BizFlow
// =========================================================

async function protectBizFlow() {

    const currentPage =
        getCurrentPage();


    // =====================================================
    // الصفحات العامة
    // =====================================================

    if (
        PUBLIC_PAGES.includes(
            currentPage
        )
    ) {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getUser();


        // -------------------------------------------------
        // صفحة الحساب تحتاج تسجيل دخول
        // -------------------------------------------------

        if (
            currentPage ===
            "account.html"
        ) {

            if (
                !data ||
                !data.user
            ) {

                goTo("login.html");

                return;

            }


            return;

        }


        // -------------------------------------------------
        // صفحة الانتظار تحتاج تسجيل دخول
        // -------------------------------------------------

        if (
            currentPage ===
            "payment-pending.html"
        ) {

            if (
                !data ||
                !data.user
            ) {

                goTo("login.html");

                return;

            }


            return;

        }


        // -------------------------------------------------
        // لو المستخدم مسجل دخول
        // -------------------------------------------------

        if (
            data &&
            data.user
        ) {

            const user =
                data.user;


            // ---------------------------------------------
            // لو فتح Login أو Register
            // ---------------------------------------------

            if (
                currentPage ===
                    "login.html" ||
                currentPage ===
                    "register.html"
            ) {

                const admin =
                    await isAdmin(
                        user.id
                    );


                if (admin) {

                    goTo("index.html");

                    return;

                }


                const subscription =
                    await getActiveSubscription(
                        user.id
                    );


                if (subscription) {

                    goTo("index.html");

                } else {

                    goTo("plans.html");

                }


                return;

            }

        }


        return;

    }


    // =====================================================
    // الصفحات المحمية
    // =====================================================

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        error ||
        !data ||
        !data.user
    ) {

        goTo("login.html");

        return;

    }


    const user =
        data.user;


    // =====================================================
    // الأدمن يدخل بدون اشتراك
    // =====================================================

    const admin =
        await isAdmin(
            user.id
        );


    if (admin) {

        return;

    }


    // =====================================================
    // المستخدم العادي يحتاج اشتراك
    // =====================================================

    const subscription =
        await getActiveSubscription(
            user.id
        );


    if (!subscription) {

        goTo("plans.html");

        return;

    }

}


// =========================================================
// تسجيل الخروج
// =========================================================

async function logout() {

    await supabaseClient
        .auth
        .signOut();


    window.location.href =
        "login.html";

}


// =========================================================
// تشغيل الحماية
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        protectBizFlow();

    }
);


// =========================================================
// إتاحة الدوال لباقي الصفحات
// =========================================================

window.BizFlowAuth = {

    supabaseClient,

    protectBizFlow,

    getActiveSubscription,

    isAdmin,

    logout

};

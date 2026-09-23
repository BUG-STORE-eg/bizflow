const SUPABASE_URL =
    "https://oklabfxjcekfwirnqlji.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_V-_AIpoZ2IZActUyhDQ5ug_9_Lqlugp";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/*
    الصفحات التي يستطيع المستخدم فتحها
    بدون اشتراك Active.
*/

const PUBLIC_PAGES = [

    "login.html",

    "register.html",

    "plans.html",

    "payment.html",
    
    "payment-pending.html"

    /*
        صفحة الحساب مسموحة حتى لو الاشتراك
        منتهي، عشان المستخدم يقدر يشوف
        بياناته ويجدد الاشتراك.
    */
    "account.html"

];


function getCurrentPage() {

    const path =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    return path || "index.html";

}


function goTo(page) {

    if (
        getCurrentPage() !== page
    ) {

        window.location.href = page;

    }

}


async function isAdmin(userId) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("admin_users")
            .select("user_id")
            .eq(
                "user_id",
                userId
            )
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


async function getActiveSubscription(userId) {

    const now =
        new Date().toISOString();


    const {
        data,
        error
    } =
        await supabaseClient
            .from("subscriptions")
            .select("*")
            .eq(
                "user_id",
                userId
            )
            .eq(
                "status",
                "active"
            )
            .gt(
                "expires_at",
                now
            )
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


async function protectBizFlow() {

    const currentPage =
        getCurrentPage();


    /*
        الصفحات العامة.
    */

    if (
        PUBLIC_PAGES.includes(
            currentPage
        )
    ) {

        const {
            data
        } =
            await supabaseClient.auth.getUser();


        /*
            لو المستخدم مش مسجل دخول،
            صفحة الحساب لا تفتح.
        */

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

            /*
                المستخدم المسجل يقدر يدخل
                account.html حتى لو اشتراكه
                منتهي.
            */

            return;

        }


        /*
            لو عنده Session بالفعل
            وهو داخل login/register
            نرسله للباقات أو الداشبورد.
        */

        if (
            data &&
            data.user
        ) {

            const user =
                data.user;


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

            }

        }


        return;

    }


    /*
        أي صفحة من صفحات النظام
        تحتاج مستخدم مسجل.
    */

    const {
        data,
        error
    } =
        await supabaseClient.auth.getUser();


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


    /*
        الأدمن يدخل النظام مباشرة.
    */

    const admin =
        await isAdmin(
            user.id
        );


    if (admin) {

        return;

    }


    /*
        المستخدم العادي لازم يكون عنده
        Subscription Active وغير منتهي.
    */

    const subscription =
        await getActiveSubscription(
            user.id
        );


    if (!subscription) {

        /*
            الاشتراك منتهي أو غير موجود.
            نسمح له فقط بصفحات
            plans/payment/account.
        */

        goTo("plans.html");

        return;

    }

}


/*
    تسجيل الخروج.
*/

async function logout() {

    await supabaseClient
        .auth
        .signOut();


    window.location.href =
        "login.html";

}


/*
    تشغيل الحماية تلقائيًا
    بعد تحميل الصفحة.
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        protectBizFlow();

    }
);


/*
    متاح لباقي ملفات الموقع.
*/

window.BizFlowAuth = {

    supabaseClient,

    protectBizFlow,

    getActiveSubscription,

    isAdmin,

    logout

};

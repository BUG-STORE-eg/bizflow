const SUPABASE_URL =
  "https://oklabfxjcekfwirnqlji.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_V-_AIpoZ2IZActUyhDQ5ug_9_Lqlugp";

const { createClient } = supabase;

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ==============================
// LOGIN
// ==============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    const button =
      document.getElementById("loginBtn");

    const message =
      document.getElementById("message");

    button.disabled = true;
    button.textContent = "جاري تسجيل الدخول...";
    message.textContent = "";
    message.className = "message";


    const { error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });


    if (error) {

      message.textContent =
        getArabicError(error.message);

      message.className =
        "message error";

      button.disabled = false;
      button.textContent = "تسجيل الدخول";

      return;
    }


    message.textContent =
      "تم تسجيل الدخول بنجاح...";

    message.className =
      "message success";


    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);

  });

}


// ==============================
// REGISTER
// ==============================

const registerForm =
  document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    const confirmPassword =
      document.getElementById("confirmPassword").value;

    const button =
      document.getElementById("registerBtn");

    const message =
      document.getElementById("message");


    message.textContent = "";
    message.className = "message";


    if (password !== confirmPassword) {

      message.textContent =
        "كلمتا المرور غير متطابقتين.";

      message.className =
        "message error";

      return;
    }


    if (password.length < 6) {

      message.textContent =
        "كلمة المرور يجب أن تكون 6 أحرف على الأقل.";

      message.className =
        "message error";

      return;
    }


    button.disabled = true;
    button.textContent =
      "جاري إنشاء الحساب...";


    const { data, error } =
      await supabaseClient.auth.signUp({
        email,
        password
      });


    if (error) {

      message.textContent =
        getArabicError(error.message);

      message.className =
        "message error";

      button.disabled = false;
      button.textContent =
        "إنشاء الحساب";

      return;
    }


    if (data.session) {

      message.textContent =
        "تم إنشاء الحساب بنجاح...";

      message.className =
        "message success";


      setTimeout(() => {
        window.location.href =
          "index.html";
      }, 800);

      return;
    }


    message.textContent =
      "تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيد الحساب ثم سجل الدخول.";

    message.className =
      "message success";

    button.disabled = false;
    button.textContent =
      "إنشاء الحساب";

  });

}


// ==============================
// DASHBOARD SESSION
// ==============================

async function checkDashboardSession() {

  const {
    data,
    error
  } = await supabaseClient.auth.getSession();


  if (error || !data.session) {

    window.location.href =
      "login.html";

    return;

  }


  const userEmail =
    document.getElementById("userEmail");


  if (userEmail && data.session.user) {

    userEmail.textContent =
      data.session.user.email;

  }

}


// ==============================
// LOGOUT
// ==============================

async function logout() {

  const logoutBtn =
    document.getElementById("logoutBtn");


  if (logoutBtn) {

    logoutBtn.disabled = true;
    logoutBtn.textContent =
      "جاري تسجيل الخروج...";

  }


  const {
    error
  } = await supabaseClient.auth.signOut();


  if (error) {

    console.error(
      "Logout error:",
      error
    );


    if (logoutBtn) {

      logoutBtn.disabled = false;
      logoutBtn.textContent =
        "تسجيل الخروج";

    }

    alert(
      "حدث خطأ أثناء تسجيل الخروج. افتح Console لمعرفة الخطأ."
    );

    return;

  }


  window.location.replace("login.html");

}


// ==============================
// START
// ==============================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const logoutBtn =
      document.getElementById("logoutBtn");


    if (logoutBtn) {

      logoutBtn.addEventListener(
        "click",
        logout
      );

    }


    if (
      window.location.pathname.endsWith("/index.html") ||
      window.location.pathname.endsWith("/bizflow/") ||
      window.location.pathname === "/"
    ) {

      checkDashboardSession();

    }

  }
);


// ==============================
// ERROR TRANSLATION
// ==============================

function getArabicError(error) {

  if (!error) {
    return "حدث خطأ غير معروف.";
  }


  const text =
    error.toLowerCase();


  if (
    text.includes("invalid login credentials")
  ) {

    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";

  }


  if (
    text.includes("user already registered")
  ) {

    return "هذا البريد الإلكتروني مسجل بالفعل.";

  }


  if (
    text.includes("password should be at least")
  ) {

    return "كلمة المرور قصيرة جدًا.";

  }


  if (
    text.includes("invalid email")
  ) {

    return "البريد الإلكتروني غير صحيح.";

  }


  return "حدث خطأ. حاول مرة أخرى.";

}

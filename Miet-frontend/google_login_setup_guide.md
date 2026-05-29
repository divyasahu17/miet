# Google Login Setup Guide / गूगल लॉगिन सेटअप गाइड 🚀

This guide will walk you through setting up a brand new, free **Supabase** project and **Google OAuth** credentials to fix and enable Google Login in the Miet application.

यह गाइड आपको Miet एप्लिकेशन में गूगल लॉगिन चालू करने के लिए एक बिल्कुल नया, फ्री **Supabase** प्रोजेक्ट और **Google OAuth** क्रेडेंशियल सेटअप करने का पूरा तरीका समझाएगी।

---

## 🛠️ Step 1: Create a New Supabase Project / नया Supabase प्रोजेक्ट बनाएं
1. Go to [supabase.com](https://supabase.com) and sign in (or sign up with GitHub/Email for a free account).
   - [supabase.com](https://supabase.com) पर जाएं और लॉगिन या साइन-अप करें (फ्री अकाउंट)।
2. Click **New Project** and select your organization.
   - **New Project** पर क्लिक करें।
3. Fill in the project details:
   - **Name:** `Miet App`
   - **Database Password:** Click "Generate a password" (save it somewhere safely).
   - **Region:** Choose a region close to you (e.g., *South Asia / Mumbai* or *Singapore*).
   - **Pricing Plan:** Select **Free** tier.
4. Click **Create new project** and wait 1-2 minutes for Supabase to provision your database.
   - **Create new project** पर क्लिक करें और 1-2 मिनट प्रतीक्षा करें।

---

## 🔑 Step 2: Copy Supabase Keys to Environment Files / Supabase चाबियां एनवायरनमेंट फाइलों में कॉपी करें
Once the project is created:
जब प्रोजेक्ट बन जाए:
1. In the Supabase Sidebar, click on ⚙️ **Settings** > **API**.
   - Supabase साइडबार में ⚙️ **Settings** > **API** पर जाएं।
2. Copy the following two keys:
   - **Project URL** (e.g., `https://xxxx.supabase.co`)
   - **anon / public** key (starts with `eyJhbGci...`)
3. Open your project's `.env` files and paste them:
   - **File 1:** [Miet-frontend/.env](file:///c:/xampp/htdocs/miet/Miet-frontend/.env)
   - **File 2:** [backend_export/.env](file:///c:/xampp/htdocs/miet/backend_export/.env)
   
   Replace `YOUR_NEW_SUPABASE_PROJECT_URL` and `YOUR_NEW_SUPABASE_ANON_PUBLIC_KEY` with the values you copied.
   - इन दोनों फाइलों में `YOUR_NEW_SUPABASE_PROJECT_URL` और `YOUR_NEW_SUPABASE_ANON_PUBLIC_KEY` की जगह अपनी चाबियां पेस्ट कर दें।

---

## ☁️ Step 3: Create Google OAuth Credentials / गूगल क्लाउड क्रेडेंशियल बनाएं
1. Go to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
   - [Google Cloud Console](https://console.cloud.google.com/apis/credentials) पर जाएं।
2. Click **Create Project** at the top right if you don't have a project, or select an existing one.
   - एक नया प्रोजेक्ट बनाएं या पुराना सेलेक्ट करें।
3. Go to **OAuth consent screen** (OAuth सहमति स्क्रीन) from the sidebar:
   - Select **External** and click **Create**.
   - Fill in **App Name** (e.g., `Miet`), **User support email**, and **Developer contact information**.
   - Click **Save and Continue** until you are finished.
4. Go to **Credentials** (क्रेडेंशियल) > **+ Create Credentials** (क्रेडेंशियल बनाएं) > **OAuth client ID** (OAuth क्लाइंट आईडी):
   - **Application type:** Select **Web application** (वेब एप्लीकेशन).
   - **Name:** `Miet App Local`
5. Under **Authorized redirect URIs** (अधिकृत रीडायरेक्ट यूआरआई), click **+ Add URI** and paste:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   ⚠️ *Replace `YOUR_PROJECT_ID` with the random string in your new Supabase URL (e.g., if your URL is `https://abcd.supabase.co`, your project ID is `abcd`).*
   - *यहाँ `YOUR_PROJECT_ID` की जगह अपनी नई Supabase URL का प्रोजेक्ट आईडी डालें (जैसे: `https://abcd.supabase.co` में आईडी `abcd` है)।*
6. Click **Create** (बनाएं).
7. Copy the **Client ID** (क्लाइंट आईडी) and **Client Secret** (क्लाइंट सीक्रेट) shown in the popup.
   - पॉपअप में दिख रहे **Client ID** और **Client Secret** को कॉपी कर लें।

---

## 🔗 Step 4: Configure Google Auth in Supabase / Supabase में गूगल ऑथ सेट करें
1. Go back to your [Supabase Dashboard](https://supabase.com/dashboard).
   - अपने [Supabase Dashboard](https://supabase.com/dashboard) पर वापस आएं।
2. Go to **Authentication** > **Providers** > **Google**.
   - साइडबार में **Authentication** > **Providers** > **Google** पर जाएं।
3. Turn on **Enable Google Provider** (गूगल प्रोवाइडर चालू करें).
4. Paste the credentials you copied from Google Cloud Console:
   - **Client ID** ➡️ Paste your Google Client ID here.
   - **Client Secret** ➡️ Paste your Google Client Secret here.
5. Click **Save** at the bottom.
   - नीचे **Save** बटन पर क्लिक करें।

---

## 🌐 Step 5: Configure Redirect URLs in Supabase / Supabase में रीडायरेक्ट यूआरएल सेट करें
This ensures Supabase knows where to send the user back after they log in with Google.
इससे Supabase को पता चलता है कि यूजर को लॉगिन के बाद वापस कहाँ भेजना है।
1. In the Supabase Sidebar, go to **Authentication** > **URL Configuration**.
   - Supabase में **Authentication** > **URL Configuration** पर जाएं।
2. In the **Site URL** field, set:
   - `http://localhost:3000`
3. Under **Redirect URLs**, click **Add URL** and add:
   - `http://localhost:3000/**`  (this wildcard covers all pages and languages)
4. Click **Save** (सहेजें).

---

## 🖊️ Step 6: Paste Google Credentials in Backend .env / बैकएंड फाइल में गूगल क्रेडेंशियल डालें
1. Open [backend_export/.env](file:///c:/xampp/htdocs/miet/backend_export/.env).
   - [backend_export/.env](file:///c:/xampp/htdocs/miet/backend_export/.env) फाइल को खोलें।
2. Replace `YOUR_NEW_GOOGLE_CLIENT_ID` and `YOUR_NEW_GOOGLE_CLIENT_SECRET` with the ones you generated in Google Cloud Console.
   - `YOUR_NEW_GOOGLE_CLIENT_ID` और `YOUR_NEW_GOOGLE_CLIENT_SECRET` की जगह अपने गूगल क्रेडेंशियल डालें।

---

## 🚀 Step 7: Restart Servers and Test / सर्वर्स दोबारा चालू करें और टेस्ट करें
1. If your servers are running, **close** their command windows.
   - यदि आपके सर्वर चल रहे हैं, तो उनके कमांड विंडो को बंद (close) कर दें।
2. Open **[run_servers.bat](file:///c:/xampp/htdocs/miet/run_servers.bat)** in the main folder to start both servers fresh.
   - दोनों सर्वर्स को नए सिरे से चालू करने के लिए **[run_servers.bat](file:///c:/xampp/htdocs/miet/run_servers.bat)** फ़ाइल चलाएं।
3. Go to [http://localhost:3000/en/](http://localhost:3000/en/) and click **Login with Google** in the Topbar!
   - [http://localhost:3000/en/](http://localhost:3000/en/) पर जाएं और गूगल लॉगिन टेस्ट करें!

🎉 **All Done! Your new Google Login system is now fully integrated and secure.**
🎉 **सब तैयार है! आपका नया गूगल लॉगिन सिस्टम अब पूरी तरह से इंटीग्रेटेड और सुरक्षित है।**

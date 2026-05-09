# Proctura — CBT Deployment Guide

How to deploy Proctura on a school's CBT (Computer-Based Testing) lab so a
proctor can configure machines once and have students sit, sign in, take
their exam, and clear the session for the next student — with no IT
intervention per student.

## The shape of an exam day

1. Lecturer creates the exam, enrolls students, marks the exam **active**.
2. Proctor opens each lab machine in **Proctura** (installed as a PWA — see
   below). The browser drops onto `https://<your-school>.proctura.com/exam`.
3. Student walks up to a machine. Sees the **Sign in to take your exam**
   form. Enters either their **email** or their **matric number** plus
   password.
4. Student lands on the **exam picker**, sees only the exam(s) currently
   active for them, clicks the right one.
5. Student takes the exam (full screen, recorded, anti-cheat enabled).
6. Student submits. localStorage clears, the page hard-reloads to `/exam`,
   and the next student is greeted by the sign-in form. No proctor action
   required between students.

The machine never holds session state between students.

## Installing Proctura as a PWA on each lab machine

This gives you an icon on the desktop, no browser chrome, and a clean
"Proctura" splash screen. It is the foundation for kiosk-mode launch
(below).

### Chrome / Edge / Chromium-based browsers

1. Open `https://<your-school>.proctura.com/exam` in the browser.
2. Look in the address bar for the **install icon** (a small computer with a
   down-arrow). On Edge it sits to the right of the URL; on Chrome it's the
   same.
3. Click it. Confirm the prompt: **Install Proctura**.
4. The PWA opens in its own window. Pin it to the taskbar / dock / desktop.

### Safari (macOS)

PWA install on macOS is via **File → Add to Dock** in Safari, available as
of Safari 17. Older versions don't support installable PWAs — use Chrome or
Edge instead.

### Verify the install worked

- Launch the Proctura icon. It should open without a URL bar.
- The window header should be the dark `#0d1117` theme color.
- The first screen is the **Sign in to take your exam** form.

## Recommended: kiosk mode for exam day

PWA install gives you a clean window. **Kiosk mode** prevents students from
exiting the window, opening other apps, or interacting with the OS
underneath. Combined with the PWA, this is the closest you can get to a
locked-down exam terminal without a dedicated lockdown browser.

### Chromium kiosk launch (Linux / Windows / macOS)

```bash
# Linux / macOS
chromium --kiosk --app=https://<your-school>.proctura.com/exam

# Windows (PowerShell)
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app="https://<your-school>.proctura.com/exam"
```

Kiosk mode disables the URL bar, the bookmarks bar, the developer tools,
and most of the user-facing UI. Pressing Esc / F11 will not exit. The only
way out is to kill the process from the OS — which a proctor can do, but a
student typing on the keyboard cannot.

### Auto-launch at boot

Configure the lab machine to run the kiosk command on user login. On
Linux this is typically a `~/.config/autostart/proctura.desktop` file:

```
[Desktop Entry]
Type=Application
Name=Proctura
Exec=chromium --kiosk --app=https://<your-school>.proctura.com/exam
X-GNOME-Autostart-enabled=true
```

On Windows, add the kiosk command as a startup task via Task Scheduler or
drop a shortcut into the Startup folder.

## What kiosk mode does NOT do

Kiosk mode is a UX boundary, not a security boundary. A motivated student
can still:

- **Switch desktops / virtual workspaces** (Ctrl+Alt+→ on Linux,
  Ctrl+→ on Windows with multiple desktops).
- **Cmd+Tab / Alt+Tab** to another app if any other app is open.
- **Hard reset** the machine.

Proctura already detects most of these as **anti-cheat violations**
(visibility change, blur, fullscreen exit, copy/paste). Three violations
auto-submits the exam.

For tighter lockdown, consider a dedicated lockdown browser like Safe Exam
Browser. Proctura is browser-based and doesn't aim to replace those.

## Browser permissions (camera + microphone)

Proctura records the student's webcam and microphone for the duration of
the exam. The first time a student signs in on a lab machine, the browser
will ask for camera / mic permission — the student should click **Allow**.
The browser remembers the grant for that origin, so subsequent students on
the same machine will not be prompted again (assuming the same browser
profile is used).

If you're running in kiosk mode, you can pre-grant camera permission for
the Proctura origin via Chromium command-line flags:

```bash
chromium \
  --kiosk \
  --app=https://<your-school>.proctura.com/exam \
  --use-fake-ui-for-media-stream
```

`--use-fake-ui-for-media-stream` auto-grants camera and mic without
prompting. **Use with care** — only on machines where you trust the URL is
locked to Proctura.

## Network requirements

- HTTPS is required for camera access in production. Make sure the school
  subdomain has a valid TLS certificate.
- Recordings upload to Cloudinary or MinIO during the exam in the
  background. Per-student recording is typically 5–30 MB. Make sure the lab
  has enough upstream bandwidth (≈10 Mbps for 30 concurrent students is a
  comfortable floor).
- Judge0 (code execution) calls go from the Proctura backend, not the
  student's browser. The lab only needs HTTPS to the Proctura server.

## Troubleshooting

**Students see "you have already started this exam".**
This means the student already started the exam earlier on a different
machine or browser. Proctura now auto-resumes from the server-side
in-progress submission — so this should rarely fire. If it does, it means
the submission was already submitted; the student should not retake.

**Camera prompt keeps appearing every login.**
The browser is in incognito / private mode, or a different browser profile
is being used per session. Use a normal profile — once permission is
granted, it sticks.

**The PWA install button doesn't appear.**
The browser only shows the install prompt if (a) the manifest is reachable,
(b) the service worker is registered, and (c) the page is served over
HTTPS. In local dev (HTTP), the prompt is hidden by Chromium — this is
expected. Test on a staged HTTPS URL.

**Camera permission dropped fullscreen mid-exam.**
This was a known issue. We now request camera permission on the exam
start page, before fullscreen, so the browser remembers the grant before
the student enters the actual exam. If you still see this, your students
may be pressing **Block** instead of **Allow** — in that case the exam
proceeds without recording.

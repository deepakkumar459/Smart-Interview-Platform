// ── judge.js ──
// Judge0 CE API — Free tier via RapidAPI
// Sign up at: https://rapidapi.com/judge0-official/api/judge0-ce
// Get your free API key and replace below

const JUDGE0_URL  = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY  = 'YOUR_RAPIDAPI_KEY'; // Replace with your key
const JUDGE0_HOST = 'judge0-ce.p.rapidapi.com';

// Language IDs for Judge0
const LANGUAGE_IDS = {
  javascript: 63,  // Node.js 12.14.0
  python:     71,  // Python 3.8.1
  cpp:        54,  // C++ (GCC 9.2.0)
  java:       62,  // Java (OpenJDK 13)
  c:          50,  // C (GCC 9.2.0)
};

// ── Submit code to Judge0 ──
async function submitToJudge(code, language, stdin = '') {
  const langId = LANGUAGE_IDS[language];
  if (!langId) throw new Error(`Unsupported language: ${language}`);

  // Create submission
  const createRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': JUDGE0_KEY,
      'X-RapidAPI-Host': JUDGE0_HOST,
    },
    body: JSON.stringify({
      source_code: code,
      language_id: langId,
      stdin: stdin,
      cpu_time_limit: 5,
      memory_limit: 128000,
    }),
  });

  if (!createRes.ok) throw new Error('Failed to submit code.');
  const { token } = await createRes.json();

  // Poll for result
  return await pollResult(token);
}

// ── Poll for result ──
async function pollResult(token, attempts = 0) {
  if (attempts > 15) throw new Error('Execution timed out.');

  await sleep(1000);

  const res = await fetch(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false`, {
    headers: {
      'X-RapidAPI-Key': JUDGE0_KEY,
      'X-RapidAPI-Host': JUDGE0_HOST,
    },
  });

  const data = await res.json();

  // Status IDs: 1=In Queue, 2=Processing, 3=Accepted, 4=WA, 5=TLE, 6=CE, 11+=Runtime Error
  if (data.status.id <= 2) {
    return await pollResult(token, attempts + 1);
  }

  return data;
}

// ── Parse and display result ──
function displayResult(result, outputEl) {
  const statusId = result.status.id;

  outputEl.innerHTML = '';

  if (statusId === 3) {
    // Accepted / Successful run
    const output = result.stdout ? result.stdout.trim() : '(no output)';
    outputEl.innerHTML = `
      <div class="output-success">✅ Success</div>
      <div style="margin-top:0.5rem;color:var(--text-secondary)">Output:</div>
      <pre style="margin-top:0.25rem;color:var(--text-primary)">${escapeHtml(output)}</pre>
      <div style="margin-top:0.75rem;color:var(--text-muted);font-size:0.75rem">
        ⏱ Time: ${result.time || '-'}s &nbsp;|&nbsp; 💾 Memory: ${result.memory || '-'} KB
      </div>
    `;
    return { passed: true, output };

  } else if (statusId === 4) {
    // Wrong Answer
    outputEl.innerHTML = `<div class="output-error">❌ Wrong Answer</div>
      <pre style="margin-top:0.5rem;color:var(--text-secondary)">${escapeHtml(result.stdout || '')}</pre>`;
    return { passed: false };

  } else if (statusId === 5) {
    outputEl.innerHTML = `<div class="output-error">⏱ Time Limit Exceeded</div>`;
    return { passed: false };

  } else if (statusId === 6) {
    outputEl.innerHTML = `<div class="output-error">🔴 Compilation Error</div>
      <pre style="margin-top:0.5rem;color:var(--red)">${escapeHtml(result.compile_output || '')}</pre>`;
    return { passed: false };

  } else {
    // Runtime error
    outputEl.innerHTML = `<div class="output-error">💥 Runtime Error</div>
      <pre style="margin-top:0.5rem;color:var(--red)">${escapeHtml(result.stderr || result.message || 'Unknown error')}</pre>`;
    return { passed: false };
  }
}

// ── Save submission to Firestore ──
async function saveSubmission(userId, problemId, problem, code, language, status, result) {
  try {
    // Save to submissions collection
    await db.collection('submissions').add({
      userId,
      problemId,
      problemTitle: problem.title,
      difficulty: problem.difficulty,
      code,
      language,
      status,   // 'Accepted' | 'Wrong Answer' | 'Error'
      runtime: result.time || null,
      memory: result.memory || null,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // If accepted — update user stats
    if (status === 'Accepted') {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      const data    = userDoc.data();

      if (!data.solved.includes(problemId)) {
        const diffKey = problem.difficulty.toLowerCase() + 'Count';
        const points  = { easy: 10, medium: 25, hard: 50 }[problem.difficulty.toLowerCase()] || 10;

        await userRef.update({
          solved:           firebase.firestore.FieldValue.arrayUnion(problemId),
          submissions:      firebase.firestore.FieldValue.increment(1),
          score:            firebase.firestore.FieldValue.increment(points),
          [diffKey]:        firebase.firestore.FieldValue.increment(1),
        });
      } else {
        await userRef.update({ submissions: firebase.firestore.FieldValue.increment(1) });
      }
    } else {
      const userRef = db.collection('users').doc(userId);
      await userRef.update({ submissions: firebase.firestore.FieldValue.increment(1) });
    }
  } catch (err) {
    console.error('Failed to save submission:', err);
  }
}

// ── Helpers ──
const sleep = ms => new Promise(r => setTimeout(r, ms));
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
